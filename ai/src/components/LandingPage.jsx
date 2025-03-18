// src/components/LandingPage.js
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Container, Typography, Grid, Card, CardActionArea, CardContent, Box } from '@mui/material';
import { motion } from 'framer-motion';

const navigationCards = [
  { title: 'Employees', description: 'View Employees', link: '/employees' },
  { title: 'Contributions', description: 'View Contribution Dashboard', link: '/contributions' },
];

const LandingPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Typography variant="h2" color="primary" gutterBottom>
            AI Challenge
          </Typography>
          <Typography variant="h5" color="textSecondary">
            Illumis Team.
          </Typography>
        </motion.div>
      </Box>

      {/* Navigation Cards */}
      <Grid container spacing={4} justifyContent="center">
        {navigationCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={card.title}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
            >
              <Card elevation={3}>
                <CardActionArea component={Link} to={card.link}>
                  <CardContent sx={{ textAlign: 'center', backgroundColor: '#ffffff' }}>
                    <Typography variant="h5" color="primary">
                      {card.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {card.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Nested Routes Outlet */}
      <Box sx={{ mt: 6 }}>
        <Outlet />
      </Box>
    </Container>
  );
};

export default LandingPage;
