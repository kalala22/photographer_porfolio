import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ClientGalleryPage from "./pages/ClientGalleryPage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import DashboardPage from "./pages/admin/DashboardPage";
import CreateGalleryPage from "./pages/admin/CreateGalleryPage";
import GalleryDetailPage from "./pages/admin/GalleryDetailPage";

const App: React.FC = () => {
  return (
    <Routes>
      {/* Public: Portfolio */}
      <Route path="/" element={<HomePage />} />

      {/* Public: Client gallery via token link */}
      <Route path="/client/:token" element={<ClientGalleryPage />} />

      {/* Admin: Login */}
      <Route path="/admin" element={<AdminLogin />} />

      {/* Admin: Protected routes */}
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<DashboardPage />} />
        <Route path="/admin/gallery/new" element={<CreateGalleryPage />} />
        <Route path="/admin/gallery/:id" element={<GalleryDetailPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
