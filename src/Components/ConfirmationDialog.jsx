import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  TextField,
  Box,
  CircularProgress,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  remarks,
  setRemarks,
  loading,
  confirmButtonText = 'Delete',
  confirmButtonColor = 'error',
  requireRemarks = true,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{
        color: theme => theme.palette[confirmButtonColor].main,
        fontWeight: 600,
      }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <Typography gutterBottom>
          {message}
        </Typography>
        {requireRemarks && (
          <TextField
            fullWidth
            label="Remarks"
            multiline
            rows={3}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            required
            margin="normal"
          />
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color={confirmButtonColor}
          disabled={loading || (requireRemarks && !remarks?.trim())}
          startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
        >
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(ConfirmationDialog);
