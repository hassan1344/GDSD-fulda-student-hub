import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Paper, TextField, Typography, CircularProgress, Alert, MenuItem } from "@mui/material";
import logoFHB from "../assets/images/logoFHB.png";
import { registerUser, loginUser } from "../services/authServices";
import { jwtDecode } from "jwt-decode";

const AuthPage = () => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    userType: "STUDENT",
    userName: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");

  const toggleForm = () => {
    setIsRegister((prev) => !prev);
    setFieldErrors({});  // Clear errors when toggling forms
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      userType: "STUDENT",
      userName: "",
    });  // Optionally reset form fields if needed
  };
  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});

    try {
      if (isRegister) {
        const { email, password, confirmPassword, userType, userName } = formData;
        const errors = {};

        if (!userName) errors.userName = "Username is required.";
        if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match.";
        if (userType === "STUDENT" && !(email.endsWith(".hs-fulda.de") || email.endsWith("hs-fulda.de"))) {
          errors.email = "Student email must be a valid Fulda University email.";
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
        if (!passwordRegex.test(password))
          errors.password = "Password must have at least one number, one special character, one uppercase and one lowercase letter.";

        if (Object.keys(errors).length > 0) {
          setFieldErrors(errors);
          setLoading(false);
          return;
        }

        const response = await registerUser({ email, password, userName, userType });
        if (response?.message === "User registered successfully") {
          showNotification("Registration successful!");

          const loginResponse = await loginUser({ userName, password });
          if (loginResponse.tokens) {
            localStorage.setItem("accessToken", loginResponse.tokens.accessToken);
            localStorage.setItem("refreshToken", loginResponse.tokens.refreshToken);
            navigate("/profile", { state: { userType, userName } });
          } else showNotification("Login failed. Please try again.");
        } else showNotification("Registration failed. Please try again.");
      } else {
        const { userName, password } = formData;
        const errors = {};
        if (!userName) errors.userName = "Username is required.";
        if (!password) errors.password = "Password is required.";

        if (Object.keys(errors).length > 0) {
          setFieldErrors(errors);
          setLoading(false);
          return;
        }

        const response = await loginUser({ userName, password });
        if (response && response.tokens) {
          localStorage.setItem("accessToken", response.tokens.accessToken);
          localStorage.setItem("refreshToken", response.tokens.refreshToken);

          const decodedToken = jwtDecode(response.tokens.accessToken);
          navigate(decodedToken.userType === "STUDENT" ? "/home" : `/${decodedToken.userType.toLowerCase()}`);
        } else {
          showNotification("Invalid login credentials!");
          setFieldErrors({ userName: "Invalid username or password.", password: "Invalid username or password." });
        }
      }
    } catch (error) {
      showNotification("An error occurred. Please try again.");
    }

    setLoading(false);
  };

  return (
    <Container maxWidth="xs">
      <Box display="flex" flexDirection="column" alignItems="center" mt={6}>
        <img
          src={logoFHB}
          alt="Fulda Student Hub"
          width={200}
          style={{ marginBottom: "8rem" }}
        />
        <Typography variant="h5" fontWeight={600}>
          {isRegister ? "Register" : "Login"}
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2, textAlign: "center" }}>
          {isRegister
            ? "Create an account to start using Fulda Student Hub"
            : "Welcome back! Please log in to continue."}
        </Typography>
  
        {notification && (
          <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
            {notification}
          </Alert>
        )}
  
        <Paper
          elevation={2}
          sx={{
            borderRadius: 3,
            paddingX: 3,
            paddingY: 2.5,
            width: "100%",
            maxWidth: 360,
          }}
        >
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label="Username"
              name="userName"
              value={formData.userName}
              onChange={handleInputChange}
              error={!!fieldErrors.userName}
              helperText={fieldErrors.userName}
              margin="dense"
            />
  
            {isRegister && (
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Email Address"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                error={!!fieldErrors.email}
                helperText={fieldErrors.email}
                margin="dense"
              />
            )}
  
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              error={!!fieldErrors.password}
              helperText={fieldErrors.password}
              margin="dense"
            />
  
            {isRegister && (
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={!!fieldErrors.confirmPassword}
                helperText={fieldErrors.confirmPassword}
                margin="dense"
              />
            )}
  
            {isRegister && (
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                select
                label="User Type"
                name="userType"
                value={formData.userType}
                onChange={handleInputChange}
                margin="dense"
              >
                <MenuItem value="STUDENT">Student</MenuItem>
                <MenuItem value="LANDLORD">Landlord</MenuItem>
              </TextField>
            )}
  
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                size="small"
                sx={{ textTransform: "none", borderRadius: 2, paddingX: 3 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : isRegister ? "Register" : "Login"}
              </Button>
              <Button
                color="secondary"
                onClick={toggleForm}
                size="small"
                sx={{ textTransform: "none" }}
              >
                {isRegister ? "Already have an account? Log in" : "Don't have an account? Register"}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default AuthPage;
