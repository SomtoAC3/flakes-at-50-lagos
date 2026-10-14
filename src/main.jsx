import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

import { AuthProvider } from "./lib/auth";
import { registerServiceWorker } from "./lib/push";

import ClientLayout from "./client/ClientLayout";
import RequireGuestAuth from "./client/RequireGuestAuth";
import Home from "./client/pages/Home";
import Itinerary from "./client/pages/Itinerary";
import DressCodes from "./client/pages/DressCodes";
import Travel from "./client/pages/Travel";
import MyTrip from "./client/pages/MyTrip";
import Directory from "./client/pages/Directory";
import Story from "./client/pages/Story";
import Gallery from "./client/pages/Gallery";
import Updates from "./client/pages/Updates";
import Faq from "./client/pages/Faq";
import Contacts from "./client/pages/Contacts";
import More from "./client/pages/More";
import Login from "./client/pages/Login";

import AdminLayout from "./admin/AdminLayout";
import RequireOrganizerAuth from "./admin/RequireOrganizerAuth";
import AdminLogin from "./admin/pages/Login";
import Dashboard from "./admin/pages/Dashboard";
import Guests from "./admin/pages/Guests";
import Announcements from "./admin/pages/Announcements";
import AdminGallery from "./admin/pages/Gallery";
import AdminSettings from "./admin/pages/Settings";
import AdminItinerary from "./admin/pages/Itinerary";
import AdminContent from "./admin/pages/Content";
import AdminDressCodes from "./admin/pages/DressCodes";

registerServiceWorker();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Guest-facing app. No admin link or route lives anywhere in this tree. */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ClientLayout />}>
            <Route index element={<Home />} />
            <Route path="itinerary" element={<Itinerary />} />
            <Route path="dress-codes" element={<DressCodes />} />
            <Route path="travel" element={<Travel />} />
            <Route path="my-trip" element={<RequireGuestAuth><MyTrip /></RequireGuestAuth>} />
            <Route path="directory" element={<RequireGuestAuth><Directory /></RequireGuestAuth>} />
            <Route path="story" element={<Story />} />
            <Route path="gallery" element={<RequireGuestAuth><Gallery /></RequireGuestAuth>} />
            <Route path="updates" element={<Updates />} />
            <Route path="faq" element={<Faq />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="more" element={<More />} />
          </Route>

          {/* Admin — a separate tree, only reachable by typing /admin directly. */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <RequireOrganizerAuth>
                <AdminLayout />
              </RequireOrganizerAuth>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="guests" element={<Guests />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="itinerary" element={<AdminItinerary />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="dress-codes" element={<AdminDressCodes />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
