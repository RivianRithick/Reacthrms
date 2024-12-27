import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Block as BlockIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { getUserRole } from '../utils/rbac';

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    const userRole = getUserRole();
    if (userRole) {
      // If user is authenticated, go to employees page
      navigate('/employees');
    } else {
      // If user is not authenticated, go to login
      navigate('/login');
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        >
          <BlockIcon
            sx={{
              fontSize: 100,
              color: 'error.main',
              mb: 3,
            }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: 'error.main',
              mb: 2,
            }}
          >
            Access Denied
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Typography
            variant="h6"
            color="textSecondary"
            paragraph
            sx={{ mb: 4 }}
          >
            You don't have permission to access this page.
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleNavigation}
            sx={{
              py: 1.5,
              px: 4,
              borderRadius: 2,
              fontSize: '1.1rem',
              textTransform: 'none',
              background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
              '&:hover': {
                background: 'linear-gradient(45deg, #2A3B7D, #5F739C)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(61, 82, 160, 0.2)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            {getUserRole() ? 'Go to Employees' : 'Go to Login'}
          </Button>
        </motion.div>
      </Box>
    </Container>
  );
};

export default Unauthorized; 