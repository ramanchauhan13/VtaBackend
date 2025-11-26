import Request from "../models/Request.js";
import Service from "../models/Service.js";
import User from "../models/User.js";

// --------------------------------------------------
// CREATE NEW REQUEST
// --------------------------------------------------
export const createRequest = async (req, res) => {
  try {
    const userId = req.userId; // from auth middleware
    const { serviceId, formData, documents } = req.body;

    // Validate service
    const serviceExists = await Service.findById(serviceId);
    if (!serviceExists) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    const request = new Request({
      user: userId,
      service: serviceId,
      formData: formData || {},
      documents: documents || [],
    });

    await request.save();

    return res.status(201).json({
      success: true,
      message: "Request created successfully",
      data: request,
    });
  } catch (error) {
    console.error("Create Request Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// --------------------------------------------------
// GET REQUEST BY ID (Access only your own request)
// --------------------------------------------------
export const getRequestById = async (req, res) => {
  try {
    const userId = req.userId; // logged-in user

    const request = await Request.findOne({
      user: userId,
    })
      .populate("user", "name email")
      .populate("service", "name description")
      .lean();

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "No request found or not authorized",
      });
    }

    return res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.error("Get Request By ID Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// --------------------------------------------------
// GET ALL REQUESTS (ADMIN ONLY)
// --------------------------------------------------
export const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate("user", "firstName lastName email phone")
      .populate("service", "name description")
      .lean();

    return res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error("Get All Requests Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const updateRequestStatus = async (req, res) => {
  console.log(req.body);
  try {
    const { requestId } = req.params;
    const { newStatus, rejectedReason, outputs } = req.body;
    const adminId = req.userId;

    // Validate status
    const validStatuses = ["pending", "processing", "completed", "rejected", "cancelled"];
    if (!validStatuses.includes(newStatus)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found." });
    }

    // Update status
    request.status = newStatus;

    // If rejected, store reason
    if (newStatus === "rejected" && rejectedReason) {
      request.rejectedReason = rejectedReason;
    }

    if (newStatus === "completed") {
      request.completedAt = new Date();
      if (outputs && Array.isArray(outputs)) {
        request.outputs.push(...outputs.map(output => ({
          label: output.label,
          url: output.url,
          uploadedAt: new Date(),
          uploadedBy: adminId,
        })));
      }
    }

    await request.save();

    res.status(200).json({ message: "Request status updated successfully.", request });
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
