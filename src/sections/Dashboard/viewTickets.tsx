import React from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Container,
  Avatar,
  Divider,
  Link,
  Breadcrumbs,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useFetchByQuery } from "../../customHooks/useFetchByQuery";
import { GetTicketUri } from "./profileService/profileService";
import { RootState } from "../../Redux/store/store";
import { useSelector } from "react-redux";
import { Ticket } from "../Models/support/tiket";
import { TicketCategoryDisplay } from "../Models/support/ticketCategory";
import { TicketStatusDisplay } from "../Models/support/ticketStatus";
import { useNavigate } from "react-router-dom";
import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined";
import { ReactComponent as OrdersIcon } from "../../assets/media/icons/order.svg";
import { ReactComponent as SupportIcon } from "../../assets/media/icons/support_agent.svg";
import { ReactComponent as CurrencyIcon } from "../../assets/media/icons/currency.svg";
import { ReactComponent as DocIcon } from "../../assets/media/icons/doc.svg";

const StatusChip = ({ status }: { status: string }) => (
  <Chip
    label={TicketStatusDisplay[status as keyof typeof TicketStatusDisplay]}
    size="small"
    sx={{
      backgroundColor: status === "OPEN" ? "#E6FBF0" : "#FDEAEA",
      color: status === "OPEN" ? "#1A7F53" : "#C62828",
      fontWeight: 600,
    }}
  />
);

const ViewTickets: React.FC = () => {
  const username = useSelector((store: RootState) => store.jwtToken.username);

  const { data: tickets = [] } = useFetchByQuery<Ticket[]>(GetTicketUri, {
    username,
  });

  console.log("view Tcikets", tickets);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClick = (ticketId: string) => {
    navigate(`/overview/view-tickets/${ticketId}`);
  };

  const handleClickBack = () => {
    navigate("/overview");
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "ORDER":
        return <OrdersIcon width={20} height={20} />;
      case "TECHNICAL":
        return <SupportIcon width={20} height={20} />;
      case "PAYMENT":
        return <CurrencyIcon width={25} height={25} />;
      case "OTHER":
      default:
        return <DocIcon width={20} height={20} />;
    }
  };

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
                onClick={() => navigate("/overview/")}
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
                sx={{
                  cursor: "default",
                  "&:hover": {
                    textDecoration: "none",
                  },

                  color: (theme) => theme.palette.success.light,
                  fontWeight: 500,
                }}
              >
                My Tickets
              </Link>
            </Breadcrumbs>
          </div>
        </Box>
      )}
      <Container maxWidth="lg" sx={{ py: 4, minHeight: "70vh" }}>
        <Box>
          {/* Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <ArrowBack
                fontSize="small"
                sx={{ cursor: "pointer" }}
                onClick={handleClickBack}
              />
              <Typography variant="h6">All Tickets</Typography>
            </Stack>
          </Box>

          {/* Ticket List or Empty Message */}
          {Array.isArray(tickets) && tickets.length > 0 ? (
            <Grid container spacing={2}>
              {tickets.map((ticket, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    variant="outlined"
                    sx={{ borderRadius: 2 }}
                    onClick={() =>
                      ticket.id != null && handleClick(String(ticket.id))
                    }
                    style={{ cursor: "pointer", border: "2px solid #F1EAE4" }}
                  >
                    <CardContent>
                      {/* Top row */}
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={1}
                      >
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Avatar
                            sx={{
                              bgcolor: "#E6FBF0",
                              width: 30,
                              height: 30,
                            }}
                          >
                            {getCategoryIcon(ticket.category)}
                          </Avatar>
                          <Typography fontWeight={600}>
                            {TicketCategoryDisplay[ticket.category]}
                          </Typography>
                        </Stack>
                        {ticket.status && <StatusChip status={ticket.status} />}
                      </Box>

                      <Divider sx={{ mb: 1 }} />

                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Category
                          </Typography>
                          <Typography fontWeight={600}>
                            {TicketCategoryDisplay[ticket.category]}
                          </Typography>
                        </Grid>

                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Submitted
                          </Typography>
                          <Typography fontWeight={600}>
                            {ticket.generatedOn
                              ? new Date(ticket.generatedOn).toLocaleDateString(
                                  "en-IN",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )
                              : "N/A"}
                          </Typography>
                        </Grid>

                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Subject
                          </Typography>
                          <Typography fontWeight={600}>
                            {ticket.subject}
                          </Typography>
                        </Grid>

                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Ticket ID
                          </Typography>
                          <Typography
                            fontWeight={600}
                            sx={{ fontSize: "14px" }}
                          >
                            {ticket.id}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="40vh"
            >
              <Typography variant="subtitle1" color="text.secondary">
                No ticket data available
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
};

export default ViewTickets;
