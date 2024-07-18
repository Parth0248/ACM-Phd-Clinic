import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import ProfileCreationPage from './components/ProfileCreationPage';
import MentorshipApplicationPage from './components/MentorshipApplicationPage';
import LoginPage from './components/LoginPage';
import { ThemeProviderWrapper } from './ThemeContext';

function App() {
  return (
    <ThemeProviderWrapper>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfileCreationPage />} />
          <Route path="/mentorship" element={<MentorshipApplicationPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
    </ThemeProviderWrapper>
  );
}

export default App;
