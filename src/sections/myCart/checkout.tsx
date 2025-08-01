// import React, { useCallback, useEffect, useRef, useState } from "react";
// import {
//   Typography,
//   Card,
//   CardContent,
//   Grid,
//   Button,
//   Radio,
//   FormControlLabel,
//   Divider,
//   Box,
//   Paper,
//   Snackbar,
//   IconButton,
//   CircularProgress,
// } from "@mui/material";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "../../Redux/store/store";
// import { Cart } from "../addToBag/model/cart";
// import CloseIcon from "@mui/icons-material/Close";
// import {
//   getAddressByOrderNumService,
//   getAddressService,
// } from "./service/checkAddress";
// import {
//   getLocalText,
//   PageState,
//   setLocalText,
// } from "../../web-constants/constants";
// import { PaymentMethod, paymentMethodMapping } from "./model/paymentMethod";
// import CreditCardIcon from "@mui/icons-material/CreditCard";
// import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
// import PaymentsIcon from "@mui/icons-material/Payments"; // For PayPal alternative
// import SmartphoneIcon from "@mui/icons-material/Smartphone";
// import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
// import { usePostByBody } from "../../customHooks/usePostByBody";
// import { postOrder } from "./service/myCartService";
// import { CreateOrder } from "./model/createOrder";
// import { Customer } from "../register/model/customer";
// import { useFetchByQuery } from "../../customHooks/useFetchByQuery";
// import {
//   CustomerDetailsUri,
//   getMyAddressData,
// } from "../Dashboard/profileService/profileService";
// import { AddressType } from "../Dashboard/enum/addressType";
// import { CustomerAddress } from "../Dashboard/model/customerAddress";
// import { addSticky, removeSticky } from "../../Redux/slices/headerStickyToggle";
// import { paymentServiceTest2 } from "./service/paymentService";
// import CouponDrawer from "../couponDrawer/couponDrawer";
// import couponIcon from "../../assets/media/icons/coupon_Icon.svg";
// import { getOrderDetailsByOrderIdService } from "./service/getOrderDetailsWithOrderNum";
// import { OrderMaster } from "./model/orderMaster";
// import { CheckoutDetails } from "./model/checkOut";
// import Tooltip from "@mui/material/Tooltip";
// import {
//   CheckoutAddress,
//   mapFromCustomerAddresses,
//   mapFromOrderAddress,
// } from "./model/checkoutAddress";
// import { AddressMaster } from "../Dashboard/model/addressMaster";
// import CheckoutAddressDrawer from "./checkoutAddressDrawer";
// import SelectAddressDrawer from "./selectAddressDrawer";
// import { PriceBreakupDetails } from "./model/additionalDiscount";
// import MuiAlert from "@mui/material/Alert";
// import ClearIcon from "@mui/icons-material/Clear";
// import CheckIcon from "@mui/icons-material/CheckCircleOutline";
// import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
// import { motion } from "framer-motion";
// import PaymentTimer from "../../utils/paymentTimes";
// import { selectCurrencySymbol } from "../../Redux/slices/currencySlice";

// const paymentMethods = [
//   {
//     method: PaymentMethod.CREDITCARD,
//     label: "Credit Card",
//     icon: <CreditCardIcon className="w-6 h-6" />,
//     description: "Pay securely with your credit card",
//   },
//   {
//     method: PaymentMethod.DEBITCARD,
//     label: "Debit Card",
//     icon: <AccountBalanceWalletIcon className="w-6 h-6" />,
//     description: "Use your debit card for instant payment",
//   },
//   {
//     method: PaymentMethod.NET_BANKING,
//     label: "Net Banking",
//     icon: <AccountBalanceIcon className="w-6 h-6" />,
//     description: "Pay instantly using your internet banking account",
//   },
//   // {
//   //   method: PaymentMethod.PAYPAL,
//   //   label: "PayPal",
//   //   icon: <PaymentsIcon className="w-6 h-6" />,
//   //   description: "Safe payment with PayPal",
//   // },
//   {
//     method: PaymentMethod.UPI,
//     label: "UPI",
//     icon: <SmartphoneIcon className="w-6 h-6" />,
//     description: "Pay using UPI apps",
//   },
//   // {
//   //   method: PaymentMethod.CASHON_DELIVERY,
//   //   label: "Cash on Delivery",
//   //   icon: <AttachMoneyIcon className="w-6 h-6" />,
//   //   description: "Pay when you receive",
//   // },
// ];

// declare global {
//   interface Window {
//     Razorpay: any;
//   }
// }

// const Checkout = () => {
//   const navigate = useNavigate();
//   // const [billingAddres, setBillingAddres] = useState<any[] | null>(null);
//   const [addressAll, setAddressAll] = useState<CustomerAddress[] | null>(null);
//   const [toggleShipping, setToggleShipping] = useState<boolean>(false);
//   const [toggleBilling, setToggleBilling] = useState<boolean>(false);
//   const [createOrderResponse, setCreateOrderResponse] = useState<any | any[]>(
//     []
//   );
//   const [showProgress, setShowProgress] = useState(true);
//   const [drawerVisible, setDrawerVisible] = useState(false);
//   const [pageStage, setPageStage] = useState(PageState.IDLE);
//   const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(
//     null
//   );
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [isDrawerOpenAllAddress, setIsDrawerOpenAllAddress] = useState(false);

//   const [couponResponse, setCouponResponse] = useState<any>("");
//   const cartData: Cart = useSelector((store: RootState) => store.cart.cart);
//   const username = useSelector((store: RootState) => store.jwtToken.username);
//   const [reservedOrderNum, setReservedOrderNum] = useState<string | null>(null);
//   const [orderPlacedOn, setOrderPlacedOn] = useState<string | null>(null);
//   const [retryPaymentTime, setRetryPaymentTime] = useState<string | null>(null);
//   const { data: orderResponse, executePost } = usePostByBody();
//   const { data: customer } = useFetchByQuery<Customer>(CustomerDetailsUri, {
//     username,
//   });
//   const [isDefaultAddressPresent, setDefaultAddressPresent] = useState<
//     boolean | null
//   >(null);

//   const addAddressRef = useRef<HTMLDivElement>(null);
//   const [addressTooltip, setAddressTooltip] = useState<boolean>(false);
//   const [billinAddressTooltip, setBillinAddressTooltip] =
//     useState<boolean>(false);
//   const [shippingAddressTooltip, setshippingAddressTooltip] =
//     useState<boolean>(false);

//   console.log("addressAll", addressAll);

//   // newmethods

//   const [chekoutDetails, setChekoutDetails] = useState<CheckoutDetails | null>(
//     null
//   );
//   const symbol = useSelector(selectCurrencySymbol);

//   const { ENABLE_RETRY_PAYMENT_MINUTES: minutes } = useSelector(
//     (store: RootState) => store.retryPaymentTerm
//   );

//   const location = useLocation();
//   const isRetryPayment = location.state?.retryPayment || null;

//   console.log("previouslocation", isRetryPayment);

//   const [priceBreakupDetails, setPriceBreakupDetails] =
//     useState<PriceBreakupDetails>({
//       taxAmount: 0,
//       couponTxnId: null,
//       couponDiscAmount: 0,
//       shippingCharge: 0,
//     });

//   // console.log("priceBreakupDetails", priceBreakupDetails);

//   // console.log("chekoutDetails", chekoutDetails);
//   // console.log("couponResponse", couponResponse);

//   const [checkoutAddress, setCheckoutAddress] =
//     useState<CheckoutAddress | null>(null);

//   const toCheckoutFromCart = (cart: Cart): CheckoutDetails => {
//     return {
//       cartId: cart.id,
//       username: cart.username,
//       totalMrp: cart.totalMrp,
//       totalPrice: cart.totalPrice,
//       discAmount: cart.discAmount,
//       totalItems: cart.totalItems,
//       totalQty: cart.totalQty,
//       checkoutItems: cart.cartItems.map((item) => ({
//         productId: item.productId,
//         itemId: item.itemId,
//         qty: item.qty,
//         unitPrice: item.unitPrice,
//         totalMrp: item.totalMrp,
//         discAmount: item.discAmount,
//         totalPrice: item.totalPrice,
//         productCard: item.productCard,
//         returnAllowed: item.productCard?.returnAllowed,
//       })),
//     };
//   };

//   console.log("checkoutAddress", checkoutAddress);

//   const toCheckoutFromOrder = (order: OrderMaster): CheckoutDetails => {
//     setPriceBreakupDetails((prev) => ({
//       ...prev,
//       taxAmount: order.taxAmount,
//       couponDiscAmount: order.couponDiscAmount,
//       shippingCharge: order.shippingCharge,
//     }));
//     return {
//       username: order.username,
//       totalMrp: order.totalMrp,
//       totalPrice: order.totalPrice,
//       discAmount: order.discAmount,
//       totalItems: order.totalItems,
//       totalQty: order.totalQty,

//       checkoutItems: order.orderItems.map((item) => ({
//         productId: item.productId,
//         itemId: item.itemId,
//         qty: item.qty,
//         unitPrice: item.unitPrice,
//         discAmount: item.discAmount,
//         totalPrice: item.totalPrice,
//         totalMrp: item.totalMrp,
//         productCard: item.productCard,
//         returnAllow: item.returnAllowed,
//       })),
//     };
//   };

//   // console.log("chekoutDetails", chekoutDetails);

//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success" as "error" | "info" | "success" | "warning",
//   });

//   const itemsTotal = chekoutDetails?.totalPrice || 0;
//   const couponDisc = priceBreakupDetails?.couponDiscAmount || 0;
//   const shippingCharge = priceBreakupDetails?.shippingCharge || 0;

//   // console.log("itemsTotal", itemsTotal);
//   // console.log("couponDisc", couponDisc);
//   // console.log("shippingCharge", shippingCharge);

//   const totalAmount = parseFloat(
//     (itemsTotal + shippingCharge - couponDisc).toFixed(2)
//   );

//   // console.log("totalAmount", totalAmount);

//   //end

//   const dispatch = useDispatch<AppDispatch>();

//   const getOrderDetilsByOrderId = async (orderNum: string) => {
//     try {
//       const response = await getOrderDetailsByOrderIdService(orderNum);
//       if (!response.errorPresent) {
//         console.log("##$#$# => gettin dataWith the OrderNum", response.content);
//         setChekoutDetails(toCheckoutFromOrder(response.content));
//         setOrderPlacedOn(response.content.placedOn);
//         setRetryPaymentTime(response.content.retryPaymentTime);
//         setPageStage(PageState.SUCCESS);
//         setSelectedPayment(response.content.paymentMethod);
//         setCouponResponse(() => ({
//           discountAmt: response.content.couponDiscAmount,
//         }));
//       } else {
//         setPageStage(PageState.LOADING);
//       }
//     } catch (err) {
//       setPageStage(PageState.LOADING);
//     }
//   };

//   useEffect(() => {
//     if (isRetryPayment || cartData?.cartItems === undefined) {
//       setPageStage(PageState.LOADING);
//       const orderNum = getLocalText("orderNum");
//       if (orderNum) {
//         setReservedOrderNum(orderNum);
//         getOrderDetilsByOrderId(orderNum);
//       }
//       //  else {
//       //   navigate("/cart/bag/");
//       // }
//     } else {
//       setChekoutDetails(toCheckoutFromCart(cartData));
//     }
//   }, [cartData, navigate]);

//   const handleClose = () => {
//     setDrawerVisible(false);
//     dispatch(addSticky());
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbar({ ...snackbar, open: false });
//   };

//   const showDrawer = () => {
//     setDrawerVisible(true);
//     dispatch(removeSticky());
//   };

//   useEffect(() => {
//     if (orderResponse) {
//       setCreateOrderResponse(orderResponse);
//     }
//     if (createOrderResponse.orderNum && customer !== null) {
//       setLocalText("orderNum", createOrderResponse.orderNum);
//       handlePayment2(
//         createOrderResponse,
//         customer,
//         totalAmount,
//         priceBreakupDetails
//       );
//       // navigate("/cart/bag/ordersummary");
//     }
//   }, [orderResponse, createOrderResponse, navigate]);

//   var script: any = null;
//   const loadRazorpayScript = (): Promise<boolean> => {
//     return new Promise((resolve) => {
//       script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };

//   if (selectedPayment !== null) {
//     console.log("selectedPayment", paymentMethodMapping[selectedPayment]);
//   }

//   const handlePayment2 = useCallback(
//     async (
//       createOrderResponse: any,
//       customer: Customer,
//       totalAmount: number,
//       priceBreakupDetails: any
//     ) => {
//       dispatch(removeSticky());
//       const isScriptLoaded = await loadRazorpayScript();
//       if (!isScriptLoaded) {
//         alert("Razorpay SDK failed to load. Are you online?");
//         return;
//       }

//       if (!createOrderResponse) {
//         console.error("Order response is null, cannot proceed with payment.");
//         return;
//       }

//       console.log("totalAmount", totalAmount);

//       const options: any = {
//         key: "rzp_test_gh0Mj5BWLPpYgM",
//         // amount: (parseFloat(createOrderResponse.totalPrice) * 1).toString(),
//         amount: totalAmount,
//         currency: "INR",
//         name: `${customer?.firstName} ${customer?.lastName}`,
//         description: "Payment for your product/service",
//         image: "beb-logo.jpg", //
//         order_id: createOrderResponse.cpgOrderId,
//         prefill: {
//           name: customer?.firstName,
//           email: customer?.emailId,
//           contact: customer?.mobileNumber,
//           method:
//             selectedPayment !== null && paymentMethodMapping[selectedPayment],
//         },
//         readonly: {
//           contact: true,
//           email: true,
//           name: true,
//           country_code: true,
//           isd: true,
//           country: true,
//         },
//         user: {
//           id: "cust_P6XT1Pl2kMA919",
//         },
//         save_card: true,
//         remember_customer: true,
//         notes: "",
//         theme: {
//           color: "#F1EAE4",
//           backdrop_color: "#1E2624",
//           hide_topbar: true, //
//         },
//         handler: async (response: any) => {
//           try {
//             const result = await paymentServiceTest2(
//               response.razorpay_order_id,
//               response.razorpay_payment_id,
//               response.razorpay_signature
//             );
//             if (result) {
//               setPageStage(PageState.PAYMENT_SUCCESS);
//               setTimeout(() => {
//                 navigate("/cart/bag/ordersummary", { replace: true });
//                 dispatch(addSticky());
//               }, 2000);
//             }
//           } catch (error) {
//             console.error("Failed to create payment:", error);
//             dispatch(addSticky());
//             setPageStage(PageState.PAYMENT_FAILED);
//           }
//         },
//         modal: {
//           ondismiss: () => {
//             setPageStage(PageState.PAYMENT_FAILED);
//             setTimeout(() => {
//               console.log("Payment modal dismissed");
//               // await dispatch(getCartAsync({ username: username }));
//               document.body.removeChild(script);
//               window.location.reload();
//             }, 1000);
//           },
//           escape: true,
//           backdropclose: true,
//           handleback: true,
//         },
//       };
//       console.log("options", options);
//       const razorpayInstance = new window.Razorpay(options);
//       razorpayInstance.open();
//     },
//     [navigate]
//   );

//   const handlePayment = async () => {
//     if (
//       !checkoutAddress?.billingAddress.id &&
//       !checkoutAddress?.shippingAddress.id
//     ) {
//       window.scrollTo(0, 0);
//       setAddressTooltip(true);
//       return;
//     }
//     if (!checkoutAddress?.billingAddress.id) {
//       window.scrollTo(0, 0);
//       setBillinAddressTooltip(true);
//       return;
//     }
//     if (!checkoutAddress?.shippingAddress.id) {
//       window.scrollTo(0, 0);
//       setshippingAddressTooltip(true);
//       return;
//     }

//     if (chekoutDetails) {
//       console.log(
//         "priceBreakupDetails.couponTxnId",
//         priceBreakupDetails.couponTxnId
//       );

//       const orderData: CreateOrder = {
//         orderNum: reservedOrderNum,
//         checkoutDetails: chekoutDetails,
//         couponTxnId: priceBreakupDetails.couponTxnId || 0,
//         taxAmount: priceBreakupDetails.taxAmount || 0,
//         shippingCharge: priceBreakupDetails.shippingCharge || 0,
//         finalPrice: totalAmount,
//         couponDiscAmount: priceBreakupDetails.couponDiscAmount || 0,
//         paymentMethod: selectedPayment,
//         billingAddressId: checkoutAddress && checkoutAddress.billingAddress.id,
//         shippingAddressId:
//           checkoutAddress && checkoutAddress.shippingAddress.id,
//       };

//       console.log("orderData", orderData);
//       await executePost(postOrder, orderData);
//     } else {
//       alert("Please fill all the required fields");
//     }
//   };

//   const getAddress = async (username: string) => {
//     try {
//       setPageStage(PageState.LOADING);
//       setPageStage(PageState.SUCCESS);
//       let response = null;
//       const orderNum = getLocalText("orderNum");
//       if (cartData && !orderNum) {
//         response = await getAddressService(username);

//         console.log("getAddressByOrderNumService cart", response);

//         // const response = await getaddressData(username);
//         setDefaultAddressPresent(true);

//         setCheckoutAddress(mapFromCustomerAddresses(response.content));
//       } else if (orderNum) {
//         response = await getAddressByOrderNumService(orderNum);
//         console.log("getAddressByOrderNumService", response);
//         setCheckoutAddress(mapFromOrderAddress(response.content));
//         setDefaultAddressPresent(false);
//       }

//       setPageStage(PageState.SUCCESS);
//     } catch (error) {
//       setDefaultAddressPresent(false);
//       // setPageStage(PageState.ERROR);
//       console.log(error);
//     }
//   };

//   const getAllAddress = async (username: string, Address?: string) => {
//     try {
//       const response = await getMyAddressData(username);

//       console.log("getAllAddress", response);
//       if (response) {
//         setAddressAll(response);
//         if (Address && Address === AddressType.BILLING) {
//           setToggleBilling(true);
//         }
//         if (Address && Address === AddressType.SHIPPING) {
//           setToggleShipping(true);
//         }
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // console.log("addressAll", addressAll);

//   useEffect(() => {
//     getAddress(username);
//     getAllAddress(username);
//   }, [username]);

//   // console.log("selectedPayment", selectedPayment);

//   const handlePaymentChange = (method: PaymentMethod) => {
//     setSelectedPayment(method);
//   };

//   // console.log("couponResponse", couponResponse);

//   // console.log("totalAmount", totalAmount);

//   const isRetry = (date: string, minutes: number): boolean => {
//     if (!minutes) return false;

//     const orderedDate = new Date(
//       date.endsWith("Z") ? date : date + "Z"
//     ).getTime();
//     const retryDeadline = orderedDate + minutes * 60_000;

//     return retryDeadline < Date.now();
//   };

//   return (
//     <>
//       {pageStage === PageState.SUCCESS && (
//         <div className="container px-0 px-md-5">
//           <Grid container spacing={3}>
//             <Grid item xs={12} lg={8}>
//               <Box
//                 sx={{
//                   borderRadius: "8px",
//                   borderBottomLeftRadius: 0,
//                   borderBottomRightRadius: 0,
//                   mb: 2,
//                 }}
//               >
//                 <Box
//                   p={2}
//                   sx={{
//                     borderBottomLeftRadius: 0,
//                     borderBottomRightRadius: 0,
//                     backgroundColor: (theme) => theme.palette.info.main,
//                     border: "1px solid #F1EAE4",
//                     borderRadius: "3px",
//                   }}
//                   borderRadius={2}
//                 >
//                   <Typography variant="body1">
//                     Hey{" "}
//                     <b>
//                       {customer?.firstName} {customer?.lastName}
//                     </b>
//                     , You’re almost there..!
//                   </Typography>
//                 </Box>

//                 {orderPlacedOn &&
//                   retryPaymentTime &&
//                   minutes &&
//                   isRetry(orderPlacedOn, parseInt(minutes)) && (
//                     <Box sx={{ color: "error.main", pt: 1 }}>
//                       {orderPlacedOn && (
//                         <PaymentTimer
//                           placedOn={orderPlacedOn}
//                           retryPaymentTime={retryPaymentTime}
//                         />
//                       )}
//                     </Box>
//                   )}

//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     py: 2,
//                   }}
//                 >
//                   <Typography variant="h6" gutterBottom>
//                     Checkout
//                   </Typography>
//                   <Tooltip
//                     open={addressTooltip}
//                     componentsProps={{
//                       // style the tooltip itself
//                       tooltip: {
//                         sx: {
//                           bgcolor: "#000",
//                           color: "#fff",
//                           fontSize: "14px",
//                           p: 2,
//                         },
//                       },
//                       arrow: {
//                         sx: {
//                           color: "#000",
//                         },
//                       },
//                     }}
//                     title="Add a delivery address"
//                     arrow
//                   >
//                     <Button
//                       component="div"
//                       ref={addAddressRef}
//                       disabled={reservedOrderNum ? true : false}
//                       variant="outlined"
//                       onClick={() => {
//                         setIsDrawerOpen(true);
//                         setAddressTooltip(false);
//                         dispatch(removeSticky());
//                       }}
//                       sx={{
//                         fontSize: "12px",
//                         textTransform: "none",
//                         "&:hover": {
//                           backgroundColor: "#1E2624",
//                           color: "#fff",
//                           size: "medium",
//                         },
//                       }}
//                     >
//                       Add New Address
//                     </Button>
//                   </Tooltip>
//                 </Box>

//                 <Card variant="outlined" className="w-100" sx={{ mb: 2 }}>
//                   <CardContent>
//                     <FormControlLabel
//                       sx={{
//                         width: "100%",
//                         margin: 0,
//                         "& .MuiFormControlLabel-label": {
//                           width: "100%",
//                         },
//                       }}
//                       control={<Radio checked />}
//                       label={
//                         <Tooltip
//                           open={shippingAddressTooltip}
//                           componentsProps={{
//                             // style the tooltip itself
//                             tooltip: {
//                               sx: {
//                                 bgcolor: "#000",
//                                 color: "#fff",
//                                 fontSize: "14px",
//                                 p: 2,
//                               },
//                             },
//                             arrow: {
//                               sx: {
//                                 color: "#000",
//                               },
//                             },
//                           }}
//                           title="Add a shipping address"
//                           arrow
//                         >
//                           <div className="w-100 d-flex flex-row justify-content-between align-items-center">
//                             <div>
//                               <Typography variant="subtitle1" fontWeight="bold">
//                                 SHIPPING ADDRESS
//                               </Typography>
//                             </div>
//                             <div>
//                               {Object.keys(
//                                 checkoutAddress?.shippingAddress || {}
//                               ).length <= 0 &&
//                                 addressAll &&
//                                 addressAll.length > 0 && (
//                                   <Button
//                                     disabled={reservedOrderNum ? true : false}
//                                     onClick={() => {
//                                       getAllAddress(
//                                         username,
//                                         AddressType.SHIPPING
//                                       );
//                                       setIsDrawerOpenAllAddress(true);
//                                       dispatch(removeSticky());
//                                     }}
//                                     variant="outlined"
//                                     size="medium"
//                                     sx={{
//                                       mt: { xs: 1, md: 0 },
//                                       px: { xs: 2, md: 4 },
//                                       "&:hover": {
//                                         backgroundColor: "#1E2624",
//                                         color: "#fff",
//                                       },
//                                       textTransform: "none",
//                                     }}
//                                   >
//                                     Change
//                                   </Button>
//                                 )}
//                             </div>
//                           </div>
//                         </Tooltip>
//                       }
//                     />

//                     <Box className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
//                       {Object.keys(checkoutAddress?.shippingAddress || {})
//                         .length > 0 && (
//                         <>
//                           <Typography variant="subtitle1">
//                             {/* {`${checkoutAddress?.shippingAddress.addressLine1} ${checkoutAddress?.shippingAddress.addressLine2} ${checkoutAddress?.shippingAddress.city} ${checkoutAddress?.shippingAddress.state} ${checkoutAddress?.shippingAddress.country} -${checkoutAddress?.shippingAddress.postalCode}  Ph: ${checkoutAddress?.shippingAddress.phoneNumber}`} */}
//                             {`${
//                               checkoutAddress?.shippingAddress.addressLine1 ||
//                               ""
//                             } ${
//                               checkoutAddress?.shippingAddress.addressLine2 ||
//                               ""
//                             } ${checkoutAddress?.shippingAddress.city || ""} ${
//                               checkoutAddress?.shippingAddress.state || ""
//                             } ${
//                               checkoutAddress?.shippingAddress.country || ""
//                             } -${
//                               checkoutAddress?.shippingAddress.postalCode || ""
//                             } ${
//                               checkoutAddress?.shippingAddress.phoneNumber
//                                 ? `Ph: ${checkoutAddress.shippingAddress.phoneNumber}`
//                                 : ""
//                             }`}
//                           </Typography>
//                           <Button
//                             disabled={reservedOrderNum ? true : false}
//                             onClick={() => {
//                               getAllAddress(username, AddressType.SHIPPING);

//                               setIsDrawerOpenAllAddress(true);
//                               dispatch(removeSticky());
//                             }}
//                             variant="outlined"
//                             size="medium"
//                             sx={{
//                               mt: { xs: 1, md: 0 },
//                               px: { xs: 2, md: 4 },
//                               "&:hover": {
//                                 backgroundColor: "#1E2624",
//                                 color: "#fff",
//                               },
//                               textTransform: "none",
//                             }}
//                           >
//                             Change
//                           </Button>
//                         </>
//                       )}
//                     </Box>
//                   </CardContent>
//                 </Card>

//                 {/* {(() => {
//                   const sa = checkoutAddress?.shippingAddress;
//                   if (
//                     !sa ||
//                     ![
//                       sa.addressLine1,
//                       sa.city,
//                       sa.state,
//                       sa.country,
//                       sa.postalCode,
//                       sa.phoneNumber,
//                     ].every(Boolean)
//                   ) {
//                     return null;
//                   }
//                   const address = [
//                     sa.addressLine1,
//                     sa.addressLine2,
//                     sa.city,
//                     sa.state,
//                     sa.country,
//                   ]
//                     .filter(Boolean)
//                     .join(", ");

//                   return (
//                     <Card variant="outlined" sx={{ mb: 2 }}>
//                       <CardContent>
//                         <FormControlLabel
//                           control={<Radio checked />}
//                           label={
//                             <Typography variant="subtitle1" fontWeight="bold">
//                               SHIPPING ADDRESS
//                             </Typography>
//                           }
//                         />

//                         <Box className="d-flex flex-row justify-content-between align-items-center">
//                           <Typography variant="subtitle1">
//                             {`${address} -${sa.postalCode}  Ph: ${sa.phoneNumber}`}
//                           </Typography>
//                           <Button
//                             variant="outlined"
//                             size="medium"
//                             onClick={() => {
//                               getAllAddress(username, AddressType.SHIPPING);
//                               setIsDrawerOpenAllAddress(true);
//                               dispatch(removeSticky());
//                             }}
//                           >
//                             CHANGE
//                           </Button>
//                         </Box>
//                       </CardContent>
//                     </Card>
//                   );
//                 })()} */}

//                 <SelectAddressDrawer
//                   open={isDrawerOpenAllAddress}
//                   onClose={() => {
//                     setIsDrawerOpenAllAddress(false);
//                     setToggleShipping(false);
//                     dispatch(addSticky());
//                     setToggleBilling(false);
//                   }}
//                   addressAll={addressAll}
//                   setCheckoutAddress={setCheckoutAddress}
//                   toggleShipping={toggleShipping}
//                   toggleBilling={toggleBilling}
//                   setToggleShipping={setToggleShipping}
//                   setToggleBilling={setToggleBilling}
//                 />

//                 {/* {billingAddres?.length === 0 && (
//                     <Button
//                       onClick={() =>
//                         getAllAddress(username, AddressType.BILLING)
//                       }
//                       variant="outlined"
//                       size="small"
//                     >
//                       Select Billing Address
//                     </Button>
//                   )} */}

//                 <Card variant="outlined" sx={{ mb: 2 }}>
//                   <CardContent>
//                     <FormControlLabel
//                       sx={{
//                         width: "100%",
//                         margin: 0,
//                         "& .MuiFormControlLabel-label": {
//                           width: "100%",
//                         },
//                       }}
//                       control={<Radio checked />}
//                       label={
//                         <Tooltip
//                           open={billinAddressTooltip}
//                           componentsProps={{
//                             // style the tooltip itself
//                             tooltip: {
//                               sx: {
//                                 bgcolor: "#000",
//                                 color: "#fff",
//                                 fontSize: "14px",
//                                 p: 2,
//                               },
//                             },
//                             arrow: {
//                               sx: {
//                                 color: "#000",
//                               },
//                             },
//                           }}
//                           title="Add a billing address"
//                           arrow
//                         >
//                           <div className="w-100 d-flex flex-row justify-content-between align-items-center">
//                             <Typography variant="subtitle1" fontWeight="bold">
//                               BILLING ADDRESS
//                             </Typography>

//                             {Object.keys(checkoutAddress?.billingAddress || {})
//                               .length <= 0 &&
//                               addressAll &&
//                               addressAll.length > 0 && (
//                                 <Button
//                                   disabled={reservedOrderNum ? true : false}
//                                   onClick={() => {
//                                     getAllAddress(
//                                       username,
//                                       AddressType.BILLING
//                                     );
//                                     setIsDrawerOpenAllAddress(true);
//                                     dispatch(removeSticky());
//                                   }}
//                                   sx={{
//                                     mt: { xs: 1, md: 0 },
//                                     px: { xs: 2, md: 4 },
//                                     "&:hover": {
//                                       backgroundColor: "#1E2624",
//                                       color: "#fff",
//                                     },
//                                     textTransform: "none",
//                                   }}
//                                   variant="outlined"
//                                   size="medium"
//                                 >
//                                   Change
//                                 </Button>
//                               )}
//                           </div>
//                         </Tooltip>
//                       }
//                     />

//                     <Box className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
//                       {Object.keys(checkoutAddress?.billingAddress || {})
//                         .length > 0 && (
//                         <>
//                           <Typography variant="subtitle1">
//                             {/* {`${checkoutAddress?.billingAddress.addressLine1} ${checkoutAddress?.billingAddress.addressLine2} ${checkoutAddress?.billingAddress.city} ${checkoutAddress?.billingAddress.state} ${checkoutAddress?.billingAddress.country} -${checkoutAddress?.billingAddress.postalCode}  Ph: ${checkoutAddress?.billingAddress.phoneNumber}`} */}

//                             {`${
//                               checkoutAddress?.billingAddress.addressLine1 || ""
//                             } ${
//                               checkoutAddress?.billingAddress.addressLine2 || ""
//                             } ${checkoutAddress?.billingAddress.city || ""} ${
//                               checkoutAddress?.billingAddress.state || ""
//                             } ${
//                               checkoutAddress?.billingAddress.country || ""
//                             } -${
//                               checkoutAddress?.billingAddress.postalCode || ""
//                             } ${
//                               checkoutAddress?.billingAddress.phoneNumber
//                                 ? `Ph: ${checkoutAddress.billingAddress.phoneNumber}`
//                                 : ""
//                             }`}
//                           </Typography>
//                           <Button
//                             disabled={reservedOrderNum ? true : false}
//                             onClick={() => {
//                               getAllAddress(username, AddressType.BILLING);
//                               setIsDrawerOpenAllAddress(true);
//                               dispatch(removeSticky());
//                             }}
//                             sx={{
//                               mt: { xs: 1, md: 0 },
//                               px: { xs: 2, md: 4 },
//                               "&:hover": {
//                                 backgroundColor: "#1E2624",
//                                 color: "#fff",
//                               },
//                               textTransform: "none",
//                             }}
//                             variant="outlined"
//                             size="medium"
//                           >
//                             Change
//                           </Button>
//                         </>
//                       )}
//                     </Box>
//                   </CardContent>
//                 </Card>

//                 {/* {(() => {
//                   const ba = checkoutAddress?.billingAddress;
//                   if (
//                     !ba ||
//                     ![
//                       ba.addressLine1,
//                       ba.city,
//                       ba.state,
//                       ba.country,
//                       ba.postalCode,
//                       ba.phoneNumber,
//                     ].every(Boolean)
//                   ) {
//                     return null;
//                   }
//                   const address = [
//                     ba.addressLine1,
//                     ba.addressLine2,
//                     ba.city,
//                     ba.state,
//                     ba.country,
//                   ]
//                     .filter(Boolean)
//                     .join(", ");

//                   return (
//                     <Card variant="outlined" sx={{ mb: 2 }}>
//                       <CardContent>
//                         <FormControlLabel
//                           control={<Radio checked />}
//                           label={
//                             <Typography variant="subtitle1" fontWeight="bold">
//                               BILLING ADDRESS
//                             </Typography>
//                           }
//                         />

//                         <Box className="d-flex flex-row justify-content-between align-items-center">
//                           <Typography variant="subtitle1">
//                             {`${address} -${ba.postalCode}  Ph: ${ba.phoneNumber}`}
//                           </Typography>
//                           <Button
//                             variant="outlined"
//                             size="medium"
//                             onClick={() => {
//                               getAllAddress(username, AddressType.BILLING);
//                               setIsDrawerOpenAllAddress(true);
//                               dispatch(removeSticky());
//                             }}
//                           >
//                             CHANGE
//                           </Button>
//                         </Box>
//                       </CardContent>
//                     </Card>
//                   );
//                 })()} */}
//               </Box>

//               <Card variant="outlined" sx={{ mb: 2 }}>
//                 <CardContent>
//                   <Typography variant="subtitle1" fontWeight="bold">
//                     SHIPPING METHOD
//                   </Typography>
//                   <Typography variant="body2">Standard shipping</Typography>
//                   <Typography variant="caption">
//                     Estimated delivery (7 - 10 days) Tuesday 7th September
//                   </Typography>
//                 </CardContent>
//               </Card>
//               <Box>
//                 <Typography sx={{ my: 1.4 }} variant="h6" fontWeight="bold">
//                   Payment
//                 </Typography>
//                 <Box
//                   display="flex"
//                   alignItems="start"
//                   justifyContent="space-between"
//                   p={2}
//                   borderRadius={2}
//                   boxShadow={0}
//                   sx={{ backgroundColor: "#F8FAFC" }}
//                 >
//                   <Box display="flex" alignItems="start" gap={2}>
//                     <img
//                       src={couponIcon || "/placeholder.svg"}
//                       alt="couponIcon"
//                       style={{ fontSize: "1.2rem", color: "black" }}
//                     />
//                     <Box>
//                       <Typography
//                         variant="subtitle1"
//                         fontWeight="800"
//                         color="black"
//                       >
//                         HAVE A COUPON?
//                       </Typography>
//                       {/* <Typography
//                         sx={{ fontSize: "14px" }}
//                         variant="body2"
//                         color="gray"
//                       >
//                         Get 25% off applying
//                       </Typography>
//                       <Typography
//                         sx={{ fontSize: "14px" }}
//                         variant="body2"
//                         color="gray"
//                       >
//                         GEARLAUNCH25
//                       </Typography> */}
//                     </Box>
//                   </Box>
//                   <CouponDrawer
//                     setCouponResponse={setCouponResponse}
//                     setPriceBreakupDetails={setPriceBreakupDetails}
//                     priceBreakupDetails={priceBreakupDetails}
//                     couponResponse={couponResponse}
//                     open={drawerVisible}
//                     onClose={handleClose}
//                     coupon={couponResponse?.couponCode}
//                     orderValue={chekoutDetails?.totalPrice}
//                     orderItems={chekoutDetails?.totalItems}
//                     orderQty={chekoutDetails?.totalQty}
//                   />
//                   <IconButton
//                     onClick={showDrawer}
//                     disabled={reservedOrderNum ? true : false}
//                     sx={{
//                       color: "#775200",
//                       fontSize: "1.5rem",
//                       "&.Mui-disabled": {
//                         color: "rgba(0, 0, 0, 0.26)", // MUI default disabled color (optional)
//                       },
//                     }}
//                   >
//                     <ArrowForwardIosIcon fontSize="inherit" />
//                   </IconButton>
//                 </Box>
//                 {couponResponse && couponResponse.discountAmt !== 0 && (
//                   <Box
//                     mt={3}
//                     p={2}
//                     bgcolor="#f5f5f5"
//                     borderRadius={2}
//                     className="d-flex flex-row justify-content-between align-items-center"
//                   >
//                     <Typography variant="body1" color="#12B76A">
//                       {/* 🎉 */}
//                       {/* {couponResponse.discountAmt &&
//                         `${
//                           couponResponse?.message
//                             ? couponResponse?.message
//                             : "Discount applied successfully"
//                         } `} */}
//                       {couponResponse.discountAmt !== 0 &&
//                         `✅ Coupon applied! ${symbol}${"\u200A"}${
//                           couponResponse.discountAmt
//                         } discount has been added to your order `}
//                     </Typography>

//                     <IconButton
//                       className="btn"
//                       disabled={reservedOrderNum ? true : false}
//                       onClick={() => {
//                         setPriceBreakupDetails({
//                           taxAmount: 0,
//                           couponTxnId: null,
//                           couponDiscAmount: 0,
//                           shippingCharge: 0,
//                         });
//                         setCouponResponse(null);
//                       }}
//                     >
//                       <ClearIcon />
//                     </IconButton>

//                     {/* <Typography variant="body1" color="#12B76A"> */}
//                     {/* ✅{" "} */}
//                     {/* {`Coupon "${couponResponse?.couponCode}" is valid. You received a  INR${couponResponse.discountAmt} discount.`} */}
//                     {/* {`You received a  INR${couponResponse.discountAmt} discount.`} */}
//                     {/* </Typography> */}
//                   </Box>
//                 )}
//               </Box>

//               <Box>
//                 <Card
//                   variant="outlined"
//                   sx={{
//                     mx: "auto",
//                     borderRadius: 2,
//                     boxShadow: 2,
//                     mt: 3,
//                   }}
//                 >
//                   <CardContent>
//                     <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
//                       Select Payment Method
//                     </Typography>

//                     <Box
//                       sx={{
//                         display: "flex",
//                         flexDirection: "column",
//                         gap: 2,
//                       }}
//                     >
//                       {paymentMethods.map((payment) => (
//                         <FormControlLabel
//                           key={payment.method}
//                           className="w-100"
//                           control={
//                             <Radio
//                               checked={selectedPayment === payment.method}
//                               onChange={() =>
//                                 handlePaymentChange(payment.method)
//                               }
//                               sx={{
//                                 color: "blue.600",
//                                 "&.Mui-checked": {
//                                   color: "blue.600",
//                                 },
//                               }}
//                             />
//                           }
//                           label={
//                             <Box
//                               component="div"
//                               className="w-100"
//                               sx={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 // border: "2px solid",
//                                 borderColor:
//                                   selectedPayment === payment.method
//                                     ? "blue.500"
//                                     : "gray.200",
//                                 borderRadius: 1,
//                                 padding: 1,
//                                 transition: "border-color 200ms",
//                                 bgcolor:
//                                   selectedPayment === payment.method
//                                     ? "blue.50"
//                                     : "inherit",
//                                 cursor: "pointer",
//                               }}
//                               onClick={() =>
//                                 handlePaymentChange(payment.method)
//                               }
//                             >
//                               <span className="icon">{payment.icon}</span>
//                               <Box sx={{ ml: 2 }}>
//                                 <Typography
//                                   variant="body1"
//                                   fontWeight="medium"
//                                   color="text.primary"
//                                 >
//                                   {payment.label}
//                                 </Typography>
//                                 <Typography
//                                   variant="body2"
//                                   color="text.secondary"
//                                 >
//                                   {payment.description}
//                                 </Typography>
//                               </Box>
//                             </Box>
//                           }
//                         />
//                       ))}
//                     </Box>
//                   </CardContent>
//                 </Card>
//               </Box>

//               <Box>
//                 <Button
//                   fullWidth
//                   variant="contained"
//                   sx={{
//                     mt: 2,
//                     bgcolor: "#5a3e1b",
//                     mb: 2,
//                     display: { xs: "none", lg: "block" },
//                     textTransform: "none",
//                   }}
//                   onClick={() => {
//                     if (selectedPayment !== null) {
//                       // setPageStage(PageState.PAYMENT_PROCESS);
//                       handlePayment();
//                     } else {
//                       setSnackbar({
//                         open: true,
//                         message: "Please select a payment method.",
//                         severity: "error",
//                       });
//                     }
//                   }}
//                 >
//                   Continue to Payment
//                 </Button>
//               </Box>
//             </Grid>

//             <Grid item xs={12} lg={4}>
//               {/* {chekoutDetails?.checkoutItems &&
//                     chekoutDetails?.checkoutItems.map((each) => (
//                       <Box
//                         key={each.itemId}
//                         display="flex"
//                         alignItems="center"
//                         mb={2}
//                       >
//                         <img
//                           src={each.productCard?.imageUrl}
//                           alt="Product"
//                           width={80}
//                           height={80}
//                           style={{ borderRadius: 8 }}
//                         />
//                         <Box ml={2}>
//                           <Typography variant="body1" fontWeight="bold">
//                             {each.productCard?.itemTitle}
//                           </Typography>
//                           <Box className="d-flex flex-row justify-content-between align-items-center">
//                             <Box className="d-flex">
//                               <Typography variant="body2">
//                                 {each.productCard?.currency}
//                                 {each.unitPrice}
//                               </Typography>
//                               <Typography variant="body2" className="mx-2">
//                                 {each.qty}
//                               </Typography>
//                               <Typography variant="body2">
//                                 {each.productCard?.currency}
//                                 {each.totalPrice}
//                               </Typography>
//                             </Box>
//                           </Box>
//                         </Box>
//                       </Box>
//                     ))} */}

//               {/* <Box display="flex" alignItems="center" mb={2}>
//                 <img
//                   src="https://img.freepik.com/free-photo/organic-cosmetic-product-with-dreamy-aesthetic-fresh-background_23-2151382830.jpg?ga=GA1.1.1900170151.1741929476&semt=ais_hybrid"
//                   alt="Product"
//                   width={80}
//                   height={80}
//                   style={{ borderRadius: 8 }}
//                 />
//                 <Box ml={2}>
//                   <Typography variant="body1" fontWeight="bold">
//                     Light Day Lotion Lavender & Neroli SPF 30 | PA ++
//                   </Typography>
//                   <Typography variant="body2">50ml</Typography>
//                 </Box>
//               </Box> */}

//               {/* <Box mt={2} p={2}>
//                     <Grid container spacing={2}>
//                       <Grid item xs={6}>
//                         <Typography variant="body2">Total Cost:</Typography>
//                       </Grid>
//                       <Grid item xs={6} textAlign="right">
//                         <Typography variant="body2">
//                           {chekoutDetails?.checkoutItems?.[0] &&
//                             chekoutDetails?.checkoutItems?.[0].productCard
//                               ?.currency}
//                           {chekoutDetails?.totalPrice}
//                         </Typography>
//                       </Grid>
//                       <Grid item xs={6}>
//                         <Typography variant="body2">Shipping Fee:</Typography>
//                       </Grid>
//                       <Grid item xs={6} textAlign="right">
//                         <Typography variant="body2">Free</Typography>
//                       </Grid>
//                       <Grid item xs={6}>
//                         <Typography variant="body2">
//                           Delivery Charges:
//                         </Typography>
//                       </Grid>
//                       <Grid item xs={6} textAlign="right">
//                         <Typography variant="body2">Free</Typography>
//                       </Grid>
//                       <Grid item xs={6}>
//                         <Typography variant="body2">GST:</Typography>
//                       </Grid>
//                       <Grid item xs={6} textAlign="right">
//                         <Typography variant="body2">INR 0</Typography>
//                       </Grid>
//                       <Grid item xs={6}>
//                         <Typography variant="body2">
//                           Additional Discount:
//                         </Typography>
//                       </Grid>
//                       <Grid item xs={6} textAlign="right">
//                         <Typography variant="body2">
//                           {
//                             chekoutDetails?.checkoutItems?.[0].productCard
//                               ?.currency
//                           }{" "}
//                           0
//                         </Typography>
//                       </Grid>
//                     </Grid>
//                     <Divider sx={{ my: 1 }} />
//                     <Grid container>
//                       <Grid item xs={6}>
//                         <Typography variant="h6" fontWeight="400">
//                           Total:
//                         </Typography>
//                       </Grid>
//                       <Grid item xs={6} textAlign="right">
//                         <Typography variant="h6" fontWeight="400">
//                           {chekoutDetails?.checkoutItems?.[0] &&
//                             chekoutDetails?.checkoutItems?.[0].productCard
//                               ?.currency}
//                           {chekoutDetails?.totalPrice}
//                         </Typography>
//                       </Grid>
//                     </Grid>
//                     <Divider sx={{ my: 1 }} />
//                   </Box> */}

//               <Paper
//                 elevation={0}
//                 sx={{
//                   p: 3,
//                   position: "sticky",
//                   // backgroundColor: "#fff",
//                   borderRadius: 2,
//                   border: "1px solid #F1EAE4",
//                   top: 200,
//                   // zIndex: 10,

//                   backgroundColor: (theme) => theme.palette.info.main,
//                 }}
//               >
//                 <Typography
//                   variant="h6"
//                   gutterBottom
//                   sx={{
//                     fontWeight: 500,
//                     color: (theme) => theme.palette.success.main,
//                   }}
//                 >
//                   Price Details
//                 </Typography>

//                 <Divider sx={{ mt: 2, color: "#EED9CB" }} />

//                 <Box sx={{ mt: 2 }}>
//                   {[
//                     {
//                       label: "Total Cost",
//                       value: `${symbol}${"\u200A"}${chekoutDetails?.totalMrp}`,
//                     },
//                     {
//                       label: "Shipping Fee",
//                       value: `${symbol}${"\u200A"}${
//                         priceBreakupDetails?.shippingCharge
//                       }`,
//                     },
//                     // { label: "Delivery Charges", value: "Free" },
//                     { label: "GST", value: `${symbol}${"\u200A"}0` },
//                     {
//                       label: "Discount",
//                       value: ` ${
//                         chekoutDetails?.discAmount
//                           ? `-${symbol}${"\u200A"}${Math.round(
//                               chekoutDetails?.discAmount
//                             )}`
//                           : `${symbol}${"\u200A"}0`
//                       }`,
//                     },
//                     {
//                       label: "Additional Discount",
//                       value: ` ${
//                         couponResponse?.discountAmt
//                           ? ` -${symbol}${"\u200A"}${
//                               couponResponse?.discountAmt
//                             } `
//                           : `${symbol}${"\u200A"}0`
//                       } `,
//                     },
//                   ].map((item, index) => {
//                     let value = item.value;

//                     if (
//                       item.label === "Shipping Fee" &&
//                       item.value === `${symbol}${"\u200A"}0`
//                     ) {
//                       value = "Free";
//                     }

//                     return (
//                       <Box
//                         key={index}
//                         sx={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           mb: 1.5,
//                         }}
//                       >
//                         <Typography
//                           sx={{
//                             fontWeight: 500,
//                             fontSize: "15px",
//                             color: "#5C5C5C",
//                           }}
//                         >
//                           {item.label}
//                         </Typography>
//                         <Typography
//                           sx={{
//                             fontWeight: 500,
//                             fontSize: "15px",
//                             color:
//                               item.label.toLowerCase().includes("discount") &&
//                               item.value !== `${symbol}${"\u200A"}0`
//                                 ? (theme) => theme.palette.error.main
//                                 : "#1A1A1A",
//                           }}
//                         >
//                           {value}
//                         </Typography>
//                       </Box>
//                     );
//                   })}
//                 </Box>

//                 <Divider sx={{ my: 1, color: "#EED9CB" }} />

//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     mb: 2,
//                   }}
//                 >
//                   <Typography
//                     variant="h6"
//                     sx={{
//                       fontWeight: 500,
//                       color: (theme) => theme.palette.success.main,
//                     }}
//                   >
//                     Total Amount
//                   </Typography>
//                   <Typography
//                     variant="h6"
//                     sx={{
//                       fontWeight: 500,
//                       color: (theme) => theme.palette.success.main,
//                     }}
//                   >
//                     {symbol}
//                     {"\u200A"}
//                     {totalAmount}
//                   </Typography>
//                 </Box>
//                 <Divider sx={{ mb: 2, color: "#EED9CB" }} />

//                 <Button
//                   fullWidth
//                   variant="contained"
//                   sx={{
//                     display: { xs: "block", lg: "none" },
//                     mt: 1,
//                     bgcolor: "#5a3e1b",
//                     mb: 1,
//                     textTransform: "none",
//                   }}
//                   onClick={() => {
//                     if (selectedPayment !== null) {
//                       // setPageStage(PageState.PAYMENT_PROCESS);
//                       handlePayment();
//                     } else {
//                       setSnackbar({
//                         open: true,
//                         message: "Please select a payment method.",
//                         severity: "error",
//                       });
//                     }
//                   }}
//                 >
//                   Continue to Payment
//                 </Button>

//                 <Snackbar
//                   open={snackbar.open}
//                   autoHideDuration={3000}
//                   onClose={handleCloseSnackbar}
//                   anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//                 >
//                   <MuiAlert
//                     onClose={handleCloseSnackbar}
//                     severity={snackbar.severity}
//                     sx={{ width: "100%" }}
//                   >
//                     {snackbar.message}
//                   </MuiAlert>
//                 </Snackbar>

//                 {/* <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
//                   <Checkbox defaultChecked size="small" />
//                   <Typography variant="body2" color="text.secondary">
//                     Add shipping protection (INR 0.98)
//                   </Typography>
//                 </Box> */}
//               </Paper>
//             </Grid>
//           </Grid>
//         </div>
//       )}

//       {pageStage === PageState.ERROR && (
//         <div className="h-100">
//           <h3 className="text-center"> Data not found</h3>
//         </div>
//       )}

//       {pageStage === PageState.PAYMENT_PROCESS && (
//         <div className="h-100">
//           <Box
//             sx={{
//               height: "70vh",
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//           >
//             <Box
//               sx={{
//                 position: "relative",
//                 width: 70,
//                 height: 70,
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//               }}
//             >
//               <CircularProgress sx={{ color: "#1E2624" }} size={70} />
//               <CheckIcon
//                 sx={{
//                   position: "absolute",
//                   fontSize: 50,
//                   color: "#1E2624",
//                 }}
//               />
//             </Box>
//           </Box>
//         </div>
//       )}
//       {/* 008000 */}
//       {pageStage === PageState.PAYMENT_SUCCESS && (
//         <div className="h-100">
//           <Box
//             sx={{
//               height: "80vh",
//               display: "flex",
//               flexDirection: "column",
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//           >
//             <Box
//               sx={{
//                 position: "relative",
//                 width: 70,
//                 height: 70,
//               }}
//             >
//               {showProgress && (
//                 <CircularProgress
//                   thickness={1.5}
//                   size={70}
//                   sx={{
//                     color: "#008000",
//                     position: "absolute",
//                     top: 0,
//                     left: 0,
//                   }}
//                 />
//               )}

//               <motion.div
//                 style={{
//                   position: "absolute",
//                   top: 0,
//                   left: 0,
//                   width: "100%",
//                   height: "100%",
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                 }}
//                 initial={{ scale: 0 }}
//                 animate={{ scale: [0, 0, 1.5] }}
//                 transition={{
//                   times: [0, 0, 1],
//                   duration: 0.9,
//                   ease: "easeInOut",
//                 }}
//                 onAnimationComplete={() => {
//                   setShowProgress(false);
//                 }}
//               >
//                 <CheckIcon
//                   sx={{
//                     fontSize: 70,
//                     color: "#008000",
//                   }}
//                 />
//               </motion.div>
//             </Box>
//             <motion.div
//               className="mt-5"
//               initial={{ y: 50, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ duration: 0.5, ease: "easeOut" }}
//             >
//               <h6
//                 style={{
//                   color: "#008000",
//                 }}
//               >
//                 Your payment was successful
//               </h6>
//               <p
//                 style={{
//                   color: "#4b5565",
//                 }}
//               >
//                 Thank you for your payment.
//               </p>
//             </motion.div>
//           </Box>
//         </div>
//       )}
//       {pageStage === PageState.PAYMENT_FAILED && (
//         <div className="h-100">
//           <Box
//             sx={{
//               height: "80vh",
//               display: "flex",
//               flexDirection: "column",
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//           >
//             <Box
//               sx={{
//                 position: "relative",
//                 width: 70,
//                 height: 70,
//               }}
//             >
//               {showProgress && (
//                 <CircularProgress
//                   thickness={1.5}
//                   size={70}
//                   sx={{
//                     color: "#ff0000",
//                     position: "absolute",
//                     top: 0,
//                     left: 0,
//                   }}
//                 />
//               )}

//               <motion.div
//                 style={{
//                   position: "absolute",
//                   top: 0,
//                   left: 0,
//                   width: "100%",
//                   height: "100%",
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                 }}
//                 initial={{ scale: 0 }}
//                 animate={{ scale: [0, 0, 1.5] }}
//                 transition={{
//                   times: [0, 0, 1],
//                   duration: 0.9,
//                   ease: "easeInOut",
//                 }}
//                 onAnimationComplete={() => {
//                   setShowProgress(false);
//                 }}
//               >
//                 <CloseIcon
//                   sx={{
//                     fontSize: 65,
//                     color: "#ff0000",
//                     tickness: 1,
//                   }}
//                 />
//               </motion.div>
//             </Box>

//             <motion.div
//               className="mt-5 text-center"
//               initial={{ y: 50, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ duration: 0.5, ease: "easeOut" }}
//             >
//               <h6
//                 style={{
//                   color: "#ff0000",
//                 }}
//                 className="text-center"
//               >
//                 Your payment has failed
//               </h6>
//               <p
//                 style={{
//                   color: "#4b5565",
//                 }}
//                 className="text-center"
//               >
//                 Please try again or choose a different payment method.
//               </p>
//             </motion.div>
//           </Box>
//         </div>
//       )}

//       <CheckoutAddressDrawer
//         open={isDrawerOpen}
//         onClose={() => {
//           setIsDrawerOpen(false);
//           dispatch(addSticky());
//         }}
//         setCheckoutAddress={setCheckoutAddress}
//         isDefaultAddressPresent={isDefaultAddressPresent}
//         setDefaultAddressPresent={setDefaultAddressPresent}
//       />
//     </>
//   );
// };

// export default Checkout;


export {}