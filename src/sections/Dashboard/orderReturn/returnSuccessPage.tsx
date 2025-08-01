import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import successImage from '../../../assets/media/icons/successtick.svg';
import { useNavigate } from 'react-router-dom';

const ReturnRequestSuccess: React.FC = () => {
  const navigator = useNavigate();

  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        px: 2,
      }}
    >
      <Box>
        <Box
          component="img"
          src={successImage}
          alt="Success"
          sx={{
            width: { xs: 80, sm: 100 },
            height: { xs: 80, sm: 100 },
            mb: 2,
          }}
        />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 500,
            fontSize: { xs: '1rem', sm: '1.25rem' },
            mb: 1,
          }}
        >
          Your return request has been successfully received.
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            mb: 3,
            fontSize: { xs: '0.85rem', sm: '1rem' },
          }}
        >
          We are currently reviewing your request to return your items. You can
          track the progress for updates.
        </Typography>
        <Button
          variant="contained"
          sx={{
            borderRadius: 1,
            textTransform: 'none',
            px: 4,
            py: 1,
            fontSize: { xs: '0.85rem', sm: '1rem' },
            backgroundColor: (theme) => theme.palette.success.light,
          }}
          onClick={() => {
            navigator('/');
          }}
        >
          Go To Homepage
        </Button>
      </Box>
    </Container>
  );
};

export default ReturnRequestSuccess;
