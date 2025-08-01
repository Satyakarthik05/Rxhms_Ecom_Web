import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  Avatar,
  TextField,
} from "@mui/material";
import { useFetch } from "../../../customHooks/useFetch";
import { ReasonMaster } from "../model/reasonMaster";
import { GetOrderReturnReasons } from "../profileService/profileService";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

interface ReturnReasonFormProps {
  selectedItems: any[];
  returnReasonId: number | null;
  returnReason: string;
  onReasonChange: (id: number | null, reason: string) => void;
}

const ReturnReasonForm: React.FC<ReturnReasonFormProps> = ({
  selectedItems,returnReasonId,returnReason,
  onReasonChange,
}) => {
  const [condition, setCondition] = useState("");
  const [otherReason, setOtherReason] = useState("");
  


  const {
    data: reasons,
    isLoading,
    error,
  } = useFetch<ReasonMaster[]>(GetOrderReturnReasons);


    useEffect(() => {
    if (returnReasonId !== null) {
      const selected = reasons?.find((r) => r.id === returnReasonId);
      if (selected) {
        setCondition(selected.reason);
        setOtherReason("");
      }
    } else if (returnReason) {
      setCondition("Other");
      setOtherReason(returnReason);
    } else {
      setCondition("");
      setOtherReason("");
    }
  }, [returnReasonId, returnReason, reasons]);

  const handleConditionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedReason = event.target.value;
    setCondition(selectedReason);

    if (selectedReason === "Other") {
      setOtherReason(""); 
      onReasonChange(null, ""); 
    } else {
      const selected = reasons?.find((r) => r.reason === selectedReason);
      if (selected) {
        onReasonChange(selected.id, selected.reason);
      }
    }
  };

  const handleOtherReasonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOtherReason(value);
    onReasonChange(null, value);
  };

  return (
    <Container maxWidth="md" >
      <Box>
      <Typography variant="h6" gutterBottom>
        Select the reason for your return
      </Typography>
      <Typography variant="body2" gutterBottom>
        To help us process your request quickly, please answer the following
        questions.
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{backgroundColor: (theme) => theme.palette.info.main,}}>
              <TableCell>Product</TableCell>
              <TableCell sx={{ textAlign: "center" }}>Total Quantity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedItems.map((item) => (
              <TableRow key={item.itemId}>
                <TableCell>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                      <Avatar
                        src={item.productCard.itemImage}
                        variant="square"
                        sx={{ width: 48, height: 48 }}
                      />
                    </Grid>
                    <Grid item>
                      <Typography variant="body2">
                        {item.productCard.itemTitle}
                      </Typography>
                    </Grid>
                  </Grid>
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <Box
                    sx={{
                      backgroundColor: (theme) => theme.palette.info.main,
                      padding: 0.5,
                      px: 1.5,
                      py: 0.5,
                      borderRadius: "8px",
                      fontSize: "14px",
                      display: "inline-block",
                      minWidth: "70px",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {item.returnQty}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Grid container spacing={4} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <FormControl component="fieldset">
            <RadioGroup value={condition} onChange={handleConditionChange}>
              {isLoading && <Typography>Loading reasons...</Typography>}
              {error && (
                <Typography color="error">Error loading reasons</Typography>
              )}
              {!isLoading &&
                !error &&
                reasons?.map((reason) => (
                  <FormControlLabel
                    key={reason.id}
                    value={reason.reason}
                    control={<Radio />}
                    label={reason.reason}
                  />
                ))}

              <FormControlLabel
                value="Other"
                control={<Radio />}
                label="Other"
              />
            </RadioGroup>
          </FormControl>

          {condition === "Other" && (
            <TextField
              fullWidth
              multiline
              minRows={3}
              placeholder="Please specify your reason"
              value={otherReason}
              onChange={handleOtherReasonChange}
              inputProps={{ minLength: 3, maxLength: 50 }}
              sx={{ mt: 1,
               backgroundColor: (theme) => theme.palette.info.main,


              }}
            />
          )}
        </Grid>
     </Grid>
     </Box>

    </Container>
  );
};

export default ReturnReasonForm;
