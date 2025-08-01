import React, { useState } from "react";
import { Carousel } from "antd";
import { Box, Button, Typography } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useNavigate } from "react-router-dom";
import { TitleAnimationType } from "./enum/titleAnimationType";
import { PositionType } from "./enum/positionType";
import "./carouselAnimations.css";

const mockCarouselData = {
  carouselSlides: [
    {
      id: 1,
      mediaUrl:
        "https://www.fda.gov/files/How_to_Buy_Medicines_Safely_From_an_Online_Pharmacy_1600x900.png",
      title: "MEDICINE",
      caption: "Find peace in the great outdoors",
      titleRequired: true,
      captionRequired: true,
      ctaRequired: true,
      ctaTitle: "View More",
      ctaLink: "/nature",
      ctaColor: "#007BFF",
      titleAnimation: TitleAnimationType.FADEIN,
      titlePosition: PositionType.BOTTOM_LEFT,
      captionPosition: PositionType.BOTTOM_LEFT,
      ctaPosition: PositionType.BOTTOM_LEFT,
    },
    {
      id: 2,
      mediaUrl:
        "https://images.unsplash.com/photo-1628771065518-0d82f1938462?fm=jpg&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWVkaWNhdGlvbnN8ZW58MHx8MHx8fDA%3D&ixlib=rb-4.1.0&q=60&w=3000",
      title: "Medicine  in the city",
      caption: "Stay ahead with the latest insights",
      titleRequired: true,
      captionRequired: true,
      ctaRequired: true,
      ctaTitle: "Learn More",
      ctaLink: "/tech",
      ctaColor: "#28a745",
      titleAnimation: TitleAnimationType.FADEIN,
      titlePosition: PositionType.BOTTOM_CENTER,
      captionPosition: PositionType.BOTTOM_CENTER,
      ctaPosition: PositionType.BOTTOM_CENTER,
    },
    {
      id: 3,
      mediaUrl:
        "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?fm=jpg&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cGhhcm1hY3l8ZW58MHx8MHx8fDA%3D&ixlib=rb-4.1.0&q=60&w=3000",
      title: "Buy Medicines Safely",
      caption: "Adventure awaits",
      titleRequired: true,
      captionRequired: true,
      ctaRequired: true,
      ctaTitle: "Book Now",
      ctaLink: "/travel",
      ctaColor: "#dc3545",
      titleAnimation: TitleAnimationType.BLINKING,
      titlePosition: PositionType.TOP_RIGHT,
      captionPosition: PositionType.TOP_RIGHT,
      ctaPosition: PositionType.TOP_RIGHT,
    },
  ],
};

const CarouselComponent: React.FC = () => {
  const data = mockCarouselData;
  const [activeSlide, setActiveSlide] = useState(0);
  const navigate = useNavigate();

  const getAnimationClass = (animation: TitleAnimationType): string => {
    switch (animation) {
      case TitleAnimationType.BLINKING:
        return "blinking";
      case TitleAnimationType.FADEIN:
        return "fade-in";
      case TitleAnimationType.FADEOUT:
        return "fade-out";
      case TitleAnimationType.HORIZONTALSCROLLING:
        return "horizontal-scroll";
      default:
        return "";
    }
  };

  const PrevArrow = (props: any) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          left: 10,
          zIndex: 10,
          width: 50,
          height: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          borderTopRightRadius: 12,
          borderBottomRightRadius: 12,
          backdropFilter: "blur(8px)",
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          cursor: "pointer",
        }}
        onClick={onClick}
      >
        <ChevronLeftIcon sx={{ fontSize: 32, color: "#333" }} />
      </div>
    );
  };

  const NextArrow = (props: any) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          right: 10,
          zIndex: 2,
          width: 50,
          height: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          borderTopLeftRadius: 12,
          borderBottomLeftRadius: 12,
          backdropFilter: "blur(8px)",
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          cursor: "pointer",
        }}
        onClick={onClick}
      >
        <ChevronRightIcon sx={{ fontSize: 32, color: "#333" }} />
      </div>
    );
  };

  return (
    <Carousel
      arrows
      autoplay
      infinite
      // prevArrow={<PrevArrow />}
      // nextArrow={<NextArrow />}
      beforeChange={(current, next) => setActiveSlide(next)}
      dots={false}
    >
      {data.carouselSlides.map((slide: any, index: any) => {
        const animationClass =
          index === activeSlide ? getAnimationClass(slide.titleAnimation) : "";

        return (
          <Box
            key={slide.id}
            onClick={() => slide.targetUrl && navigate(slide.targetUrl)}
            sx={{
              height: { sm: "20vh", md: "85vh" },
              backgroundImage: `url(${slide.mediaUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              width: "100%",
              cursor: slide.targetUrl ? "pointer" : "default",
            }}
          >
            <Box
              className={`position-${slide.titlePosition.toLowerCase()} carousel-stack`}
              sx={{
                p: 4,
                color: "#fff",
              }}
            >
              {slide.captionRequired && (
                <Typography
                  variant="subtitle1"
                  className={`carousel-caption ${animationClass}`}
                >
                  {slide.caption}
                </Typography>
              )}

              {slide.titleRequired && (
                <Typography
                  variant="h4"
                  className={`carousel-title ${animationClass}`}
                >
                  {slide.title}
                </Typography>
              )}

              {slide.ctaRequired && (
                <Button
                  sx={{
                    mt: 2,
                    backgroundColor: slide.ctaColor,
                    color: "#fff",
                    ":hover": {
                      backgroundColor: slide.ctaColor,
                      opacity: 0.9,
                    },
                  }}
                  onClick={() =>
                    navigate(slide.ctaLink || slide.targetUrl || "/")
                  }
                >
                  {slide.ctaTitle}
                </Button>
              )}
            </Box>
          </Box>
        );
      })}
    </Carousel>
  );
};

export default CarouselComponent;
