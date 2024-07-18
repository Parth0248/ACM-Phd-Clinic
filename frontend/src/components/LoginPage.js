import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import ACMLogo from '../ACM.png';

// Set the base URL for the axios instance to the backend server
axios.defaults.baseURL = 'https://phd-clinic.onrender.com';

const LoginPage = () => {
  const { toggleTheme } = useThemeContext();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/login', credentials)
      .then((response) => {
        localStorage.setItem('userProfile', JSON.stringify(response.data));
        navigate('/');
      })
      .catch((error) => {
        setError('Invalid email or password. Please try again.');
      });
  };

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
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
      </Box>
      {error && (
        <Box sx={{ textAlign: 'center', my: 2 }}>
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
          value={credentials.email}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          required
        />
        <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
          Login
        </Button>
      </form>
    </Container>
  );
};

export default LoginPage;
