const express = require("express");
const router = express.Router();
const connectEnsureLogin = require("connect-ensure-login");
const upload = require("../utils/upload");
const fs = require("fs");
const path = require("path");
const User = require("../models/user");
const Patient = require("../models/patient");
const { sendNotification } = require("../utils/notificationService");

router.get(
  "/all-patients",
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    try {
      const loggedInUser = await User.findById(req.session.user._id);
      let patients;

      if (loggedInUser.role === "administrator") {
        patients = await Patient.find().populate([
          { path: "recievedBy", select: "userName role" },
          { path: "updatedBy", select: "userName role" },
        ]);
      } else if (loggedInUser.role === "doctor") {
        patients = await Patient.find({
          assignedTo: loggedInUser.room,
        }).populate([
          { path: "recievedBy", select: "userName role" },
          { path: "updatedBy", select: "userName" },
        ]);
      } else if (loggedInUser.role === "nurse") {
        patients = await Patient.find({
          recievedBy: loggedInUser._id,
        }).populate([
          { path: "recievedBy", select: "userName role" },
          { path: "updatedBy", select: "userName role" },
        ]);
      } else {
        await sendNotification(
          "Permission Denied",
          "Only authorized users can view patients",
          "error"
        );
        return res.redirect("/dashboard");
      }

      res.render(`${loggedInUser.role}/patients-list`, {
        patients,
        loggedInUser,
        activeSidebarLink: "patients",
      });
    } catch (error) {
      await sendNotification(
        "Failed To Get All Patients",
        "Unable to retrieve patient data. Please try again",
        "error"
      );
      res.status(400).redirect("/dashboard");
      console.error("Error fetching patients:", error);
    }
  }
);

router.get(
  "/add-patient",
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    try {
      const loggedInUser = await User.findOne({ _id: req.session.user._id });
      const doctors = await User.find({ role: "doctor" });

      if (req.session.user.role === "nurse") {
        res.render("nurse/add-patient", {
          activeSidebarLink: "add-patient",
          loggedInUser,
          doctors,
        });
      } else {
        await sendNotification(
          "Permission Denied",
          "Only nurses are allowed to add patients",
          "error"
        );
        return res.redirect("/all-patients");
      }
    } catch (error) {
      await sendNotification(
        "Failed To Add Patient",
        "Unable to add new patient. Please try again",
        "error"
      );
      res.status(400).redirect("/dashboard");
      console.error("Error adding patient:", error);
    }
  }
);

router.post(
  "/add-patient",
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    try {
      if (req.session.user.role === "nurse") {
        const newPatient = new Patient(req.body);
        await newPatient.save();
        await sendNotification(
          "Patient Added",
          "A patient has been successfully added",
          "success"
        );
        return res.redirect("/all-patients");
      } else {
        await sendNotification(
          "Permission Denied",
          "Only nurses are allowed to add patients",
          "error"
        );
        return res.redirect("/all-patients");
      }
    } catch (error) {
      await sendNotification(
        "Failed To Add Patient",
        "Unable to add new patient. Please try again",
        "error"
      );
      console.error("Error adding patient:", error);
      res.status(500).render("nurse/add-patient");
    }
  }
);

router.get(
  "/view-patient/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    try {
      const loggedInUser = await User.findById(req.session.user._id);

      if (["administrator", "doctor", "nurse"].includes(loggedInUser.role)) {
        const patient = await Patient.findById(req.params.id).populate([
          { path: "recievedBy", select: "userName role" },
          { path: "updatedBy", select: "userName" },
        ]);
        res.render(`${loggedInUser.role}/patient-details`, {
          patient,
          loggedInUser,
          activeSidebarLink: "patients",
        });
      } else {
        await sendNotification(
          "Permission Denied",
          "Only authorised users can view patients' information",
          "error"
        );
        return res.redirect("/all-patients");
      }
    } catch (error) {
      await sendNotification(
        "Failed To Get Patient",
        "Unable to retrieve patient's data. Please try again",
        "error"
      );
      res.status(400).redirect("/all-patients");
      console.error("Error fetching patient data:", error);
    }
  }
);

router.get(
  "/admission/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    try {
      const loggedInUser = await User.findById(req.session.user._id);

      if (["administrator", "doctor", "nurse"].includes(loggedInUser.role)) {
        const patient = await Patient.findById(req.params.id).populate([
          { path: "recievedBy", select: "userName role" },
          { path: "updatedBy", select: "userName" },
        ]);
        res.render(`${loggedInUser.role}/admission-form`, {
          patient,
          loggedInUser,
          activeSidebarLink: "patients",
        });
      } else {
        await sendNotification(
          "Permission Denied",
          "Only authorised users can view patients' information",
          "error"
        );
        return res.redirect("/all-patients");
      }
    } catch (error) {
      await sendNotification(
        "Failed To Get Patient",
        "Unable to retrieve patient's data. Please try again",
        "error"
      );
      res.status(400).redirect("/all-patients");
      console.error("Error fetching patient data:", error);
    }
  }
);

router.get(
  "/update-patient/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    try {
      const loggedInUser = await User.findById(req.session.user._id);
      const doctors = await User.find({ role: "doctor" });

      if (["doctor", "nurse"].includes(loggedInUser.role)) {
        const patient = await Patient.findById(req.params.id);
        res.render(`${loggedInUser.role}/update-patient`, {
          doctors,
          patient,
          loggedInUser,
          activeSidebarLink: "patients",
        });
      } else {
        await sendNotification(
          "Permission Denied",
          "Only doctors and nurses can update patient's data",
          "error"
        );
        return res.redirect("/all-patients");
      }
    } catch (error) {
      await sendNotification(
        "Failed To Update Patient",
        "Unable to update patient's data. Please try again",
        "error"
      );
      res.status(400).redirect("/all-patients");
      console.error("Error updating patient data:", error);
    }
  }
);

router.post(
  "/update-patient",
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    try {
      if (["doctor", "nurse"].includes(req.session.user.role)) {
        await Patient.findByIdAndUpdate(req.query.id, req.body);

        await sendNotification(
          "Patient Updated",
          "Patient's details have been updated successfully.",
          "success"
        );
        return res.redirect(`/view-patient/${req.query.id}`);
      } else {
        await sendNotification(
          "Permission Denied",
          "Only doctors and nurses can update patient's data",
          "error"
        );
        return res.redirect("/all-patients");
      }
    } catch (error) {
      await sendNotification(
        "Failed To Update Patient",
        "Unable to update patient's data. Please try again",
        "error"
      );
      res.status(400).redirect("/all-patients");
      console.error("Error updating patient data:", error);
    }
  }
);

router.post(
  "/delete-patient",
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    try {
      if (req.session.user.role === "administrator") {
        await Patient.findByIdAndDelete(req.body.id);
        await sendNotification(
          "Patient Deleted",
          "A patient has been deleted successfully.",
          "success"
        );
        return res.redirect("/all-patients");
      } else {
        await sendNotification(
          "Permission Denied",
          "Only administrators can delete patient's data",
          "error"
        );
        return res.redirect("/all-patients");
      }
    } catch (error) {
      await sendNotification(
        "Failed To Delete Patient",
        "Unable to delete patient's data. Please try again",
        "error"
      );
      res.status(400).redirect("/all-patients");
      console.error("Error deleting patient data:", error);
    }
  }
);
router.post(
  "/call-patient",
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    try {
      if (req.session.user.role === "doctor") {
        const { patientNumber } = req.body;
        const patient = await Patient.findOne({ patientNumber });

        if (!patient) {
          await sendNotification(
            "Patient Not Found",
            "The patient you are trying to call was not found.",
            "error"
          );
          return res.redirect("/all-patients");
        }

        // Emit event to notify frontend about the patient being called
        req.app.get("io").emit("patientCalled", {
          localMessage: `Omurwade ${patient.patientNumber} bakuyita mu ${patient.assignedTo}`,
          message: `Calling patient ${patient.patientNumber} to proceed to ${patient.assignedTo}`,
        });

        // Mark the patient as called and save
        patient.patientCalled = true;
        await patient.save();

        await sendNotification(
          "Patient Called",
          `Patient ${patient.patientNumber} has been successfully called.`,
          "success"
        );
        return res.redirect("/all-patients");
      } else {
        await sendNotification(
          "Permission Denied",
          "Only doctors can call patients",
          "error"
        );
        return res.redirect("/all-patients");
      }
    } catch (error) {
      // Handle errors
      await sendNotification(
        "Failed To Call Patient",
        "Unable to call the patient at the moment. Please try again later.",
        "error"
      );
      res.status(400).redirect("/all-patients");
      console.error("Error calling patient:", error);
    }
  }
);

module.exports = router;
