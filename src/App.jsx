import React from "react";
import HomePage from "./pages/HomePage.jsx";
import Navbar from "./components/Navbar.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import SignUpUser from "./pages/SignUpUser.jsx";
import SignUpSchool from "./pages/SignUpSchool.jsx";
import SignUpAdmin from "./pages/SignUpAdmin.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SeePublicComplaints from "./pages/SeePublicComplaints.jsx";
import HowItWorksPage from "./pages/HowItWorksPage.jsx";
import AdminProfile from "./pages/AdminProfile.jsx";
import SchoolProfile from "./pages/SchoolProfile.jsx";
import StudentProfile from "./pages/StudentProfile.jsx";
import ComplaintRegister from "./pages/ComplaintRegister.jsx";
import CreateFeedbackBySchool from "./pages/CreateFeedbackBySchool.jsx";
import SchoolsWithFeedback from "./pages/SchoolsWithFeedback.jsx";

import AdminControlPainel from "./pages/AdminControlPanel.jsx";
import SchoolControlPanel from "./pages/SchoolControlPanel.jsx";
import StudentControlPanel from "./pages/StudentControlPanel.jsx";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Security/AuthContext.jsx";
import ProtectedRoute from "./Security/ProtectedRoute.jsx";

const App = () => {
  return (
    <>
      <Router>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/signup-user" element={<SignUpUser />} />
            <Route path="/signup-school" element={<SignUpSchool />} />
            <Route path="/signup-admin" element={<SignUpAdmin />} />
            <Route path="/schoolsfeedback" element={<SchoolsWithFeedback />} />
            <Route
              path="/seepubliccomplaints"
              element={<SeePublicComplaints />}
            />
            <Route path="/howitworks" element={<HowItWorksPage />} />

            <Route
              path="/adminprofile"
              element={
                <ProtectedRoute allowedUserTypes={["admin"]}>
                  <AdminProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admincontrolpanel"
              element={
                <ProtectedRoute allowedUserTypes={["admin"]}>
                  <AdminControlPainel />
                </ProtectedRoute>
              }
            />

            <Route
              path="/schoolprofile"
              element={
                <ProtectedRoute allowedUserTypes={["school"]}>
                  <SchoolProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/schoolcontrolpanel"
              element={
                <ProtectedRoute allowedUserTypes={["school"]}>
                  <SchoolControlPanel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/createfeedback"
              element={
                <ProtectedRoute allowedUserTypes={["school"]}>
                  <CreateFeedbackBySchool />
                </ProtectedRoute>
              }
            />
            <Route
              path="/studentprofile"
              element={
                <ProtectedRoute allowedUserTypes={["student"]}>
                  <StudentProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/studentcontrolpanel"
              element={
                <ProtectedRoute allowedUserTypes={["student"]}>
                  <StudentControlPanel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/complaintregister"
              element={
                <ProtectedRoute allowedUserTypes={["student"]}>
                  <ComplaintRegister />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
};

export default App;
