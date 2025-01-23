import './App.css';
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
import Messages from "./pages/message/Messages";
//listings from here
import MyListings from "./pages/landlord/MyListings";
import EditListing from "./pages/landlord/EditListing";
import CreateListing from "./pages/landlord/CreateListing";

// Admin imports
import AdminHomepage from "./pages/admin/AdminHomepage";
import AllListings from "./pages/admin/AllListings";
import AllProperties from "./pages/admin/AllProperties";
import AdminViewProfile from './pages/admin/AdminViewProfile';



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
        <Route path="/messages" element = {<Messages/>}/>


        <Route path="/landlord" element={<LandlordHomepage />} />
        <Route path="/landlord/create-listing" element={<CreateNewProperties />} />
        <Route path="/landlord/view-property/:id" element={<ViewPropertyDetails />} />
        <Route path="/landlord/my-listings" element={<ViewProperties />} />
        <Route path="/landlord/edit-listing/:id"  element={<EditDeleteListing />}   />

        <Route path="/landlord/requests" element={<LandlordRequests />} />
        <Route path="/landlord/select-requests" element={<LandlordSelectRequests />}  />

        <Route path="/landlord/tenants" element={<LandlordViewTenants />} />
        <Route path="/landlord/properties" element={<LandlordViewProperties />} />
       
        <Route path="/landlord/properties"  element={<LandlordViewProperties />} />
        <Route path="/landlord/viewProfile" element = {<LandlordViewProfile/>}/>
        <Route path="/landlord/messages" element = {<Messages/>}/>

      
       <Route path="/landlord/my-prop-listings" element={<MyListings />} />
       <Route path ="/landlord/edit-prop-listing/:id" element={<EditListing />} />
       <Route path="/landlord/create-prop-listing" element={<CreateListing />} />

       {/* Admin routes */}
       <Route path="/admin" element={<AdminHomepage />} />
       <Route path="/admin/listings" element={<AllListings />} />
       <Route path="/admin/edit-prop-listing/:id" element={<EditListing />} />
       <Route path="/admin/properties" element={<AllProperties />} />
       <Route path="/admin/edit-property/:id" element={<EditDeleteListing />} />
       <Route path="/admin/viewProfile" element = {<AdminViewProfile/>}/>


      </Routes>
    </Router>
  );
};

export default App;

