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

  const accessToken = localStorage.getItem("accessToken");
  const decodedToken = jwtDecode(accessToken);
  const { userName, userType } = decodedToken;

  const allNavLinks = [
    { path: "/home", name: "Home", roles: ["STUDENT"] },
    { path: "/admin", name: "Home", roles: ["ADMIN"] },
    { path: "/myApplications", name: "My Applications", roles: ["STUDENT"] },
    { path: "/messages", name: "Messages", roles: ["STUDENT"] },
    { path: "/viewProfile", name: "Profile", roles: ["STUDENT"] },
    { path: "/admin/viewProfile", name: "Profile", roles: ["ADMIN"] },
  ];

  const navLinks = allNavLinks.filter(link => link.roles.includes(userType));

  const logoutHandler = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return;

      await logoutUser({ userName });
      localStorage.clear();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  return (
    <>
      {/* Navbar */}
      <AppBar position="fixed" sx={{ backgroundColor: theme.palette.primary.main }}>
        <Toolbar sx={{ maxWidth: "1200px", mx: "auto", width: "100%", px: 2 }}>
          
          {/* Left Side: Logo & Title */}
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <img src={logoFHB} alt="Fulda Student Hub" width={50} style={{ marginRight: "10px" }} />
            <Typography variant="h6" color="inherit" fontWeight="bold">
              Fulda Student Hub
            </Typography>
          </Box>

          {/* Right Side: Links (Desktop) */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
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
            {navLinks.map((link) => (
              <ListItem button key={link.path} component={NavLink} to={link.path} onClick={() => setIsDrawerOpen(false)}>
                <ListItemText primary={link.name} sx={{ color: "white" }} />
              </ListItem>
            ))}
            <ListItem button onClick={logoutHandler}>
              <ListItemText primary="Logout" sx={{ color: "white" }} />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
