// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import LandingPage from './components/LandingPage';
import Home from './components/Home';
// import ApiDataTab from './components/ApiDataTab';
import Employees from "./components/Employees";
import Contributions from './components/Contributions';  // Import the new component

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />}>
            <Route index element={<Navigate to="/home" replace />} />
            <Route path="home" element={<Home />} />
            <Route path="employees" element={<Employees />} />
            <Route path="contributions" element={<Contributions />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
