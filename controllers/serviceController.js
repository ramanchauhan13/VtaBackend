import Service from "../models/Service.js";

// Create a new service
export const createService = async (req, res) => {
  try {
    const { name, description, requiredDocuments, estimatedProcessingDays } =
      req.body;

    // Basic Validation
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "Name and Description are required",
      });
    }

    // Check duplicate service
    const exists = await Service.findOne({ name: name.trim() });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "A service with this name already exists",
      });
    }

    // Validate requiredDocuments (must be an array)
    if (requiredDocuments && !Array.isArray(requiredDocuments)) {
      return res.status(400).json({
        success: false,
        message: "requiredDocuments must be an array",
      });
    }

    // Validate estimatedProcessingDays
    if (
      estimatedProcessingDays &&
      (isNaN(estimatedProcessingDays) || estimatedProcessingDays < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "estimatedProcessingDays must be a positive number",
      });
    }

    const newService = new Service({
      name: name.trim(),
      description,
      requiredDocuments,
      estimatedProcessingDays,
    });

    const savedService = await newService.save();

    res.status(201).json({
      success: true,
      data: savedService,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Get all active services
export const getAllServices = async (req, res) => {
  console.log("Fetching all services");
  try {
    const services = await Service.find({ isActive: true });
    res.status(200).json({ success: true, data: services });
    console.log(services);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get service by ID
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }
    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update service by ID
export const updateService = async (req, res) => {
  try {
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedService) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }

    res.status(200).json({ success: true, data: updatedService });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete service by ID
export const deleteService = async (req, res) => {
  try {
    const deletedService = await Service.findByIdAndDelete(req.params.id);

    if (!deletedService) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }

    res.status(200).json({ success: true, data: deletedService });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleServiceStatus = async (req, res) => {
  try {
    // Find service first
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }

    // Toggle status
    service.isActive = !service.isActive;

    // Save updated document
    await service.save();

    res.status(200).json({
      success: true,
      message: `Service ${service.isActive ? "activated" : "deactivated"}`,
      data: service,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

