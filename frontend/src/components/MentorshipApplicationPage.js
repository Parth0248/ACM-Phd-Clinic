import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  IconButton,
  Chip,
  Tooltip,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import axios from "axios";
import { useThemeContext } from "../ThemeContext";
import { useNavigate } from "react-router-dom";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import ACMLogo from "../ACM.png";

const MentorshipApplicationPage = () => {
  const navigate = useNavigate();
  const { toggleTheme } = useThemeContext();
  const [mentors, setMentors] = useState([]);
  const [matchedMentors, setMatchedMentors] = useState([]);
  const [application, setApplication] = useState({
    affiliation: "",
    phdRegistration: "",
    otherPhdRegistration: "",
    researchProblem: "",
    specificFeedback: "",
    previousAttendances: 0,
    selectedMentor: "",
    selectedMentorInstitute : "",
    fieldsOfInterest: [],
    fieldOfInterest: "",
  });
  const [error, setError] = useState("");
  const [step, setStep] = useState("findMentor"); // to handle the button text change

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/mentors")
      .then((response) => setMentors(response.data))
      .catch(() => setError("Error fetching mentors. Please try again."));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setApplication((prevApplication) => ({
      ...prevApplication,
      [name]: value,
    }));
  };

  const handleFieldOfInterestChange = (e) => {
    if (e.key === "Enter" && application.fieldOfInterest.trim()) {
      setApplication((prevApplication) => ({
        ...prevApplication,
        fieldsOfInterest: [
          ...prevApplication.fieldsOfInterest,
          prevApplication.fieldOfInterest,
        ],
        fieldOfInterest: "",
      }));
    }
  };

  const handleDeleteFieldOfInterest = (field) => {
    setApplication((prevApplication) => ({
      ...prevApplication,
      fieldsOfInterest: prevApplication.fieldsOfInterest.filter(
        (f) => f !== field
      ),
    }));
    setStep("findMentor");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === "findMentor") {
      const userFields = await application.fieldsOfInterest.map((field) =>
        field.toLowerCase()
      );
      try {
        const matched = await new Promise((resolve, reject) => {
          setTimeout(() => {
            const matchedMentors = mentors
              .filter((mentor) =>
                mentor.field
                  .split(", ")
                  .some((field) =>
                    userFields.some(
                      (userField) =>
                        userField.toLowerCase() === field.toLowerCase()
                    )
                  )
              )
              .slice(0, 3);
            resolve(matchedMentors);
          }, 1000); // Adjust the timeout value as needed
        });
        setMatchedMentors([...matched]);
        setStep("submitApplication");
        setError("");
      } catch (error) {
        setError("Error finding mentors. Please try again.");
      }
    } else {
      if (application.selectedMentor === "") {
        setError("Please select a mentor to submit the application.");
        return;
      }
      // Retrieve user data from local storage
      const userData = JSON.parse(localStorage.getItem("userProfile") || "{}");

      // Combine application data with user data
      const applicationWithUserData = {
        ...application,
        userData,
      };

      axios
        .post("http://localhost:5000/api/mentorship", applicationWithUserData)
        .then((response) => {
          alert(
            `Application submitted successfully. You have been paired with ${application.selectedMentor}`
          );
          navigate("/");
        })
        .catch(() =>
          setError("Error submitting application. Please try again.")
        );
    }
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
      <Box sx={{ textAlign: "center", my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Apply for Mentorship
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
          label="Your affiliation? Where your Ph.D. is registered?"
          type="text"
          name="affiliation"
          value={application.affiliation}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Your Ph.D. registration is"
          select
          name="phdRegistration"
          value={application.phdRegistration}
          onChange={handleChange}
          required
        >
          {["Full-time", "Part-time", "Sponsored", "Other"].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        {application.phdRegistration === "Other" && (
          <TextField
            fullWidth
            margin="normal"
            label="Please specify"
            type="text"
            name="otherPhdRegistration"
            value={application.otherPhdRegistration}
            onChange={handleChange}
            required
          />
        )}
        <Box sx={{ position: "relative" }}>
          <TextField
            fullWidth
            margin="normal"
            label="Research problem that you are working on or interested in working?"
            type="text"
            name="researchProblem"
            value={application.researchProblem}
            onChange={handleChange}
            required
          />
          <Tooltip
            title="This can be indicative only. If you can be as specific as possible, this will help match the mentor easily. Please keep it as elaborate as possible, add links to papers you have read, written, courses you have taken online, etc. More information you provide, it will be easy to match and schedule a mentor."
            placement="right"
          >
            <IconButton sx={{ position: "absolute", right: 10, top: 30 }}>
              <HelpOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <Box sx={{ position: "relative" }}>
          <TextField
            fullWidth
            margin="normal"
            label="What specific feedback are you looking for in the Clinic?"
            type="text"
            name="specificFeedback"
            value={application.specificFeedback}
            onChange={handleChange}
            required
          />
          <Tooltip
            title="What specific questions you would like to discuss during the Clinic? e.g. would need help in formulating the research problem. Be as explicit as possible, this will help find and schedule a mentor."
            placement="right"
          >
            <IconButton sx={{ position: "absolute", right: 10, top: 30 }}>
              <HelpOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <TextField
          fullWidth
          margin="normal"
          label="Field of Interest"
          type="text"
          name="fieldOfInterest"
          value={application.fieldOfInterest}
          onChange={handleChange}
          onKeyDown={handleFieldOfInterestChange}
          helperText="Press Enter to add the field of interest"
        />
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, my: 2 }}>
          {application.fieldsOfInterest.map((field, index) => (
            <Chip
              key={index}
              label={field}
              onDelete={() => handleDeleteFieldOfInterest(field)}
              variant="outlined"
            />
          ))}
        </Box>
        <TextField
          fullWidth
          margin="normal"
          label="How many times have you attended #PhDClinic before?"
          type="number"
          name="previousAttendances"
          value={application.previousAttendances}
          onChange={handleChange}
          required
        />
        {step === "submitApplication" && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, my: 2 }}>
            {matchedMentors.map((mentor, index) => (
              <Box
                key={index}
                onClick={() => {
                  setApplication((prevApplication) => ({
                    ...prevApplication,
                    selectedMentor: mentor.name,
                    selectedMentorInstitute: mentor.institute,
                  }));
                }}
                sx={{
                  backgroundColor:
                    application.selectedMentor === mentor.name
                      ? "primary.main"
                      : "secondary.main",
                  color:
                    application.selectedMentor === mentor.name
                      ? "common.white"
                      : "text.primary",
                  padding: "5px 10px", // Adjust padding as needed
                  borderRadius: "4px", // Adjust borderRadius as needed
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column", // Display content in a column
                  whiteSpace: "pre-wrap",
                  minWidth: "fit-content",
                  minHeight: "auto",
                  maxWidth: "300px", // Optional: Set maxHeight if needed
                }}
              >
                <Typography variant="body2">{mentor.name}</Typography>
                <Typography variant="body2">{mentor.institute}</Typography>
                <Typography variant="body2">{mentor.field}</Typography>
              </Box>
            ))}
          </Box>
        )}

        <Button
          variant="contained"
          color="primary"
          type="button"
          onClick={handleSubmit}
          sx={{ mt: 2 }}
        >
          {step === "findMentor" ? "Find Mentor" : "Submit Application"}
        </Button>
      </form>
    </Container>
  );
};

export default MentorshipApplicationPage;
