import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useThemeContext } from '../ThemeContext';
import { useNavigate } from 'react-router-dom';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import ACMLogo from '../ACM.png';

const HomePage = () => {
  const { toggleTheme } = useThemeContext();
  const navigate = useNavigate();
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [firstAccess, setFirstAccess] = useState(false);

  useEffect(() => {
    
    if (!firstAccess && localStorage.getItem('firstAccess')) {
      // Clear localStorage
      localStorage.clear();
      // Set the 'firstAccess' flag to prevent clearing localStorage on subsequent accesses
      localStorage.setItem('firstAccess', true);
      setFirstAccess(true);
    }

    const userProfile = JSON.parse(localStorage.getItem('userProfile'));
    if (userProfile) {
      setIsSignedUp(true);
      const hours = new Date().getHours();
      const timeOfDay = hours < 12 ? 'Morning' : hours < 18 ? 'Afternoon' : 'Evening';
      setWelcomeMessage(`Good ${timeOfDay}, ${userProfile.name}, are you ready for a brainstorming session with a mentor?`);
    }
  }, [firstAccess]);

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }} onClick={() => navigate('/')}>
          <img src={ACMLogo} alt="ACM logo" style={{ width: '75px', cursor: 'pointer' }} />
          <Typography variant="h5" component="span" sx={{ ml: 2 }}>
            ACM India PhD Clinic
          </Typography>
        </Box>
        <Box onClick={toggleTheme} sx={{ cursor: 'pointer' }}>
          <Brightness4Icon />
        </Box>
      </Box>
      <Box sx={{ textAlign: 'center', my: 4 }}>
        {isSignedUp ? (
          <>
            <Typography variant="h4" component="h1" gutterBottom>
              {welcomeMessage}
            </Typography>
            <Button variant="contained" color="primary" href="/mentorship" sx={{ mt: 2 }}>
              Apply for Mentorship
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h2" component="h1" gutterBottom>
              Welcome to PhD Clinic
            </Typography>
            <Typography variant="h5" component="p" gutterBottom>
              The PhD Clinic is here to help you navigate your research journey. Get mentorship and guidance from experienced researchers.
            </Typography>
            <Button variant="contained" color="primary" href="/profile" sx={{ mt: 2 }}>
              Sign Up
            </Button>
            <Button variant="contained" color="secondary" href="/login" sx={{ mt: 2, ml: 2 }}>
              Login
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
};

export default HomePage;
