// src/components/Employees.js
import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Box,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress, FormControl, InputLabel, Select, MenuItem,
  Snackbar, Slide, Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import contributions from "./Contributions";

// Define the available statuses based on your Django model for contributions
const contributionStatus = [
  { value: 'to_do', label: 'To Do' },
  { value: 'approved', label: 'Approved' },
  { value: 'not_approved', label: 'Not Approved' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'false_positive', label: 'False Positive' },
];

// Custom Slide Transition for Snackbar (slides in from left)
function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // State for dialog popup
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  // employeeDetails holds the list of contributions with any local changes
  const [employeeDetails, setEmployeeDetails] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  // Snackbar state for bulk update notifications
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/dashboard/employees`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setEmployees(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleOpenDetails = async (employee) => {
    setSelectedEmployee(employee);
    setOpenDialog(true);
    setDetailsLoading(true);
    setEmployeeDetails([]);
    setDetailsError(null);
    try {
      // Adjust the endpoint as per your backend
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/dashboard/employee/${employee.email}/false_positives`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const detailsData = await response.json();
      console.log(`false_positive_response`, detailsData)
      setEmployeeDetails(detailsData);
    } catch (err) {
      setDetailsError(err.message);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEmployee(null);
    setEmployeeDetails([]);
    setDetailsError(null);
  };

  // Update local state only when status is changed, no API call here.
  const handleContributionStatusChange = (e, idx) => {
    const newStatus = e.target.value;
    setEmployeeDetails(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], status: newStatus };
      return updated;
    });
  };

  // Bulk update: Send the updated contributions in one API call using id and status.
  const handleBulkUpdate = async () => {
    // Construct the payload: an array of objects with id and new status
    console.log(employeeDetails)
    const payload = employeeDetails.map((contribution) => ({
      contribution_id: contribution.id,
      contribution_status: contribution.status,
    }));

    try {
      console.log(JSON.stringify({ contributions: payload }))
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/dashboard/contribution/bulk_update/status`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contributions: payload }),
        }
      );
      if (!response.ok) {
        throw new Error('Bulk update failed');
      }
      setSnackbarMessage(`Bulk update successful`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err) {
      console.error(err);
      setSnackbarMessage(`Error in bulk update: ${err.message}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  if (loading) {
    return <Typography variant="h6">Loading employees...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" color="error">Error: {error}</Typography>;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Typography variant="h4" gutterBottom color="primary">
          Employees
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>First Name</strong></TableCell>
                <TableCell><strong>Last Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Organization</strong></TableCell>
                <TableCell><strong>Address</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee, index) => (
                <TableRow key={index}>
                  <TableCell>{employee.first_name}</TableCell>
                  <TableCell>{employee.last_name}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.organization_name}</TableCell>
                  <TableCell>{employee.address}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleOpenDetails(employee)}
                    >
                      View Related Contributions
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </motion.div>

      {/* Dialog Popup for Employee's Related Contributions */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="lg">
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
          {selectedEmployee
            ? `Contributions for ${selectedEmployee.first_name} ${selectedEmployee.last_name}`
            : 'Employee Contributions'}
        </DialogTitle>
        <DialogContent dividers>
          {detailsLoading ? (
            <CircularProgress />
          ) : detailsError ? (
            <Typography color="error">Error: {detailsError}</Typography>
          ) : employeeDetails && employeeDetails.length > 0 ? (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
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
                  {employeeDetails.map((contribution, idx) => (
                    <TableRow key={idx} hover>
                      <TableCell>{contribution.first_name}</TableCell>
                      <TableCell>{contribution.last_name}</TableCell>
                      <TableCell>{contribution.email}</TableCell>
                      <TableCell>{contribution.address}</TableCell>
                      <TableCell>{contribution.amount} $</TableCell>
                      <TableCell>{contribution.recipient}</TableCell>
                      <TableCell>
                        <FormControl variant="standard" fullWidth>
                          <InputLabel id={`contrib-status-label-${idx}`}>Status</InputLabel>
                          <Select
                            labelId={`contrib-status-label-${idx}`}
                            value={contribution.status || ''}
                            onChange={(e) => handleContributionStatusChange(e, idx)}
                            label="Status"
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
          ) : (
            <Typography>No contributions available.</Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', p: 2 }}>
          <Button onClick={handleCloseDialog} color="primary" variant="outlined">
            Close
          </Button>
          <Button onClick={handleBulkUpdate} color="primary" variant="contained" sx={{ fontWeight: 'bold' }}>
            Submit Bulk Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for bulk update notifications */}
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
              : '2px solid #e34935',
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

export default Employees;
