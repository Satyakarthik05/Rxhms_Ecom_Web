import React, { useState } from "react";
import {
  Container,
  Grid,
  Box,
  Typography,
  Avatar,
} from "@mui/material";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

interface ReturnSummaryProps {
  selectedItems: any[];
  returnReason: string;
}

const ReturnSummary: React.FC<ReturnSummaryProps> = ({
  selectedItems,
  returnReason,
}) => {
  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Typography variant="h6" gutterBottom>
        Review your return request
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
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Reason:&nbsp;
            <Typography
              component="span"
              variant="body1"
              sx={{ fontWeight: 400 }}
            >
              {returnReason || "—"}
            </Typography>
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ReturnSummary;
