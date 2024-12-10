import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import LandlordRequests from "./pages/LandlordRequests";
import LandlordSelectRequests from "./pages/LandlordSelectRequests";
import LandlordViewTenants from "./pages/LandlordViewTenants";
import LandlordViewProperties from "./pages/LandlordViewProperties";
import AuthPage from "./pages/AuthPage";

const App = () => {
  console.log("App rendered");
  return (
    <Router>
      <Routes>
      <Route path="/" element={<AuthPage />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/searchresults" element={<SearchResults />} />
        <Route path="/landlord/requests" element={<LandlordRequests />} />
        <Route path="/landlord/select-requests" element={<LandlordSelectRequests />} />
        <Route path="/landlord/tenants" element={<LandlordViewTenants />} />
        <Route path="/landlord/properties" element={<LandlordViewProperties />} />
      </Routes>
    </Router>
  );
};

export default App;