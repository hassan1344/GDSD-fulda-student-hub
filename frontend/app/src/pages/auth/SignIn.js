import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Paper, TextField, Typography, CircularProgress, Alert } from "@mui/material";
import { loginUser } from "../../services/authServices";
import { jwtDecode } from "jwt-decode";

const SignInPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ userName: "", password: "" });
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
    } catch (error) {
      showNotification("An error occurred. Please try again.");
    }

    setLoading(false);
  };

  return (
    <Container maxWidth="xs">
      <Box display="flex" flexDirection="column" alignItems="center" mt={6}>
        <Typography variant="h5" fontWeight={600}>Sign In</Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2, textAlign: "center" }}>
          Welcome back! Please log in to continue.
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
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              error={!!fieldErrors.password}
              helperText={fieldErrors.password}
              margin="dense"
            />

            <Box display="flex" justifyContent="space-between" mt={2}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                size="small"
                sx={{ textTransform: "none", borderRadius: 2, paddingX: 3 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : "Sign In"}
              </Button>
            </Box>
          </form>
        </Paper>

        <Box mt={2}>
          <Typography variant="body2" color="textSecondary" sx={{ textAlign: "center" }}>
            Don't have an account?{" "}
            <Button color="primary" sx={{ textTransform: "none" }} onClick={() => navigate("/register")}>
              Register
            </Button>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default SignInPage;
