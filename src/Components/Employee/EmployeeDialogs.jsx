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
      >
        <DialogTitle sx={{ 
          color: employeeToDelete?.isDeleted ? 'success.main' : 'error.main',
          fontWeight: 600,
          pb: 1
        }}>
          {employeeToDelete?.isDeleted ? "Enable Employee" : "Disable Employee"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Are you sure you want to {employeeToDelete?.isDeleted ? "enable" : "disable"} this employee?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => {
              setDialogOpen(false);
              setEmployeeToDelete(null);
            }}
            variant="outlined"
            sx={{ 
              borderRadius: '50px',
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDelete}
            variant="contained"
            sx={{ 
              borderRadius: '50px',
              px: 3,
              background: employeeToDelete?.isDeleted 
                ? 'linear-gradient(45deg, #00c853 30%, #69f0ae 90%)'
                : 'linear-gradient(45deg, #ff1744 30%, #ff4569 90%)'
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
      >
        <DialogTitle sx={{ 
          pb: 1,
          color: tempIsBlocked ? 'error.main' : 'success.main',
          fontWeight: 600 
        }}>
          {tempIsBlocked ? "Block Employee" : "Unblock Employee"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
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
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                }
              }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
          <Button 
            onClick={() => {
              setBlockDialogOpen(false);
              setTempBlockRemarks("");
            }}
            variant="contained"
            sx={{ 
              borderRadius: '50px',
              px: 3,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
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
      >
        <DialogTitle sx={{ 
          color: 'error.main',
          fontWeight: 600,
          borderBottom: '1px solid #eee',
          pb: 2
        }}>
          Block Remarks
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ 
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            p: 3,
            border: '1px solid #eee'
          }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {employee.blockedRemarks || "No remarks available"}
            </Typography>
            {employee.blockedBy && (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 0.5,
                mt: 2,
                pt: 2,
                borderTop: '1px solid #eee'
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
        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
          <Button 
            onClick={() => setBlockRemarksDialogOpen(false)}
            variant="contained"
            sx={{ 
              borderRadius: '50px',
              px: 3,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
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