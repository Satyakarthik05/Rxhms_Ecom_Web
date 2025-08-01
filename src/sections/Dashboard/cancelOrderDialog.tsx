import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  TextField,
  IconButton,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ReasonMaster } from './model/reasonMaster';
import { useFetch } from '../../customHooks/useFetch';
import { CancelOrderReasons } from './profileService/profileService';

interface CancelOrderDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

const CancelOrderDialog: React.FC<CancelOrderDialogProps> = ({ open, onClose, onConfirm }) => {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [otherReason, setOtherReason] = useState<string>('');


  const { data: reasons, isLoading, error } = useFetch<ReasonMaster[]>(CancelOrderReasons);

  const handleConfirm = () => {
    const reasonToSend = selectedReason === 'Other Reason' ? otherReason : selectedReason;
    if (reasonToSend.trim()) {
      onConfirm(reasonToSend);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          width: { xs: '95%', sm: '90%', md: '500px' },
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle>
        Cancel Order
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
          Reason For Cancellation
        </Typography>
        <Typography variant="body2" gutterBottom color="text.secondary">
          Please tell us correct reason for cancellation. This information is only used to improve our services.
        </Typography>

        {isLoading ? (
          <CircularProgress sx={{ mt: 2 }} />
        ) : error ? (
          <Typography color="error">Failed to load reasons.</Typography>
        ) : (
          <RadioGroup
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value)}
          >
            {reasons?.map((item) => (
              <FormControlLabel
                key={item.id}
                value={item.reason}
                control={<Radio />}
                label={item.reason}
              />
            ))}
            <FormControlLabel
              value="Other Reason"
              control={<Radio />}
              label="Other Reason"
            />
          </RadioGroup>
        )}

        {selectedReason === 'Other Reason' && (
          <TextField
            fullWidth
            multiline
            minRows={3}
            placeholder="Other Reason"
            value={otherReason}
            onChange={(e) => setOtherReason(e.target.value)}
            sx={{ mt: 1,
           backgroundColor: (theme) => theme.palette.info.main,

            }}
          />
        )}
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          color="error"
          onClick={handleConfirm}
          fullWidth
          sx={{ m: 2, height: 50, textTransform: 'none' }}
          disabled={isLoading || (!selectedReason && otherReason.trim() === '')}
        >
          Cancel Order
        </Button>
      </DialogActions>


      
    </Dialog>




  );
};

export default CancelOrderDialog;
