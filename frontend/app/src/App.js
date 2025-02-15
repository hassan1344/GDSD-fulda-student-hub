import './App.css';
import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./theme/theme"; // Import the theme
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import Routes and Route from react-router-dom
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import LandlordRequests from "./pages/landlord/LandlordRequests";
import LandlordSelectRequests from "./pages/landlord/LandlordSelectRequests";
import LandlordViewTenants from "./pages/landlord/LandlordViewTenants";
import LandlordViewProperties from "./pages/landlord/LandlordViewProperties";
import LandlordHomepage from "./pages/landlord/LandlordHomepage";
import CreateNewProperties from "./pages/landlord/CreateNewProperties";
import ViewProperties from "./pages/landlord/ViewProperties";
import EditDeleteListing from "./pages/landlord/EditDeleteListing";
import CreateProfilePage from "./pages/CreateProfilePage";
import LandlordViewProfile from "./pages/landlord/landlordViewProfile";
import ViewStudentProfile from "./pages/student/ViewStudentProfile";
import Disclaimer from './components/Disclaimer'; // Import the Disclaimer component
import ViewPropertyDetails from './pages/landlord/ViewPropertyDetails';
import ViewApplicationStudent from "./pages/student/ViewApplicationStudent";
import Messages from "./pages/message/Messages";
import MyListings from "./pages/landlord/MyListings";
import EditListing from "./pages/landlord/EditListing";
import CreateListing from "./pages/landlord/CreateListing";
import BiddingLandlord from "./pages/bidding/biddingLandlord";
import BiddingStudent from './pages/bidding/BiddingStudent';
import AdminHomepage from "./pages/admin/AdminHomepage";
import AllListings from "./pages/admin/AllListings";
import AllProperties from "./pages/admin/AllProperties";
import AdminViewProfile from './pages/admin/AdminViewProfile';
import LeaseAgreement from './pages/landlord/LeaseAgreement';
import Navbar from './components/NavBar';
import SingUpPage from './pages/auth/SignUp';
import SignInPage from './pages/auth/SignIn';

const App = () => {
  console.log("App rendered");

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalizes styles for consistency */}
      <Router basename='/app'>
        <div className="body-content">
          <Navbar /> {/* Show Navbar on every page */}
          <Routes>
            {/* Define all your routes directly inside Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<SignInPage />} />
            <Route path="/register" element={<SingUpPage />} />
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<CreateProfilePage />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/searchresults" element={<SearchResults />} />
            <Route path="/myApplications" element={<ViewApplicationStudent />} />
            <Route path="/viewProfile" element={<ViewStudentProfile />} />
            <Route path="/messages" element={<Messages />} />

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

            <Route path="/bidding/BiddingLandlord/:listingId" element={<BiddingLandlord />} />
            <Route path="/bidding/BiddingStudent/:listingId" element={<BiddingStudent />} />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminHomepage />} />
            <Route path="/admin/listings" element={<AllListings />} />
            <Route path="/admin/edit-prop-listing/:id" element={<EditListing />} />
            <Route path="/admin/properties" element={<AllProperties />} />
            <Route path="/admin/edit-property/:id" element={<EditDeleteListing />} />
            <Route path="/admin/viewProfile" element={<AdminViewProfile />} />
          </Routes>
          <Disclaimer /> {/* Show disclaimer on every page */}
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
