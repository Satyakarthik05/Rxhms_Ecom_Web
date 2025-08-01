import React from 'react';
import { Box, Typography, Button } from '@mui/material';

interface NotFoundProps {
  title?: string;
  message?: string;
  imageSrc?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

const NotFound: React.FC<NotFoundProps> = ({

    
  title,
  message, 
  imageSrc,
  buttonText,
  onButtonClick = () => {
      
},

  
}) => {
  return (
    <Box
      minHeight="80vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      px={2}
    >
      <Typography  fontWeight={200} mb={4} sx={{fontSize:'54px', lineHeight:'100%'}}>
        {title}
      </Typography>

      <Box
        component="img"
        src={imageSrc}
        alt="Not Found Illustration"
        sx={{ maxWidth: 200, mb: 4 }}
      />

      <Typography variant="h6" fontWeight={600} gutterBottom>
        We couldn't find what you were looking for
      </Typography>

      <Typography variant="body1" mb={3}>
        {message}
      </Typography>

      <Button
        variant="contained"
        sx={{
          backgroundColor: '#334F3E',
          borderRadius: 1,
          px: 4,
          py: 1.5,
          textTransform: 'none',
          '&:hover': {
            backgroundColor: '#2f3e30',
          },
        }}
        onClick={onButtonClick}
      >
        {buttonText}
      </Button>
    </Box>
  );
};

export default NotFound;
