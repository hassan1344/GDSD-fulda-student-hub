import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText, Box } from "@mui/material";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import logoFHB from "../assets/images/logoFHB-Nav-Light.png";
import { logoutUser } from "../services/authServices";
import { jwtDecode } from "jwt-decode";
import { useTheme } from "@mui/material/styles";

const Navbar = () => {
  const theme = useTheme(); // Get Theme Colors
  const location = useLocation();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Get access token to determine if the user is logged in
  const accessToken = localStorage.getItem("accessToken");
  const isLoggedIn = !!accessToken; // Boolean flag to check if user is logged in
  
  let userType = null;
  let userName = null;

  // If the user is logged in, decode the token and get userType and userName
  if (isLoggedIn) {
    const decodedToken = jwtDecode(accessToken);
    userName = decodedToken.userName;
    userType = decodedToken.userType;
  }

  // Define navigation links for all user types (STUDENT, LANDLORD, ADMIN)
  const allNavLinks = [
    { path: "/home", name: "Home", roles: ["STUDENT", "LANDLORD", "ADMIN"] },
    { path: "/myApplications", name: "My Applications", roles: ["STUDENT"] },
    { path: "/messages", name: "Messages", roles: ["STUDENT", "LANDLORD", "ADMIN"] },
    { path: "/viewProfile", name: "Profile", roles: ["STUDENT", "LANDLORD", "ADMIN"] },
    { path: "/landlord", name: "Landlord Dashboard", roles: ["LANDLORD"] },
    { path: "/landlord/viewProfile", name: "Landlord Profile", roles: ["LANDLORD"] },
    { path: "/landlord/myListings", name: "My Listings", roles: ["LANDLORD"] },
    { path: "/admin", name: "Admin Dashboard", roles: ["ADMIN"] },
    { path: "/admin/manageUsers", name: "Manage Users", roles: ["ADMIN"] },
    { path: "/admin/manageListings", name: "Manage Listings", roles: ["ADMIN"] },
    { path: "/admin/viewProfile", name: "Admin Profile", roles: ["ADMIN"] },
  ];

  // Filter the navLinks based on the userType (if logged in)
  const navLinks = isLoggedIn ? allNavLinks.filter(link => link.roles.includes(userType)) : [];

  const logoutHandler = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return;
  
      await logoutUser({ userName });
      localStorage.clear();
      navigate("/", { replace: true });  // Navigate to the home page
      window.location.reload();  // Reload the homepage entirely
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };
  

  return (
    <>
      {/* Navbar */}
      <AppBar position="fixed" sx={{ backgroundColor: theme.palette.primary.main }}>
        <Toolbar sx={{ maxWidth: "1200px", mx: "auto", width: "100%", px: 2 }}>
          {/* Left Side: Logo & Public Links */}
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <img src={logoFHB} alt="Fulda Student Hub" width={50} style={{ marginRight: "10px" }} />
            <Typography variant="h6" color="inherit" fontWeight="bold">
              Fulda Student Hub
            </Typography>
            
            {/* Left-aligned Public Links: Home and About */}
            {!isLoggedIn && (
              <>
                <Button
                  component={NavLink}
                  to="/home"
                  sx={{
                    color: location.pathname === "/home" ? theme.palette.secondary.main : "white",
                    fontWeight: "500",
                    textTransform: "none",
                    borderBottom: location.pathname === "/home" ? "2px solid white" : "none",
                    marginLeft: 3, // Space between logo and Home
                  }}
                >
                  Home
                </Button>
                <Button
                  component={NavLink}
                  to="/about"
                  sx={{
                    color: location.pathname === "/about" ? theme.palette.secondary.main : "white",
                    fontWeight: "500",
                    textTransform: "none",
                    borderBottom: location.pathname === "/about" ? "2px solid white" : "none",
                    marginLeft: 3, // Space between Home and About
                  }}
                >
                  About
                </Button>
              </>
            )}
          </Box>

          {/* Right Side: Links (Desktop) */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
            {/* Show Public Links if not logged in */}
            {!isLoggedIn ? (
              <>
                <Button
                  component={NavLink}
                  to="/login"
                  sx={{
                    color: "white",
                    fontWeight: "500",
                    textTransform: "none",
                    borderBottom: location.pathname === "/login" ? "2px solid white" : "none",
                  }}
                >
                  Sign In
                </Button>
                <Button
                  component={NavLink}
                  to="/register"
                  sx={{
                    color: "white",
                    fontWeight: "500",
                    textTransform: "none",
                    borderBottom: location.pathname === "/register" ? "2px solid white" : "none",
                  }}
                >
                  Create Account
                </Button>
              </>
            ) : (
              // Show Authenticated Links
              <>
                {navLinks.map((link) => (
                  <Button
                    key={link.path}
                    component={NavLink}
                    to={link.path}
                    sx={{
                      color: location.pathname === link.path ? theme.palette.secondary.main : "white",
                      fontWeight: "500",
                      textTransform: "none",
                      borderBottom: location.pathname === link.path ? "2px solid white" : "none",
                    }}
                  >
                    {link.name}
                  </Button>
                ))}
                <Button onClick={logoutHandler} sx={{ color: "white", fontWeight: "bold" }}>
                  Logout
                </Button>
              </>
            )}
          </Box>

          {/* Mobile Menu Button */}
          <IconButton edge="end" color="inherit" sx={{ display: { md: "none" } }} onClick={() => setIsDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <Box sx={{ width: 250, backgroundColor: theme.palette.primary.main, height: "100vh", color: "white", p: 2 }}>
          <List>
            {/* Show Public Links if not logged in */}
            {!isLoggedIn ? (
              <>
                <ListItem button component={NavLink} to="/home" onClick={() => setIsDrawerOpen(false)}>
                  <ListItemText primary="Home" sx={{ color: "white" }} />
                </ListItem>
                <ListItem button component={NavLink} to="/about" onClick={() => setIsDrawerOpen(false)}>
                  <ListItemText primary="About" sx={{ color: "white" }} />
                </ListItem>
                <ListItem button component={NavLink} to="/" onClick={() => setIsDrawerOpen(false)}>
                  <ListItemText primary="Sign In" sx={{ color: "white" }} />
                </ListItem>
                <ListItem button component={NavLink} to="/create-account" onClick={() => setIsDrawerOpen(false)}>
                  <ListItemText primary="Create Account" sx={{ color: "white" }} />
                </ListItem>
              </>
            ) : (
              // Show Authenticated Links
              <>
                {navLinks.map((link) => (
                  <ListItem button key={link.path} component={NavLink} to={link.path} onClick={() => setIsDrawerOpen(false)}>
                    <ListItemText primary={link.name} sx={{ color: "white" }} />
                  </ListItem>
                ))}
                <ListItem button onClick={logoutHandler}>
                  <ListItemText primary="Logout" sx={{ color: "white" }} />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
