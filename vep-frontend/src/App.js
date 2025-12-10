import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./utils/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Unauthorized from "./pages/Unauthorized";
import AdminDashboard from "./pages/AdminDashboard";
import SpeakerDashboard from "./pages/SpeakerDashboard";
import AdminEvents from "./pages/AdminEvents";
import EditEvent from "./pages/EditEvent";
import ExhibitorsList from "./pages/ExhibitorsList";
import CreateExhibitor from "./pages/CreateExhibitor";
import EditExhibitor from "./pages/EditExhibitor";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/events"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminEvents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/speaker/dashboard"
          element={
            <ProtectedRoute allowedRoles={["speaker"]}>
              <SpeakerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin", "speaker", "attendee"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events/:id/edit"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <EditEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events/:eventId/exhibitors"
          element={
            <ProtectedRoute roles={["admin"]}>
              <ExhibitorsList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/events/:eventId/exhibitors/create"
          element={
            <ProtectedRoute roles={["admin"]}>
              <CreateExhibitor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/exhibitors/:id/edit"
          element={
            <ProtectedRoute roles={["admin"]}>
              <EditExhibitor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/exhibitors/:exhibitorId/booth"
          element={
            <ProtectedRoute role="admin">
              <BoothEditor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/exhibitors/:exhibitorId/booth/view"
          element={
            <ProtectedRoute role="admin">
              <ExhibitorBooth />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
