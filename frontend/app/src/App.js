import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import LandlordRequests from "./pages/LandlordRequests";
import LandlordSelectRequests from "./pages/LandlordSelectRequests";
import LandlordViewTenants from "./pages/LandlordViewTenants";
import LandlordViewProperties from "./pages/LandlordViewProperties";
import AuthPage from "./pages/AuthPage";
import LandlordHomepage from "./pages/landlord/LandlordHomepage";
import CreateNewProperties from "./pages/landlord/CreateNewProperties";
import ViewProperties from "./pages/landlord/ViewProperties";
import EditDeleteListing from "./pages/landlord/EditDeleteListing";
import CreateProfilePage from "./pages/CreateProfilePage";
import ViewStudentProfile from "./pages/ViewStudentProfile";
import Disclaimer from './components/Disclaimer'; // Import the Disclaimer component
import ViewPropertyDetails from './pages/landlord/ViewPropertyDetails';
import LandlordViewProfile from "./pages/landlordViewProfile";
import ViewApplicationStudent from "./pages/ViewApplicationStudent";
import './App.css';


const App = () => {
  console.log("App rendered");
  return (
    <Router basename = '/app'>
       <Disclaimer /> {/* Show disclaimer on every page */}
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/profile" element={<CreateProfilePage />} />

        <Route path="/Home" element={<Home />} />
        <Route path="/searchresults" element={<SearchResults />} />
        <Route path="/myApplications" element = {<ViewApplicationStudent/>}/>
        <Route path="/viewProfile" element = {<ViewStudentProfile/>}/>


        <Route path="/landlord" element={<LandlordHomepage />} />
        <Route path="/landlord/create-listing" element={<CreateNewProperties />} />
        <Route path="/landlord/view-property/:id" element={<ViewPropertyDetails />} />
        <Route path="/landlord/my-listings" element={<ViewProperties />} />
        <Route
          path="/landlord/edit-listing/:id"
          element={<EditDeleteListing />}
        />
        <Route path="/landlord/requests" element={<LandlordRequests />} />
        <Route
          path="/landlord/select-requests"
          element={<LandlordSelectRequests />}
        />
        <Route path="/landlord/tenants" element={<LandlordViewTenants />} />
        <Route path="/landlord/properties" element={<LandlordViewProperties />} />
       
        <Route
          path="/landlord/properties"
          element={<LandlordViewProperties />}
        />
        <Route path="/landlord/viewProfile" element = {<LandlordViewProfile/>}/>
      </Routes>
    </Router>
  );
};

export default App;

