import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField
} from '@mui/material';

const EmployeeDialogs = ({
  dialogOpen,
  blockDialogOpen,
  blockRemarksDialogOpen,
  employeeToDelete,
  tempIsBlocked,
  tempBlockRemarks,
  employee,
  setDialogOpen,
  setBlockDialogOpen,
  setBlockRemarksDialogOpen,
  setEmployeeToDelete,
  setTempBlockRemarks,
  handleDelete
}) => {
  return (
    <>
      {/* Delete/Enable Confirmation Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEmployeeToDelete(null);
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(61, 82, 160, 0.08)',
            backdropFilter: 'blur(8px)',
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid rgba(61, 82, 160, 0.08)',
          }
        }}
      >
        <DialogTitle sx={{ 
          background: employeeToDelete?.isDeleted 
            ? 'linear-gradient(45deg, #059669, #34d399)'
            : 'linear-gradient(45deg, #dc2626, #ef4444)',
          color: 'white',
          fontWeight: 600,
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
          py: 2.5,
        }}>
          {employeeToDelete?.isDeleted ? "Enable Employee" : "Disable Employee"}
        </DialogTitle>
        <DialogContent sx={{ p: 3, mt: 2 }}>
          <Typography variant="body1" color="text.secondary">
            Are you sure you want to {employeeToDelete?.isDeleted ? "enable" : "disable"} this employee?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 2 }}>
          <Button 
            onClick={() => {
              setDialogOpen(false);
              setEmployeeToDelete(null);
            }}
            variant="outlined"
            sx={{ 
              borderColor: '#3D52A0',
              color: '#3D52A0',
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              padding: '10px 24px',
              '&:hover': {
                borderColor: '#2A3B7D',
                backgroundColor: 'rgba(61, 82, 160, 0.04)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDelete}
            variant="contained"
            sx={{ 
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              padding: '10px 24px',
              background: employeeToDelete?.isDeleted 
                ? 'linear-gradient(45deg, #059669, #34d399)'
                : 'linear-gradient(45deg, #dc2626, #ef4444)',
              boxShadow: 'none',
              '&:hover': {
                background: employeeToDelete?.isDeleted 
                  ? 'linear-gradient(45deg, #047857, #10b981)'
                  : 'linear-gradient(45deg, #b91c1c, #dc2626)',
                transform: 'translateY(-1px)',
                boxShadow: employeeToDelete?.isDeleted 
                  ? '0 4px 12px rgba(5, 150, 105, 0.2)'
                  : '0 4px 12px rgba(220, 38, 38, 0.2)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            {employeeToDelete?.isDeleted ? "Enable" : "Disable"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Block Dialog */}
      <Dialog 
        open={blockDialogOpen} 
        onClose={() => {
          setBlockDialogOpen(false);
          setTempBlockRemarks("");
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(61, 82, 160, 0.08)',
            backdropFilter: 'blur(8px)',
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid rgba(61, 82, 160, 0.08)',
          }
        }}
      >
        <DialogTitle sx={{ 
          background: tempIsBlocked 
            ? 'linear-gradient(45deg, #dc2626, #ef4444)'
            : 'linear-gradient(45deg, #059669, #34d399)',
          color: 'white',
          fontWeight: 600,
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
          py: 2.5,
        }}>
          {tempIsBlocked ? "Block Employee" : "Unblock Employee"}
        </DialogTitle>
        <DialogContent sx={{ p: 3, mt: 2 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: tempIsBlocked ? 3 : 0 }}>
            {tempIsBlocked 
              ? "Please provide a reason for blocking this employee." 
              : "Are you sure you want to unblock this employee?"}
          </Typography>
          {tempIsBlocked && (
            <TextField
              fullWidth
              label="Block Remarks"
              multiline
              rows={4}
              value={tempBlockRemarks}
              onChange={(e) => setTempBlockRemarks(e.target.value)}
              required
              error={tempIsBlocked && !tempBlockRemarks}
              helperText={tempIsBlocked && !tempBlockRemarks ? "Remarks are required for blocking" : ""}
              sx={{
                mt: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&:hover fieldset': {
                    borderColor: '#7091E6',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#3D52A0',
                    borderWidth: '2px',
                  },
                },
              }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(61, 82, 160, 0.1)' }}>
          <Button 
            onClick={() => {
              setBlockDialogOpen(false);
              setTempBlockRemarks("");
            }}
            variant="contained"
            sx={{ 
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              padding: '10px 24px',
              background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
              boxShadow: 'none',
              '&:hover': {
                background: 'linear-gradient(45deg, #2A3B7D, #5F739C)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(61, 82, 160, 0.2)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Block Remarks Dialog */}
      <Dialog 
        open={blockRemarksDialogOpen} 
        onClose={() => setBlockRemarksDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(61, 82, 160, 0.08)',
            backdropFilter: 'blur(8px)',
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid rgba(61, 82, 160, 0.08)',
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(45deg, #dc2626, #ef4444)',
          color: 'white',
          fontWeight: 600,
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
          py: 2.5,
        }}>
          Block Remarks
        </DialogTitle>
        <DialogContent sx={{ p: 3, mt: 2 }}>
          <Box sx={{ 
            backgroundColor: 'rgba(61, 82, 160, 0.04)',
            borderRadius: '12px',
            p: 3,
            border: '1px solid rgba(61, 82, 160, 0.1)'
          }}>
            <Typography variant="body1" sx={{ mb: 2, color: 'text.primary' }}>
              {employee.blockedRemarks || "No remarks available"}
            </Typography>
            {employee.blockedBy && (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 1,
                mt: 3,
                pt: 3,
                borderTop: '1px solid rgba(61, 82, 160, 0.1)'
              }}>
                <Typography variant="body2" color="text.secondary">
                  Blocked by: {employee.blockedBy}
                </Typography>
                {employee.blockedOn && (
                  <Typography variant="body2" color="text.secondary">
                    Blocked on: {new Date(employee.blockedOn).toLocaleString()}
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(61, 82, 160, 0.1)' }}>
          <Button 
            onClick={() => setBlockRemarksDialogOpen(false)}
            variant="contained"
            sx={{ 
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              padding: '10px 24px',
              background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
              boxShadow: 'none',
              '&:hover': {
                background: 'linear-gradient(45deg, #2A3B7D, #5F739C)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(61, 82, 160, 0.2)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EmployeeDialogs; 