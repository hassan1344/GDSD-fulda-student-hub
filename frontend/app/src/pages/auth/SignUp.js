import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Paper, TextField, Typography, CircularProgress, Alert, MenuItem } from "@mui/material";
import { registerUser, loginUser } from "../../services/authServices";

const SignUpPage = () => {
  const navigate = useNavigate();
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
      const { email, password, confirmPassword, userType, userName } = formData;
      const errors = {};

      if (!userName) errors.userName = "Username is required.";
      if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match.";
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
      if (!passwordRegex.test(password)) errors.password = "Password must have at least one number, one special character, one uppercase and one lowercase letter.";

      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        setLoading(false);
        return;
      }

      const response = await registerUser({ email, password, userName, userType });
      if (response?.message === "User registered successfully") {
        showNotification("Registration successful!");

        const loginResponse = await loginUser({ userName, password });
        if (loginResponse?.tokens) {
          localStorage.setItem("accessToken", loginResponse.tokens.accessToken);
          localStorage.setItem("refreshToken", loginResponse.tokens.refreshToken);
          navigate("/profile");
        } else {
          showNotification("Login failed. Please try again.");
        }
      } else {
        showNotification("Registration failed. Please try again.");
      }
    } catch (error) {
      showNotification("An error occurred. Please try again.");
    }

    setLoading(false);
  };

  return (
    <Container maxWidth="xs">
      <Box display="flex" flexDirection="column" alignItems="center" mt={6}>
        <Typography variant="h5" fontWeight={600}>Register</Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2, textAlign: "center" }}>
          Create an account to start using Fulda Student Hub
        </Typography>

        {notification && (
          <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
            {notification}
          </Alert>
        )}

        <Paper elevation={2} sx={{ borderRadius: 3, paddingX: 3, paddingY: 3, width: "100%", maxWidth: 400 }}>
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

            <Box display="flex" justifyContent="space-between" mt={2}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                size="small"
                sx={{ textTransform: "none", borderRadius: 2, paddingX: 3 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : "Register"}
              </Button>
            </Box>
          </form>
        </Paper>

        <Box mt={2}>
          <Typography variant="body2" color="textSecondary" sx={{ textAlign: "center" }}>
            Already have an account?{" "}
            <Button color="primary" sx={{ textTransform: "none" }} onClick={() => navigate("/login")}>
              Sign In
            </Button>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUpPage;
