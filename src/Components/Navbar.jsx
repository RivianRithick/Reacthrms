import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUsers, FaBuilding, FaTasks, FaUserTie, FaSignOutAlt, FaMoneyBillWave } from "react-icons/fa";
import axiosInstance from "../apiService";
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const NavBar = () => {
  const navigate = useNavigate();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleLogout = async () => {
    try {
      const email = localStorage.getItem("email");
      if (!email) {
        navigate("/login", { replace: true });
        return;
      }

      await axiosInstance.post("/api/admin-logout", { email });
      localStorage.clear();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login", { replace: true });
      }
    }
  };

  const navItems = [
    { text: "Employees", icon: <FaUsers />, path: "/employees" },
    { text: "Clients", icon: <FaBuilding />, path: "/clients" },
    { text: "Employee Role Assign", icon: <FaTasks />, path: "/employee-role-assign" },
    { text: "Assigned Employee", icon: <FaUserTie />, path: "/assigned-employee" },
    { text: "Department", icon: <FaBuilding />, path: "/department" },
    { text: "Job Role", icon: <FaTasks />, path: "/jobRole" },
    { text: "Job Locations", icon: <FaBuilding />, path: "/employee-job-locations" },
    { text: "Employee Salary", icon: <FaMoneyBillWave />, path: "/salaries" },
  ];

  const renderNavItems = () => (
    <>
      {navItems.map((item) => (
        <Button
          key={item.path}
          component={Link}
          to={item.path}
          sx={{
            color: 'white',
            mx: 1,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              transform: 'translateY(-2px)',
              transition: 'all 0.3s'
            },
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            textTransform: 'none',
            fontSize: '1rem',
          }}
        >
          {item.icon}
          {item.text}
        </Button>
      ))}
    </>
  );

  const renderMobileDrawer = () => (
    <Drawer
      anchor="left"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
      sx={{
        '& .MuiDrawer-paper': {
          width: 240,
          backgroundColor: theme.palette.primary.main,
          color: 'white'
        }
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
          HRMS
        </Typography>
      </Box>
      <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.path}
            button
            component={Link}
            to={item.path}
            onClick={() => setMobileMenuOpen(false)}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="contained"
          color="error"
          onClick={() => setLogoutDialogOpen(true)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            textTransform: 'none'
          }}
        >
          <FaSignOutAlt />
          Logout
        </Button>
      </Box>
    </Drawer>
  );

  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: theme.palette.primary.main }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                onClick={() => setMobileMenuOpen(true)}
                edge="start"
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                HRMS
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                HRMS
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {renderNavItems()}
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => setLogoutDialogOpen(true)}
                  sx={{
                    ml: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    textTransform: 'none',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s'
                    }
                  }}
                >
                  <FaSignOutAlt />
                  Logout
                </Button>
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>

      {renderMobileDrawer()}

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ 
          backgroundColor: theme.palette.primary.main, 
          color: 'white',
          fontWeight: 'bold' 
        }}>
          Confirm Logout
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography>
            Are you sure you want to logout?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setLogoutDialogOpen(false)}
            variant="outlined"
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogout}
            variant="contained"
            color="error"
            sx={{ textTransform: 'none' }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NavBar;
