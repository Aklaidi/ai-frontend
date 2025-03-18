// src/components/Contributions.js
import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Box,
  Select, MenuItem, FormControl, InputLabel,
  Snackbar, Slide, Alert
} from '@mui/material';
import { motion } from 'framer-motion';

// Define the available statuses based on your Django model
const contributionStatus = [
  { value: 'to_do', label: 'To Do' },
  { value: 'approved', label: 'Approved' },
  { value: 'not_approved', label: 'Not Approved' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'false_positive', label: 'False Positive' },
];

// Custom Slide Transition for Snackbar (slides in from right)
function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

const Contributions = () => {
  const [contributions, setContributions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Snackbar state for notifications
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' or 'error'

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/dashboard/contribution`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setContributions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, []);

  // Handle status update with backend call (sending status as query parameter)
  const handleStatusChange = async (e, index) => {
    const newStatus = e.target.value;
    if (contributions[index].status === newStatus) return;

    const updatedContribution = { ...contributions[index], status: newStatus };
    setContributions(prev => {
      const updated = [...prev];
      updated[index] = updatedContribution;
      return updated;
    });

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/dashboard/contribution/${updatedContribution.email}?contribution_status=${newStatus}`,
        { method: 'PUT' }
      );
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      setSnackbarMessage(`Status updated for ${updatedContribution.first_name} ${updatedContribution.last_name}`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err) {
      console.error(err);
      setSnackbarMessage(`Error updating status: ${err.message}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setContributions(prev => {
        const updated = [...prev];
        updated[index] = { ...updated[index], status: contributions[index].status };
        return updated;
      });
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  if (loading) {
    return <Typography variant="h6" sx={{ mt: 2 }}>Loading contributions...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" sx={{ mt: 2 }} color="error">Error: {error}</Typography>;
  }

  return (
    <Box sx={{ mt: 4, mx: 2 }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Typography variant="h4" gutterBottom color="primary" sx={{ fontWeight: 'bold', fontFamily: 'Arial, sans-serif' }}>
          Contributions Dashboard
        </Typography>
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f4f5f7' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>First Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Last Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Address</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Recipient</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contributions.map((contribution, index) => (
                <TableRow key={index} hover>
                  <TableCell>{contribution.first_name}</TableCell>
                  <TableCell>{contribution.last_name}</TableCell>
                  <TableCell>{contribution.email}</TableCell>
                  <TableCell>{contribution.address}</TableCell>
                  <TableCell>{contribution.amount} $</TableCell>
                  <TableCell>{contribution.recipient}</TableCell>
                  <TableCell>
                    <FormControl variant="standard" fullWidth>
                      <InputLabel id={`status-label-${index}`}>Status</InputLabel>
                      <Select
                        labelId={`status-label-${index}`}
                        value={contribution.status || ''}
                        onChange={(e) => handleStatusChange(e, index)}
                        label="Status"
                        sx={{ fontFamily: 'Arial, sans-serif' }}
                      >
                        {contributionStatus.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </motion.div>

      {/* Custom Snackbar styled to mimic Jira notifications */}
      <Snackbar
        open={snackbarOpen}
        onClose={handleCloseSnackbar}
        autoHideDuration={3000}
        TransitionComponent={SlideTransition}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          variant="filled"
          sx={{
            width: '100%',
            fontSize: '1.1rem',
            padding: '1rem',
            border: snackbarSeverity === 'success'
              ? '2px solid #0052cc'
              : '2px solid #e34935', // Slight red tone for errors
            boxShadow: 3,
            backgroundColor: '#ffffff',
            color: '#0052cc',
            fontWeight: 'bold'
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Contributions;
