import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

type ConfirmationDialogProps = {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
  onAccept: () => void;
  onReject?: () => void;
};

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  title,
  description,
  onClose,
  onAccept,
  onReject,
}) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      PaperProps={{
        sx: { position: 'relative', p: 2 },
      }}
    >
      <DialogTitle>
        <Typography variant="h6">{title}</Typography>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="textSecondary">
          {description}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          onClick={onReject || onClose}
          sx={{ textTransform: 'none' }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onAccept}
          sx={{ textTransform: 'none', backgroundColor: '#334F3E' }}
        >
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
