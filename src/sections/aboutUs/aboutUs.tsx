import React from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  CardMedia,
  CircularProgress,
} from "@mui/material";
import { GetAboutUsData } from "./aboutusService/aboutusService";
import { Content } from "./model/contentType";
import { useFetch } from "../../customHooks/useFetch";
import BreadcrumbNav from "../Breadcrumb/BreadcrumbNav";

const AboutUs = () => {
  // const { data, error, isLoading } = useFetchByQuery<Content>(GetAboutUsPageContent, { contentCode: contentCode });
  const { data, error, isLoading } = useFetch<Content>(GetAboutUsData);
  console.log("About Us Data:", data);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Top Banner */}
      <Box
        sx={{
          position: "relative",
          display: "flex",
          height: { md: 250, xs: 130 },
          backgroundImage: `url(${data?.picUrl || ""})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="w-100"
      >
        <Box
          sx={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "50%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            px: { xs: 2, md: 4 },
            marginLeft: { xs: 2, md: 5 },
          }}
        >
          <Typography
            sx={{ fontSize: { xs: "12px", md: "18px" } }}
            variant="subtitle2"
            color="white"
            mb={1}
          >
            WELCOME TO RxHMS
          </Typography>
          <Typography
            sx={{ fontSize: { xs: "21px", md: "30px" } }}
            variant="h4"
            color="white"
            fontWeight={500}
          >
            {data?.contentDetails?.[0]?.title}
          </Typography>
        </Box>
      </Box>

      <BreadcrumbNav />

      {/* About Content Sections */}
      <Container sx={{ py: 6 }}>
        {data?.contentDetails?.map((item, index) => (
          <Grid
            key={item.id}
            container
            spacing={4}
            alignItems="center"
            direction={index % 2 === 0 ? "row" : "row-reverse"}
            sx={{ mb: 8 }}
          >
            <Grid item xs={12} md={6}>
              <Box sx={{ maxWidth: "566px" }}>
                <CardMedia
                  component="img"
                  image={item.picUrl}
                  alt={item.title}
                  sx={{ width: "100%", borderRadius: 2 }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: "32px",
                  lineHeight: "100%",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {item.title}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                {item.description}
              </Typography>
            </Grid>
          </Grid>
        ))}
      </Container>
    </Box>
  );
};

export default AboutUs;
