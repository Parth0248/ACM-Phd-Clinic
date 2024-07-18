import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useThemeContext } from "../ThemeContext";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import ACMLogo from "../ACM.png";

const ProfileCreationPage = () => {
  const { toggleTheme } = useThemeContext();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    email: "",
    name: "",
    password: "",
    gender: "",
    cellNumber: "",
    instagram: "",
    facebook: "",
    twitter: "",
    linkedin: "",
    acmMember: false,
    mailingList: false,
  });
  const [passwordStrength, setPasswordStrength] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "password") {
      validatePasswordStrength(value);
    }
  };

  const validatePasswordStrength = (password) => {
    let strength = "Weak";
    const regexStrong =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const regexModerate =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;

    if (regexStrong.test(password)) {
      strength = "Strong";
    } else if (regexModerate.test(password)) {
      strength = "Moderate";
    }

    setPasswordStrength(strength);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwordStrength !== "Strong") {
      setError("Please enter a strong password.");
      return;
    }

    axios
      .post("http://localhost:5000/api/students", profile)
      .then((response) => {
        alert("Profile created successfully");
        localStorage.setItem("userProfile", JSON.stringify(profile));
        navigate("/");
      })
      .catch((error) => {
        setError("Error creating profile. Please try again.");
      });
  };

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 2,
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center" }}
          onClick={() => navigate("/")}
        >
          <img
            src={ACMLogo}
            alt="ACM logo"
            style={{ width: "75px", cursor: "pointer" }}
          />
          <Typography variant="h5" component="span" sx={{ ml: 2 }}>
            ACM India PhD Clinic
          </Typography>
        </Box>
        <Box onClick={toggleTheme} sx={{ cursor: "pointer" }}>
          <Brightness4Icon />
        </Box>
      </Box>
      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Sign Up
        </Typography>
      </Box>
      {error && (
        <Box sx={{ textAlign: "center", my: 2 }}>
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        </Box>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          type="email"
          name="email"
          value={profile.email}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Name"
          type="text"
          name="name"
          value={profile.name}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          type="password"
          name="password"
          value={profile.password}
          onChange={handleChange}
          required
        />
        <Typography
          variant="body2"
          color={
            passwordStrength === "Strong"
              ? "green"
              : passwordStrength === "Moderate"
              ? "orange"
              : "red"
          }
        >
          Password Strength: {passwordStrength}
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Gender"
          select
          SelectProps={{
            native: true,
          }}
          name="gender"
          value={profile.gender}
          onChange={handleChange}
          required
        >
          <option value=""></option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </TextField>
        <TextField
          fullWidth
          margin="normal"
          label="Cell Number"
          type="text"
          name="cellNumber"
          value={profile.cellNumber}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Instagram Handle"
          type="text"
          name="instagram"
          value={profile.instagram}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Facebook Handle"
          type="text"
          name="facebook"
          value={profile.facebook}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Twitter Handle"
          type="text"
          name="twitter"
          value={profile.twitter}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="LinkedIn Handle"
          type="text"
          name="linkedin"
          value={profile.linkedin}
          onChange={handleChange}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={profile.acmMember}
              onChange={handleChange}
              name="acmMember"
            />
          }
          label="ACM Member"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={profile.mailingList}
              onChange={handleChange}
              name="mailingList"
            />
          }
          label="Join Mailing List"
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{ mt: 2 }}
        >
          Create Profile
        </Button>
      </form>
    </Container>
  );
};

export default ProfileCreationPage;
