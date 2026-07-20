import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';

import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Labels from './pages/Labels';

import Campaigns from './pages/Campaigns';
import CreateCampaign from './pages/CreateCampaign';
import CampaignDetails from './pages/CampaignDetails';
import CampaignAnalytics from './pages/CampaignAnalytics';

import Profile from './pages/Profile';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />

        {/* Authenticated app shell */}
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="analytics" element={<Analytics />} />
          <Route path="labels" element={<Labels />} />

          <Route path="campaigns" element={<Campaigns />} />
          <Route path="campaigns/new" element={<CreateCampaign />} />
          <Route path="campaigns/:id/analytics" element={<CampaignAnalytics />} />
          <Route path="campaigns/:id" element={<CampaignDetails />} />

          <Route path="profile" element={<Profile />} />

          <Route path="*" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;