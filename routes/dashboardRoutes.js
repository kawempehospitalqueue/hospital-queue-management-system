const express = require("express");
const router = express.Router();
const connectEnsureLogin = require("connect-ensure-login");
const User = require("../models/user");
const Patient = require("../models/patient");
const { sendNotification } = require("../utils/notificationService");

// Dashboard Route
router.get(
  "/dashboard",
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    try {
      const loggedInUser = await User.findById(req.session.user._id);

      // Common Aggregations
      const totalPatients = await Patient.countDocuments();
      const waitingPatients = await Patient.countDocuments({
        patientCalled: false,
      });
      const treatedPatients = await Patient.countDocuments({
        patientCalled: true,
      });
      const weeklyPatients = await Patient.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      });
      const treatedThisweek = await Patient.countDocuments({
        updatedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        patientCalled: true,
      });

      // Role-Specific Aggregations
      let totalUsers, totalDoctors, totalNurses;
      let assignedPatients, assignedNotCalled, assignedCalled;
      let recievedPatients, receivedNotCalled, receivedCalled;
      if (loggedInUser.role === "administrator") {
        totalUsers = await User.countDocuments();
        totalDoctors = await User.countDocuments({ role: "doctor" });
        totalNurses = await User.countDocuments({ role: "nurse" });
      } else if (loggedInUser.role === "doctor") {
        assignedPatients = await Patient.countDocuments({
          assignedTo: loggedInUser.room,
        });
        assignedNotCalled = await Patient.countDocuments({
          assignedTo: loggedInUser.room,
          patientCalled: false,
        });
        assignedCalled = await Patient.countDocuments({
          assignedTo: loggedInUser.room,
          patientCalled: true,
        });
      } else if (loggedInUser.role === "nurse") {
        recievedPatients = await Patient.countDocuments({
          recievedBy: loggedInUser._id,
        });
        receivedNotCalled = await Patient.countDocuments({
          recievedBy: loggedInUser._id,
          patientCalled: false,
        });
        receivedCalled = await Patient.countDocuments({
          recievedBy: loggedInUser._id,
          patientCalled: true,
        });
      }

      res.render(`${loggedInUser.role}/dashboard`, {
        activeSidebarLink: "dashboard",
        loggedInUser,
        totalPatients,
        waitingPatients,
        treatedPatients,
        treatedThisweek,
        weeklyPatients,
        totalUsers,
        totalDoctors,
        totalNurses,
        assignedPatients,
        recievedPatients,
        receivedNotCalled,
        assignedNotCalled,
        receivedCalled,
        assignedCalled,
      });
    } catch (error) {
      await sendNotification(
        "Failed To View Dashboard",
        "Unable to load dashboard. Please try again",
        "error"
      );
      res.status(400).redirect("/");
      console.error("Error fetching dashboard data:", error);
    }
  }
);

module.exports = router;
