import mongoose from "mongoose";
import PatientRecord from "../models/patientRecord.models.js";

export const createPatientRecord = async (req, res) => {
  const userId = req.user._id;
  const {
    patientName,
    mobileNumber,
    age,
    gender,
    doctorName,
    labName,
    testType,
    barcodeNumber,
    amountPaid,
    amountDue,
    dateOfVisit,
    dateOfReport,
  } = req.body;

  try {
    const newRecord = new PatientRecord({
      userId,
      patientName,
      mobileNumber,
      age,
      gender,
      doctorName,
      labName,
      testType,
      barcodeNumber,
      amountPaid,
      amountDue,
      dateOfVisit,
      dateOfReport,
    });

    if (newRecord) {
      await newRecord.save();
      res.status(201).json({
        success: true,
        message: "Patient record created successfully",
        data: newRecord,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid patient record",
      });
    }
  } catch (error) {
    console.error("Error in create record: ", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create patient record",
    });
  }
};

export const editPatientRecord = async (req, res) => {
  const { id } = req.params; // Assuming you pass the patient record ID in the URL
  const {
    patientName,
    mobileNumber,
    age,
    gender,
    doctorName,
    labName,
    testType,
    barcodeNumber,
    amountPaid,
    amountDue,
    dateOfVisit,
    dateOfReport,
  } = req.body;

  try {
    const updatedRecord = await PatientRecord.findByIdAndUpdate(
      id,
      {
        patientName,
        mobileNumber,
        age,
        gender,
        doctorName,
        labName,
        testType,
        barcodeNumber,
        amountPaid,
        amountDue,
        dateOfVisit,
        dateOfReport,
      },
      { new: true }
    );

    if (updatedRecord) {
      res.status(200).json({
        success: true,
        message: "Patient record updated successfully",
        data: updatedRecord,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Patient record not found",
      });
    }
  } catch (error) {
    console.error("Error in edit record: ", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update patient record",
    });
  }
};

export const deletePatientRecord = async (req, res) => {
  const { id } = req.params; // Assuming you pass the patient record ID in the URL

  try {
    const deletedRecord = await PatientRecord.findByIdAndDelete(id);

    if (deletedRecord) {
      res.status(200).json({
        success: true,
        message: "Patient record deleted successfully",
        data: deletedRecord,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Patient record not found",
      });
    }
  } catch (error) {
    console.error("Error in delete record: ", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete patient record",
    });
  }
};

// export const getAllPatientRecords = async (req, res) => {
//   const userId = req.user._id;
//   console.log({ query: req.query });
//   const { search } = req.query;

//   try {
//     const patientRecords = await PatientRecord.find({ userId }).sort({
//       createdAt: -1,
//     });

//     res.status(200).json({
//       success: true,
//       message: "Patient records retrieved successfully",
//       data: patientRecords,
//     });
//   } catch (error) {
//     console.error("Error in get all records: ", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Failed to retrieve patient records",
//     });
//   }
// };

export const getAllPatientRecords = async (req, res) => {
  const userId = req.user._id;
  const {
    search,
    startDate,
    endDate,
    sortTime,
    page = 1,
    pageSize = 10,
  } = req.query;

  try {
    let query = { userId };

    // Add search filter
    if (search) {
      const searchRegex = new RegExp(search, "i"); // case-insensitive regex
      query.$or = [
        { patientName: searchRegex },
        { doctorName: searchRegex },
        { barcodeNumber: searchRegex },
        { mobileNumber: searchRegex },
        { labName: searchRegex },
      ];
    }

    // Add date range filter on dateOfVisit
    if (startDate || endDate) {
      query.dateOfVisit = {};
      if (startDate) {
        query.dateOfVisit.$gte = new Date(startDate);
      }
      if (endDate) {
        query.dateOfVisit.$lte = new Date(endDate);
      }
    }

    // Add sortTime filter
    if (sortTime) {
      const now = new Date();
      let pastDate;

      switch (sortTime) {
        case "3-months":
          pastDate = new Date(now.setMonth(now.getMonth() - 3));
          break;
        case "6-months":
          pastDate = new Date(now.setMonth(now.getMonth() - 6));
          break;
        case "1-year":
          pastDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        default:
          pastDate = null;
      }

      if (pastDate) {
        if (!query.dateOfVisit) {
          query.dateOfVisit = {};
        }
        query.dateOfVisit.$gte = pastDate;
      }
    }

    // Calculate the number of documents to skip based on the current page and page size
    const skip = (page - 1) * pageSize;

    // Find patient records with pagination
    const patientRecords = await PatientRecord.find(query)
      .sort({ dateOfVisit: -1 })
      .skip(skip)
      .limit(parseInt(pageSize));

    // Get the total count of patient records matching the query
    const totalRecords = await PatientRecord.countDocuments(query);

    // Get total earnings and total due
    const totalAggregation = await PatientRecord.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: "$amountPaid" },
          totalDue: { $sum: "$amountDue" },
          totalPatients: { $sum: 1 },
        },
      },
    ]);

    const totalEarnings = totalAggregation[0]?.totalEarnings || 0;
    const totalDue = totalAggregation[0]?.totalDue || 0;
    const totalPatients = totalAggregation[0]?.totalPatients || 0;

    // Get monthly earnings, due, and patient count for the current month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const monthlyAggregation = await PatientRecord.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId), // Corrected the ObjectId constructor
          dateOfVisit: {
            $gte: firstDayOfMonth,
            $lte: lastDayOfMonth,
          },
        },
      },
      {
        $group: {
          _id: null,
          monthlyEarnings: { $sum: "$amountPaid" },
          monthlyDue: { $sum: "$amountDue" },
          monthlyPatients: { $sum: 1 },
        },
      },
    ]);

    const monthlyEarnings = monthlyAggregation[0]?.monthlyEarnings || 0;
    const monthlyDue = monthlyAggregation[0]?.monthlyDue || 0;
    const monthlyPatients = monthlyAggregation[0]?.monthlyPatients || 0;

    res.status(200).json({
      success: true,
      message: "Patient records retrieved successfully",
      data: patientRecords,
      totalRecords,
      totalPages: Math.ceil(totalRecords / pageSize),
      currentPage: parseInt(page),
      totalEarnings,
      totalDue,
      totalPatients,
      monthlyEarnings,
      monthlyDue,
      monthlyPatients,
    });
  } catch (error) {
    console.error("Error in get all records: ", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve patient records",
    });
  }
};
