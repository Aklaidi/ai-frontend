// src/components/ApiDataTab.js
import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import ApiData from './ApiData';

const ApiDataTab = () => {
  return (
    <Paper elevation={3} sx={{ p: 3, backgroundColor: '#ffffff' }}>
      <Box sx={{ mt: 2 }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <Typography variant="h4" color="primary" gutterBottom>
            API Data
          </Typography>
          <ApiData />
        </motion.div>
      </Box>
    </Paper>
  );
};

export default ApiDataTab;
