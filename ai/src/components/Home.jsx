// src/components/Home.js
import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <Paper elevation={2} sx={{ p: 3, backgroundColor: '#ffffff' }}>
      <Box sx={{ mt: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h4" color="primary" gutterBottom>
            Description
          </Typography>
          <Typography variant="body1" component="div">
            This is a simple AI solution for the Illumis Compliance Dashboard. We use an incremental learning
            system to match employees with contributor data. Key highlights of our approach include:
            <ul>
              <li>
                <strong>Text Embeddings</strong>: We leverage the <em>all-MiniLM-L6-v2</em> model from
                SentenceTransformer to generate 384-dimensional embeddings for names and addresses.
              </li>
              <li>
                <strong>Feature Engineering</strong>: Four embeddings (employee name, contributor name,
                employee address, contributor address) are concatenated into a 1536-dimensional vector,
                then normalized with a <em>StandardScaler</em>.
              </li>
              <li>
                <strong>Incremental Learning</strong>: An <em>SGDClassifier</em> with <em>log_loss</em> is
                trained via <em>partial_fit</em>, allowing the model to adapt continuously to new data
                without full retraining.
              </li>
              <li>
                <strong>Local Processing</strong>: All embedding and training steps occur securely in your
                environment, ensuring data privacy and compliance.
              </li>
            </ul>
          </Typography>
        </motion.div>
      </Box>
    </Paper>
  );
};

export default Home;
