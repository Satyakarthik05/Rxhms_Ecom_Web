import React from "react";
import {
  Box,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  Container,
  Stack,
  Breadcrumbs,
  useTheme,
  useMediaQuery,
  Link,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Ticket } from "../Models/support/tiket";
import { useFetch } from "../../customHooks/useFetch";
import { GetTicketByIdUri } from "./profileService/profileService";
import { TicketStatusDisplay } from "../Models/support/ticketStatus";
import { TicketCategoryDisplay } from "../Models/support/ticketCategory";
import { useFetchByPath } from "../../customHooks/useFetchByPath";
import { ArrowBack } from "@mui/icons-material";
import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined";

const TicketDetails = () => {
  const { ticketId } = useParams<{ ticketId: string }>();

  const {
    data: ticket,
    isLoading,
    error,
  } = useFetchByPath<Ticket>(GetTicketByIdUri, ticketId || "");

  console.log("ticket detail", ticket);

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleBack = () => {
    navigate(`/overview/view-tickets`);
  };

  if (isLoading)
    return (
      <Box className="d-flex  flex-row justify-content-center align-items-centerw-100 h-100">
        <CircularProgress />
      </Box>
    );

  if (error || !ticket)
    return <Typography color="error">Unable to load ticket.</Typography>;

  return (
    <>
      {" "}
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
                onClick={() => navigate("/overview")}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    textDecoration: "underline",
                  },

                  fontWeight: 500,
                }}
              >
                Overview
              </Link>
              <Link
                underline="hover"
                color="inherit"
                onClick={() => navigate("/overview/view-tickets")}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    textDecoration: "underline",
                  },

                  fontWeight: 500,
                }}
              >
                My Tikets
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
                Tiket Details
              </Link>
            </Breadcrumbs>
          </div>
        </Box>
      )}
      <Container maxWidth="lg" sx={{ py: 4, minHeight: "70vh" }}>
        <Box>
          <Stack direction="row" alignItems="center" spacing={1}>
            <ArrowBack
              fontSize="small"
              sx={{ cursor: "pointer" }}
              onClick={() => handleBack()}
            />
            <Typography variant="h6">Ticket Details</Typography>
          </Stack>

          <Box
            sx={{
              backgroundColor: (theme) => theme.palette.info.main,
              borderRadius: 2,
              p: 3,
              mt: 3,
            }}
          >
            <Grid container spacing={3}>
              {/* Ticket ID */}
              <Grid item xs={12} sm={6} md={2.5}>
                <Typography variant="body2" color="text.secondary">
                  Ticket ID
                </Typography>
                <Typography fontWeight={600}>{ticket.id}</Typography>
              </Grid>

              {/* Order Number - More width */}
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Order Number
                </Typography>
                <Typography fontWeight={600} sx={{ wordBreak: "break-word" }}>
                  {ticket.orderNum}
                </Typography>
              </Grid>

              {/* Category */}
              <Grid item xs={12} sm={6} md={2.5}>
                <Typography variant="body2" color="text.secondary">
                  Category
                </Typography>
                <Typography fontWeight={600}>
                  {TicketCategoryDisplay[
                    ticket.category as keyof typeof TicketCategoryDisplay
                  ] || ticket.category}
                </Typography>
              </Grid>

              {/* Subject */}
              <Grid item xs={12} sm={6} md={2}>
                <Typography variant="body2" color="text.secondary">
                  Subject
                </Typography>
                <Typography fontWeight={600}>{ticket.subject}</Typography>
              </Grid>

              {/* Submitted */}
              <Grid item xs={12} sm={6} md={2.5}>
                <Typography variant="body2" color="text.secondary">
                  Submitted
                </Typography>
                <Typography fontWeight={600}>
                  {ticket.generatedOn
                    ? new Date(ticket.generatedOn).toLocaleString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "N/A"}
                </Typography>
              </Grid>

              {/* Phone Number */}
              <Grid item xs={12} sm={6} md={2.5}>
                <Typography variant="body2" color="text.secondary">
                  Phone Number
                </Typography>
                <Typography fontWeight={600}>{ticket.mobileNum}</Typography>
              </Grid>

              {/* Email ID */}
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Email ID
                </Typography>
                <Typography fontWeight={600}>{ticket.email}</Typography>
              </Grid>

              {/* Description */}
              {/* Status */}
              <Grid item xs={12} sm={6} md={2}>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  label={
                    TicketStatusDisplay[
                      ticket.status as keyof typeof TicketStatusDisplay
                    ] || ticket.status
                  }
                  size="small"
                  sx={{
                    backgroundColor:
                      ticket.status === "OPEN"
                        ? "#E6FBF0"
                        : ticket.status === "IN_PROGRESS"
                        ? "#FFF8E1"
                        : ticket.status === "RESOLVED"
                        ? "#E3F2FD"
                        : "#FDEAEA",
                    color:
                      ticket.status === "OPEN"
                        ? "#1A7F53"
                        : ticket.status === "IN_PROGRESS"
                        ? "#F9A825"
                        : ticket.status === "RESOLVED"
                        ? "#1976D2"
                        : "#C62828",
                    fontWeight: 600,
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Description
                </Typography>
                <Box fontWeight={600}>{ticket.description || "No description provided."}</Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default TicketDetails;
