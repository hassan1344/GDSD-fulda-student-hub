import './App.css';
import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./theme/theme";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Home and Auth Pages
import Home from "./pages/Home";
import SingUpPage from './pages/auth/SignUp';
import SignInPage from './pages/auth/SignIn';
import CreateProfilePage from "./pages/CreateProfilePage";
import SearchResults from "./pages/SearchResults";

// Student Pages
import ViewApplicationStudent from "./pages/student/ViewApplicationStudent";
import ViewStudentProfile from "./pages/student/ViewStudentProfile";
import ViewBiddingSessionStudent from './pages/ViewBiddingSessionStudent';

// Landlord Pages
import LandlordHomepage from "./pages/landlord/LandlordHomepage";
import LandlordRequests from "./pages/landlord/LandlordRequests";
import LandlordSelectRequests from "./pages/landlord/LandlordSelectRequests";
import LandlordViewTenants from "./pages/landlord/LandlordViewTenants";
import LandlordViewProperties from "./pages/landlord/LandlordViewProperties";
import LandlordViewProfile from "./pages/landlord/landlordViewProfile";
import CreateNewProperties from "./pages/landlord/CreateNewProperties";
import ViewProperties from "./pages/landlord/ViewProperties";
import EditDeleteListing from "./pages/landlord/EditDeleteListing";
import ViewPropertyDetails from './pages/landlord/ViewPropertyDetails';
import MyListings from "./pages/landlord/MyListings";
import EditListing from "./pages/landlord/EditListing";
import CreateListing from "./pages/landlord/CreateListing";
import LeaseAgreement from './pages/landlord/LeaseAgreement';
import CalendarPage from './pages/landlord/CalendarPage';
import MyBidding from './pages/landlord/MyBidding';

// Bidding Pages
import BiddingLandlord from "./pages/bidding/biddingLandlord";
import BiddingStudent from './pages/bidding/BiddingStudent';

// Admin Pages
import AdminHomepage from "./pages/admin/AdminHomepage";
import AllListings from "./pages/admin/AllListings";
import AllProperties from "./pages/admin/AllProperties";
import AdminViewProfile from './pages/admin/AdminViewProfile';

// Other Components
import Navbar from './components/NavBar';
import Disclaimer from './components/Disclaimer';
import Messages from "./pages/message/Messages";
import BlockchainPaymentSystem from './pages/landlord/BlockchainPaymentSystem';

const App = () => {
  console.log("App rendered");

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router basename='/app'>
        <div className="body-content">
          <Navbar />
          <Routes>
            {/* Home and Auth Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/login" element={<SignInPage />} />
            <Route path="/register" element={<SingUpPage />} />
            <Route path="/profile" element={<CreateProfilePage />} />
            <Route path="/searchresults" element={<SearchResults />} />

            {/* Student Routes */}
            <Route path="/myApplications" element={<ViewApplicationStudent />} />
            <Route path="/myBids" element={<ViewBiddingSessionStudent />} />
            <Route path="/viewProfile" element={<ViewStudentProfile />} />
            <Route path="/messages" element={<Messages />} />

            {/* Landlord Routes */}
            <Route path="/landlord" element={<LandlordHomepage />} />
            <Route path="/landlord/create-listing" element={<CreateNewProperties />} />
            <Route path="/landlord/view-property/:id" element={<ViewPropertyDetails />} />
            <Route path="/landlord/my-listings" element={<ViewProperties />} />
            <Route path="/landlord/edit-listing/:id" element={<EditDeleteListing />} />
            <Route path="/landlord/requests" element={<LandlordRequests />} />
            <Route path="/landlord/select-requests" element={<LandlordSelectRequests />} />
            <Route path="/landlord/tenants" element={<LandlordViewTenants />} />
            <Route path="/landlord/properties" element={<LandlordViewProperties />} />
            <Route path="/landlord/viewProfile" element={<LandlordViewProfile />} />
            <Route path="/landlord/messages" element={<Messages />} />
            <Route path="/landlord/my-prop-listings" element={<MyListings />} />
            <Route path="/landlord/edit-prop-listing/:id" element={<EditListing />} />
            <Route path="/landlord/create-prop-listing" element={<CreateListing />} />
            <Route path="/landlord/lease-agreement" element={<LeaseAgreement />} />
            <Route path="/landlord/calendar" element={<CalendarPage />} />
            <Route path="/landlord/my-bids" element={<MyBidding />} />

            {/* Bidding Routes */}
            <Route path="/bidding/BiddingLandlord/:listingId" element={<BiddingLandlord />} />
            <Route path="/bidding/BiddingStudent/:listingId" element={<BiddingStudent />} />

            {/* Blockchain Routes */}
            <Route path="/landlord/blockchain/:property_id" element={<BlockchainPaymentSystem />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminHomepage />} />
            <Route path="/admin/listings" element={<AllListings />} />
            <Route path="/admin/edit-prop-listing/:id" element={<EditListing />} />
            <Route path="/admin/properties" element={<AllProperties />} />
            <Route path="/admin/edit-property/:id" element={<EditDeleteListing />} />
            <Route path="/admin/viewProfile" element={<AdminViewProfile />} />
          </Routes>
          <Disclaimer />
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;