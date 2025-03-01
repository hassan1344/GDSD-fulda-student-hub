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

//Bidding here
import BiddingLandlord from "./pages/bidding/biddingLandlord";
import BiddingStudent from './pages/bidding/BiddingStudent';
import ViewBiddingSessionStudent from './pages/ViewBiddingSessionStudent';
import MyBidding from './pages/landlord/MyBidding';

// Admin imports
import AdminHomepage from "./pages/admin/AdminHomepage";
import AllListings from "./pages/admin/AllListings";
import AllProperties from "./pages/admin/AllProperties";
import AdminViewProfile from './pages/admin/AdminViewProfile';
import LeaseAgreement from './pages/landlord/LeaseAgreement';


//Calendar Imports
import CalendarPage from './pages/landlord/CalendarPage';
import MeetingForm from './pages/landlord/MeetingForm';
import MeetingList from './pages/landlord/MeetingList';

// blockchain imports
import BlockchainPaymentSystem from './pages/landlord/BlockchainPaymentSystem';


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
        <Route path="/myBids" element = {<ViewBiddingSessionStudent/>}/>
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
       <Route path="/landlord/lease-agreement" element={<LeaseAgreement />} />
       <Route path="/landlord/my-bids" element={<MyBidding />} />

       <Route path="/bidding/BiddingLandlord/:listingId" element={<BiddingLandlord />} />
       <Route path="/bidding/BiddingStudent/:listingId" element={<BiddingStudent />} />
       <Route path="/landlord/blockchain/:property_id" element={<BlockchainPaymentSystem />} />


       {/* Admin routes */}
       <Route path="/admin" element={<AdminHomepage />} />
       <Route path="/admin/listings" element={<AllListings />} />
       <Route path="/admin/edit-prop-listing/:id" element={<EditListing />} />
       <Route path="/admin/properties" element={<AllProperties />} />
       <Route path="/admin/edit-property/:id" element={<EditDeleteListing />} />
       <Route path="/admin/viewProfile" element = {<AdminViewProfile/>}/>

        {/* Calendar routes */}
        <Route path="/landlord/calendar" element={<CalendarPage/>} />

      </Routes>
    </Router>
  );
};

export default App;

