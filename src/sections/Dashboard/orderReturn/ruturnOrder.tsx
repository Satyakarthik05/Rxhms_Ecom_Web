import React, { useState } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Checkbox,
  Paper,
  Avatar,
  Grid,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Link,
  Breadcrumbs,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useFetchByQuery } from "../../../customHooks/useFetchByQuery";
import {
  OrderRetrunCreateUri,
  OrdersByOrderNum,
} from "../profileService/profileService";
import { useNavigate, useParams } from "react-router-dom";
import { OrderMaster } from "../../myCart/model/orderMaster";
import ReturnReasonForm from "./returnReasonForm";
import { SelectChangeEvent } from "@mui/material";
import ReturnSummary from "./returnSummary";
import { usePostByBody } from "../../../customHooks/usePostByBody";
import { ReturnItem } from "./model/returnItem";
import ReturnRequestSuccess from "./returnSuccessPage";
import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined";
import { RootState } from "../../../Redux/store/store";
import { useSelector } from "react-redux";

const steps = ["Your details", "Reason for Return", "Review & Submit"];

const ReturnOrdersForm: React.FC = () => {
  const { orderNum } = useParams<{ orderNum: string }>();
  const { data: Orders } = useFetchByQuery<OrderMaster>(OrdersByOrderNum, {
    orderNum,
  });
  console.log("Orders", Orders);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [selectedQtyMap, setSelectedQtyMap] = useState<{
    [key: number]: number;
  }>({});
  const [selectedProductsData, setSelectedProductsData] = useState<any[]>([]);
  const [returnReasonId, setReturnReasonId] = useState<number | null>(null);

  const [returnReason, setReturnReason] = useState("");

  const orderItems = Orders?.orderItems || [];

  const isAllSelected =
    orderItems.length > 0 && selectedProducts.length === orderItems.length;
  const isSomeSelected =
    selectedProducts.length > 0 && selectedProducts.length < orderItems.length;

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });

  const { DAYS: days } = useSelector((state: RootState) => state.returnTerm);

  console.log("days", days);
  console.log("days", Orders?.placedOn);

  const { executePost } = usePostByBody<any>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const showSnackbar = (message: string) => {
    setSnackbar({ open: true, message });
  };
  const [isSuccess, setIsSuccess] = useState(false);

  const handleNext = async () => {
    if (activeStep === 0) {
      if (selectedProducts.length === 0) {
        showSnackbar("Please select product to return.");
        setSnackbarOpen(true);
        return;
      }

      if (Orders?.orderItems) {
        const selectedData = Orders.orderItems
          .filter((item) => selectedProducts.includes(item.itemId))
          .map((item) => ({
            ...item,
            returnQty: selectedQtyMap[item.itemId] || item.qty,
          }));
        setSelectedProductsData(selectedData);
      }
    }

    if (activeStep === 1) {
      if (!returnReason || (returnReasonId === null && returnReason === "")) {
        showSnackbar("Please select one reason.");
        setSnackbarOpen(true);
        return;
      }
      if (returnReasonId === null) {
        if (returnReason.length < 3 || returnReason.length > 50) {
          showSnackbar("Please enter reason between 3 and 50 characters.");
          setSnackbarOpen(true);
          return;
        }
      }
    }

    if (activeStep === steps.length - 1) {
      const returnItems: Record<number, number> = {};

      selectedProductsData.forEach((item) => {
        returnItems[item.itemId] = item.returnQty;
      });
      const payload: ReturnItem = {
        orderNum: Orders!.orderNum,
        returnItems,
        reasonId: returnReasonId,
        reason: returnReason,
      };

      const result: any = await executePost(OrderRetrunCreateUri, payload);

      if (result) {
        console.log("Return request submitted successfully:", result);
        setIsSuccess(true);
      } else {
        console.error("Error submitting return request:");
        showSnackbar("Failed to submit return request. Please try again.");
        setSnackbarOpen(true);
      }

      return;
    }

    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleAllCheckboxChange = (checked: boolean) => {
    if (checked) {
      const returnableItems =
        Orders?.orderItems?.filter((item) => item.returnAllowed) || [];

      const returnableIds = returnableItems.map((item) => item.itemId);
      setSelectedProducts(returnableIds);

      const newQtyMap = returnableItems.reduce((acc, item) => {
        acc[item.itemId] = item.qty;
        return acc;
      }, {} as { [key: number]: number });

      setSelectedQtyMap(newQtyMap);
    } else {
      setSelectedProducts([]);
      setSelectedQtyMap({});
    }
  };

  const handleItemCheckboxChange = (itemId: number) => {
    setSelectedProducts((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleQtyChange = (itemId: number) => (event: SelectChangeEvent) => {
    setSelectedQtyMap((prev) => ({
      ...prev,
      [itemId]: Number(event.target.value),
    }));
  };

  const getQtyMenuItems = (qty: number) =>
    Array.from({ length: qty }, (_, i) => (
      <MenuItem key={i + 1} value={i + 1}>
        {i + 1}
      </MenuItem>
    ));

  const returnTerm =
    Orders &&
    days &&
    new Date(Orders.placedOn + "Z").getTime() +
      parseInt(days) * 24 * 60 * 60 * 1000;

  return (
    <>
      {!isMobile && (
        <Box
          sx={{
            padding: 1,
            backgroundColor: (theme) => theme.palette.info.main,
          }}
        >
          <div className="container">
            <Breadcrumbs
              aria-label="breadcrumb"
              separator={
                <NavigateNextOutlinedIcon
                  fontSize="small"
                  sx={{ color: "#77878F" }}
                />
              }
            >
              <Link
                underline="hover"
                color="inherit"
                onClick={() => navigate("/overview/orders")}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    textDecoration: "underline",
                  },

                  fontWeight: 500,
                }}
              >
                Orders
              </Link>
              <Link
                underline="hover"
                color="inherit"
                sx={{
                  cursor: "default",
                  "&:hover": {
                    textDecoration: "none",
                  },

                  color: (theme) => theme.palette.success.light,
                  fontWeight: 500,
                }}
              >
                Return Order
              </Link>
            </Breadcrumbs>
          </div>
        </Box>
      )}

      {isSuccess ? (
        <ReturnRequestSuccess />
      ) : (
        <>
          <Container maxWidth="md" sx={{ marginBottom: 10 }}>
            <Box>
              <Typography variant="h6" mb={2}>
                Return my orders
              </Typography>

              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel
                      sx={{
                        pointerEvents: "none",
                        color: index <= activeStep ? "#00c853" : "#c8e6c9",
                        "& .MuiStepIcon-root": {
                          color: index <= activeStep ? "#00c853" : "#c8e6c9",
                        },
                      }}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>

              {activeStep === 0 && (
                <Box mt={4}>
                  <Typography variant="subtitle1" gutterBottom>
                    Select product(s) you want to return:
                  </Typography>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography
                        variant="body2"
                        sx={{
                          backgroundColor: (theme) => theme.palette.info.main,
                          px: 2,
                          py: 0.5,
                          borderRadius: "20px",
                          fontWeight: 500,
                        }}
                      >
                        Order - #{Orders?.orderNum}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Return available till{" "}
                        {Orders?.placedOn && returnTerm
                          ? new Date(returnTerm).toLocaleString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              timeZone: "Asia/Kolkata",
                            })
                          : "-"}
                      </Typography>
                    </Box>
                  </Box>

                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ backgroundColor: "#f4ede7" }}>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isAllSelected}
                              indeterminate={isSomeSelected}
                              onChange={(e) =>
                                handleAllCheckboxChange(e.target.checked)
                              }
                            />
                          </TableCell>
                          <TableCell>Product</TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            Total Quantity
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Orders?.orderItems?.map((item) => (
                          <TableRow key={item.itemId}>
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={selectedProducts.includes(item.itemId)}
                                onChange={() =>
                                  handleItemCheckboxChange(item.itemId)
                                }
                                disabled={!item.returnAllowed}
                              />
                            </TableCell>
                            <TableCell>
                              <Grid container alignItems="center" spacing={2}>
                                <Grid item>
                                  <Avatar
                                    src={item.productCard.itemImage}
                                    variant="square"
                                    sx={{
                                      width: 48,
                                      height: 48,
                                      opacity: item.returnAllowed ? 1 : 0.5,
                                      filter: item.returnAllowed
                                        ? "none"
                                        : "grayscale(100%)",
                                    }}
                                  />
                                </Grid>
                                <Grid item>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: item.returnAllowed
                                        ? "inherit"
                                        : "text.disabled",
                                    }}
                                  >
                                    {item.productCard.itemTitle}
                                  </Typography>
                                  {!item.returnAllowed && (
                                    <Typography
                                      variant="caption"
                                      color="error"
                                      component="ul"
                                      sx={{
                                        display: "block",
                                        paddingLeft: "0.5rem",
                                        mt: 0.5,
                                        wordWrap: "break-word",
                                        fontSize: {
                                          xs: "0.7rem",
                                          sm: "0.75rem",
                                        },
                                      }}
                                    >
                                      <li>
                                        Return not allowed for this product.
                                      </li>

                                      {/* Return not allowed */}
                                    </Typography>
                                  )}
                                </Grid>
                              </Grid>
                            </TableCell>
                            <TableCell sx={{ textAlign: "center" }}>
                              {item.qty > 1 ? (
                                <Select
                                  value={String(
                                    selectedQtyMap[item.itemId] || item.qty
                                  )}
                                  onChange={handleQtyChange(item.itemId)}
                                  size="small"
                                  sx={{ minWidth: 60 }}
                                  disabled={!item.returnAllowed}
                                >
                                  {getQtyMenuItems(item.qty)}
                                </Select>
                              ) : (
                                item.qty
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {/* Step 1: Reason */}
              {activeStep === 1 && (
                <Box mt={2}>
                  <ReturnReasonForm
                    selectedItems={selectedProductsData}
                    returnReason={returnReason}
                    returnReasonId={returnReasonId}
                    onReasonChange={(id, reason) => {
                      setReturnReasonId(id);
                      setReturnReason(reason);
                    }}
                  />
                </Box>
              )}

              {/* Step 2: Review */}
              {activeStep === 2 && (
                <Box mt={4}>
                  <ReturnSummary
                    selectedItems={selectedProductsData}
                    returnReason={returnReason}
                  />
                </Box>
              )}

              <Box
                display="flex"
                flexDirection="row"
                justifyContent={{ xs: "space-between", sm: "flex-end" }}
                alignItems="center"
                gap={2}
                mt={4}
                width="100%"
              >
                <Button
                  variant="outlined"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{
                    textTransform: "none",
                    width: { xs: "48%", sm: "160px", md: "180px" },
                    fontSize: { xs: "14px", sm: "16px" },
                  }}
                >
                  Previous
                </Button>
                <Button
                  disabled={selectedProducts.length === 0}
                  color="secondary"
                  variant="contained"
                  onClick={handleNext}
                  sx={{
                    backgroundColor: (theme) => theme.palette.secondary.light,
                    textTransform: "none",
                    width: { xs: "48%", sm: "160px", md: "180px" },
                    fontSize: { xs: "14px", sm: "16px" },
                  }}
                >
                  {activeStep === steps.length - 1 ? "Submit" : "Next"}
                </Button>
              </Box>
            </Box>
          </Container>

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => {
              setSnackbarOpen(false);
              setSnackbar({ open: false, message: "" });
            }}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={() => setSnackbar({ open: false, message: "" })}
              severity="warning"
              sx={{ width: "100%" }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </>
      )}
    </>
  );
};

export default ReturnOrdersForm;
