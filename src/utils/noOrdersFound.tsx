import { Box, Button, Typography } from "@mui/material";
import noOrdersSvg from "../../src/assets/media/images/noOrdersFound.svg";

interface NoOrdersFoundProps {
  message?: string;
  imageUrl?: string;
  height?: string | number;
  buttonLabel?: string;
  onButtonClick?: () => void;
}

const NoOrdersFound: React.FC<NoOrdersFoundProps> = ({
  message = "No orders found",
  imageUrl = noOrdersSvg,
  height = "60vh",
  buttonLabel,
  onButtonClick = () => {},
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height={height}
      textAlign="center"
      mt={4}
    >
      <img
        src={imageUrl}
        alt="No Data"
        style={{
          width: 160,
          height: "auto",
          opacity: 0.5,
        }}
      />
      <Typography variant="h6" mt={2} color="text.secondary">
        {message}
      </Typography>

      {buttonLabel && onButtonClick && (
        <Button
          variant="contained"
          onClick={onButtonClick}
          sx={{
            backgroundColor: "#334F3E",
            borderRadius: 1,
            mt: 1,
            px: 4,
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#2f3e30",
            },
          }}
        >
          {buttonLabel}
        </Button>
      )}
    </Box>
  );
};

export default NoOrdersFound;
