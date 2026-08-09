import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import AuthWatcher from "./AuthWatcher";

// General pages
import WelcomePage from "../pages/general/WelcomePage";
import AboutPage from "../pages/general/AboutPage";
import SearchPage from "../pages/general/SearchPage";
import ClinicsPage from "../pages/general/ClinicsPage";
import NotImplementedPage from "../pages/general/NotImplementedPage";
import NotFoundPage from "../pages/NotFoundPage";

// Guest pages
import GuestBookingPage from "../pages/guest/GuestBookingPage";
import GuestAppointmentSuccessPage from "../pages/guest/GuestAppointmentSuccessPage";

// Patient pages
import PatientLoginPage from "../pages/patient/PatientLoginPage";
import PatientRegisterPage from "../pages/patient/PatientRegisterPage";
import PatientRegisterSuccessPage from "../pages/patient/PatientRegisterSuccessPage";
import PatientDashboardPage from "../pages/patient/PatientDashboardPage";
import PatientInformationPage from "../pages/patient/PatientInformationPage";
import PatientAppointmentsPage from "../pages/patient/PatientAppointmentsPage";
import PatientBookingPage from "../pages/patient/PatientBookingPage";
import PatientAppointmentSuccessPage from "../pages/patient/PatientAppointmentSuccessPage";
import PatientUpdateAppointmentPage from "../pages/patient/PatientUpdateAppointmentsPage";
import PatientAppointmentUpdatedSuccessPage from "../pages/patient/PatientAppointmentUpdatedSuccessPage";

// Admin pages
import AdminLoginPage from "../pages/admin/AdminLoginPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminClinicsPage from "../pages/admin/AdminClinicsPage";
import AdminDoctorsPage from "../pages/admin/AdminDoctorsPage";
import AdminSpecialitiesPage from "../pages/admin/AdminSpecialitiesPage";
import AdminPatientsPage from "../pages/admin/AdminPatientsPage";
import AdminAdminsPage from "../pages/admin/AdminAdminPage";
import AdminUpdatePatientPage from "../pages/admin/AdminUpdatePatientPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      // Home
      {
        index: true,
        element: <WelcomePage />,
      },

      // Public routes
      {
        path: "book",
        element: <GuestBookingPage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "clinics",
        element: <ClinicsPage />,
      },
      {
        path: "login",
        element: <PatientLoginPage />,
      },
      {
        path: "register",
        element: <PatientRegisterPage />,
      },
      {
        path: "register/success",
        element: <PatientRegisterSuccessPage />,
      },
      {
        path: "appointment/success",
        element: <GuestAppointmentSuccessPage />,
      },

      // Patient protected routes
      // Patient protected routes
      {
        path: "patient/dashboard",
        element: (
          <>
            <AuthWatcher tokenName="token" redirectTo="/login" />
            <ProtectedRoute tokenName="token" redirectTo="/login">
              <PatientDashboardPage />
            </ProtectedRoute>
          </>
        ),
      },
      {
        path: "patient/information",
        element: (
          <>
            <AuthWatcher tokenName="token" redirectTo="/login" />
            <ProtectedRoute tokenName="token" redirectTo="/login">
              <PatientInformationPage />
            </ProtectedRoute>
          </>
        ),
      },
      {
        path: "patient/appointments",
        element: (
          <>
            <AuthWatcher tokenName="token" redirectTo="/login" />
            <ProtectedRoute tokenName="token" redirectTo="/login">
              <PatientAppointmentsPage />
            </ProtectedRoute>
          </>
        ),
      },
      {
        path: "patient/book",
        element: (
          <>
            <AuthWatcher tokenName="token" redirectTo="/login" />
            <ProtectedRoute tokenName="token" redirectTo="/login">
              <PatientBookingPage />
            </ProtectedRoute>
          </>
        ),
      },
      {
        path: "patient/book/success",
        element: (
          <>
            <AuthWatcher tokenName="token" redirectTo="/login" />
            <ProtectedRoute tokenName="token" redirectTo="/login">
              <PatientAppointmentSuccessPage />
            </ProtectedRoute>
          </>
        ),
      },
      {
        path: "patient/appointments/:id/edit",
        element: (
          <>
            <AuthWatcher tokenName="token" redirectTo="/login" />
            <ProtectedRoute tokenName="token" redirectTo="/login">
              <PatientUpdateAppointmentPage />
            </ProtectedRoute>
          </>
        ),
      },
      {
        path: "patient/appointments/update-success",
        element: (
          <>
            <AuthWatcher tokenName="token" redirectTo="/login" />
            <ProtectedRoute tokenName="token" redirectTo="/login">
              <PatientAppointmentUpdatedSuccessPage />
            </ProtectedRoute>
          </>
        ),
      },

      // Admin public route
      {
        path: "admin/login",
        element: <AdminLoginPage />,
      },

      // Admin protected routes
      {
        path: "admin",
        element: (
          <>
            <AuthWatcher tokenName="adminToken" redirectTo="/admin/login" />
            <ProtectedRoute tokenName="adminToken" redirectTo="/admin/login">
              <AdminDashboardPage />
            </ProtectedRoute>
          </>
        ),
      },
      {
        path: "admin/dashboard",
        element: (
          <>
            <AuthWatcher tokenName="adminToken" redirectTo="/admin/login" />
            <ProtectedRoute tokenName="adminToken" redirectTo="/admin/login">
              <AdminDashboardPage />
            </ProtectedRoute>
          </>
        ),
      },
      {
        path: "admin/clinics",
        element: (
          <>
            <AuthWatcher tokenName="adminToken" redirectTo="/admin/login" />
            <ProtectedRoute tokenName="adminToken" redirectTo="/admin/login">
              <AdminClinicsPage />
            </ProtectedRoute>
          </>
        ),
      },
      {
        path: "admin/doctors",
        element: (
          <>
            <AuthWatcher tokenName="adminToken" redirectTo="/admin/login" />
            <ProtectedRoute tokenName="adminToken" redirectTo="/admin/login">
              <AdminDoctorsPage />
            </ProtectedRoute>
          </>
        ),
      },
      {
        path: "admin/specialities",
        element: (
          <>
            <AuthWatcher tokenName="adminToken" redirectTo="/admin/login" />
            <ProtectedRoute tokenName="adminToken" redirectTo="/admin/login">
              <AdminSpecialitiesPage />
            </ProtectedRoute>
          </>
        ),
      },
      {
        path: "admin/patients",
        element: (
          <>
            <AuthWatcher tokenName="adminToken" redirectTo="/admin/login" />
            <ProtectedRoute tokenName="adminToken" redirectTo="/admin/login">
              <AdminPatientsPage />
            </ProtectedRoute>
          </>
        ),
      },
      {
        path: "admin/patients/:id/edit",
        element: (
          <>
            <AuthWatcher tokenName="adminToken" redirectTo="/admin/login" />
            <ProtectedRoute tokenName="adminToken" redirectTo="/admin/login">
              <AdminUpdatePatientPage />
            </ProtectedRoute>
          </>
        ),
      },
      {
        path: "admin/admins",
        element: (
          <>
            <AuthWatcher tokenName="adminToken" redirectTo="/admin/login" />
            <ProtectedRoute tokenName="adminToken" redirectTo="/admin/login">
              <AdminAdminsPage />
            </ProtectedRoute>
          </>
        ),
      },

      // Placeholder route
      {
        path: "not-implemented",
        element: <NotImplementedPage />,
      },

      // 404 route
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;
