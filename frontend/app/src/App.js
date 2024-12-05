import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import LandlordHomepage from "./pages/landlord/LandlordHomepage";
import CreateNewListing from "./pages/landlord/CreateNewListing";
import MyListing from "./pages/landlord/MyListing";
import EditDeleteListing from "./pages/landlord/EditDeleteListing";



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/searchresults" element={<SearchResults />} />

        <Route path="/landlord" element={<LandlordHomepage />} />
        <Route path="/landlord/create-listing" element={<CreateNewListing />} />
        <Route path="/landlord/my-listings" element={<MyListing />} />
        <Route path="/landlord/edit-listing/:id" element={<EditDeleteListing />} />





      </Routes>
    </Router>
  );
};

export default App;
