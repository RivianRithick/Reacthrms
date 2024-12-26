import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  useTheme,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  alpha,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  AttachMoney as MoneyIcon,
  Assignment as AssignmentIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
  SupervisorAccount as SupervisorIcon,
  PersonSearch as RecruiterIcon,
} from '@mui/icons-material';
import { getAuthorizedMenuItems } from '../../utils/rbac';

const drawerWidth = 280;
const collapsedWidth = 80;

// Map of icon strings to icon components
const iconMap = {
  PeopleIcon,
  BusinessIcon,
  LocationIcon,
  WorkIcon,
  MoneyIcon,
  AssignmentIcon,
  PersonIcon,
  GroupIcon,
  SupervisorIcon,
  RecruiterIcon,
};

const Sidebar = ({ onToggle }) => {
  const [open, setOpen] = useState(true);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (onToggle) {
      onToggle(open);
    }
  }, [open, onToggle]);

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    localStorage.clear();
    setLogoutDialogOpen(false);
    navigate('/login');
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  // Get authorized menu items based on user role
  const authorizedMenuItems = getAuthorizedMenuItems();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : collapsedWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : collapsedWidth,
          transition: theme.transitions.create(['width', 'background-color'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          backgroundColor: '#1a237e',
          backgroundImage: 'linear-gradient(180deg, #1a237e 0%, #283593 100%)',
          color: 'white',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          boxShadow: '4px 0 8px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'space-between' : 'center',
          padding: theme.spacing(3),
          backgroundColor: alpha('#000', 0.1),
        }}
      >
        {open && (
          <Typography 
            variant="h5" 
            noWrap 
            component="div"
            sx={{ 
              fontWeight: 600,
              letterSpacing: '0.5px',
              background: 'linear-gradient(45deg, #fff 30%, #e3f2fd 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            HRMS
          </Typography>
        )}
        <IconButton
          onClick={handleDrawerToggle} 
          sx={{ 
            color: 'white',
            backgroundColor: alpha('#fff', 0.1),
            '&:hover': {
              backgroundColor: alpha('#fff', 0.2),
            },
            width: 35,
            height: 35,
          }}
        >
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Box>
      <Divider sx={{ backgroundColor: alpha('#fff', 0.1), margin: '0' }} />
      <List sx={{ 
        flexGrow: 1, 
        pt: 2,
        pb: 2,
        px: 1,
      }}>
        {authorizedMenuItems.map((item) => {
          const IconComponent = iconMap[item.icon];
          return (
            <ListItem
              button
              key={item.text}
              component={Link}
              to={item.path}
              sx={{
                minHeight: 48,
                mb: 0.5,
                justifyContent: open ? 'initial' : 'center',
                borderRadius: '12px',
                px: 2,
                backgroundColor:
                  location.pathname === item.path
                    ? alpha('#fff', 0.15)
                    : 'transparent',
                '&:hover': {
                  backgroundColor: alpha('#fff', 0.1),
                  transform: 'translateX(5px)',
                  transition: 'transform 0.2s ease-in-out',
                },
                transition: theme.transitions.create(['background-color', 'transform'], {
                  duration: '0.2s',
                }),
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                {IconComponent && <IconComponent />}
              </ListItemIcon>
              {open && (
                <ListItemText
                  primary={item.text}
                  sx={{
                    opacity: 1,
                    '& .MuiTypography-root': {
                      fontWeight: location.pathname === item.path ? 600 : 400,
                      fontSize: '0.95rem',
                      whiteSpace: 'nowrap',
                      letterSpacing: '0.3px',
                    },
                  }}
                />
              )}
            </ListItem>
          );
        })}
      </List>
      <Divider sx={{ backgroundColor: alpha('#fff', 0.1), margin: '0' }} />
      <Box sx={{ p: 2 }}>
        <ListItem
          button
          onClick={handleLogoutClick}
          sx={{
            minHeight: 48,
            justifyContent: open ? 'initial' : 'center',
            borderRadius: '12px',
            px: 2,
            backgroundColor: '#d32f2f',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: '#f44336',
              transform: 'translateY(-2px)',
              cursor: 'pointer',
            },
            transition: 'transform 0.2s ease-in-out',
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : 'auto',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            <LogoutIcon sx={{ fontSize: '20px' }} />
          </ListItemIcon>
          {open && (
            <ListItemText
              primary="Logout"
              sx={{
                opacity: 1,
                '& .MuiTypography-root': {
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  letterSpacing: '0.3px',
                  color: 'white',
                },
              }}
            />
          )}
        </ListItem>
      </Box>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
          },
        }}
      >
        <DialogTitle sx={{ 
          pb: 1,
          fontWeight: 600,
        }}>
          Confirm Logout
        </DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <Typography>
            Are you sure you want to logout?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleLogoutCancel}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: alpha('#000', 0.05),
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogoutConfirm}
            variant="contained"
            color="error"
            sx={{
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: '#d32f2f',
              },
            }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
};

export default Sidebar;
