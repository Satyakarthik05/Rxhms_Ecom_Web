import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Container,
  Box,
} from "@mui/material";
import { DataSection } from "../header/model/dataSection";
import { ProductIngredients } from "../inventoryProduct/model/productIngredients";

// const ingredients = [
//   {
//     name: "Anantmool",
//     image:
//       "https://img.freepik.com/free-photo/dried-food-clay-bowl-close-up_1232-1288.jpg?ga=GA1.1.546395401.1742272792&semt=ais_hybrid",
//     description:
//       "A natural, effective substance that helps the skin to retain water, reduce fine lines and wrinkles. The highest quality low molecular acid is used for deep penetration.",
//   },
//   {
//     name: "Chironji Seed Extract",
//     image:
//       "https://img.freepik.com/free-photo/pardina-lentils_1368-8865.jpg?ga=GA1.1.546395401.1742272792&semt=ais_hybrid",
//     description:
//       "A natural, effective substance that helps the skin to retain water, reduce fine lines and wrinkles. The highest quality low molecular acid is used for deep penetration.",
//   },
//   {
//     name: "Hyaluronic Acid",
//     image:
//       "https://img.freepik.com/free-photo/close-up-hyaluronic-acid-tratment_23-2149286727.jpg?ga=GA1.1.546395401.1742272792&semt=ais_hybrid",
//     description:
//       "A natural, effective substance that helps the skin to retain water, reduce fine lines and wrinkles. The highest quality low molecular acid is used for deep penetration.",
//   },
//   {
//     name: "Omega 3",
//     image:
//       "https://img.freepik.com/premium-vector/omega-3-icon-flat-style-pill-capsule-vector-illustration-white-isolated-background-oil-fish-business-concept_157943-548.jpg?ga=GA1.1.546395401.1742272792&semt=ais_hybrid",
//     description:
//       "A natural, effective substance that helps the skin to retain water, reduce fine lines and wrinkles. The highest quality low molecular acid is used for deep penetration.",
//   },
//   {
//     name: "Sanjeevani Herb Infusion",
//     image:
//       "https://img.freepik.com/premium-photo/close-up-potted-plant-table-against-white-background_1048944-5412654.jpg?ga=GA1.1.546395401.1742272792&semt=ais_hybrid",
//     description:
//       "A natural, effective substance that helps the skin to retain water, reduce fine lines and wrinkles. The highest quality low molecular acid is used for deep penetration.",
//   },
//   {
//     name: "Red Algae Extract",
//     image:
//       "https://img.freepik.com/premium-photo/transparent-png-available-red-seaweed-rhodophyta-algae-branch_1030895-93343.jpg?ga=GA1.1.546395401.1742272792&semt=ais_hybrid",
//     description:
//       "A natural, effective substance that helps the skin to retain water, reduce fine lines and wrinkles. The highest quality low molecular acid is used for deep penetration.",
//   },
// ];

interface IngredientProps {
  ingredients: ProductIngredients[];
}

const Ingredients: React.FC<IngredientProps> = ({ ingredients }) => {
  console.log("ingredients", ingredients);
  return (
    <Container
      sx={{
        width: "100%",
        textAlign: "center",
        py: { xs: 2, sm: 3, md: 5 },
      }}
    >
      <Typography
        variant="h6"
        color="textSecondary"
        sx={{
          fontSize: { xs: "0.9rem", sm: "1rem" },
        }}
      >
        Key Ingredients
      </Typography>

      <Typography
        variant="h4"
        fontWeight={600}
        gutterBottom
        sx={{
          fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
          px: { xs: 1, sm: 2 },
        }}
      >
        What's inside that really matters
      </Typography>

      <Grid
        container
        spacing={3}
        justifyContent="center"
        sx={{ mt: { xs: 2, sm: 3 } }}
      >
        {ingredients.map((item, index) => (
          <Grid item xs={12} sm={6} md={6} key={index}>
            <Box
              sx={{
                display: "flex",
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
                alignItems: {
                  xs: "flex-start",
                  sm: "center",
                },
                height: "100%",
                borderRadius: "12px",
                p: { xs: 1.5, sm: 2 },
                backgroundColor: (theme) => theme.palette.info.main,
              }}
            >
              <CardMedia
                component="img"
                image={item.imageUrl}
                alt={item.title}
                sx={{
                  width: { xs: "100%", sm: 100 },
                  height: { xs: 140, sm: 100 },
                  objectFit: "cover",
                  borderRadius: 2,
                  marginBottom: { xs: 1, sm: 0 },
                  marginRight: { xs: 0, sm: 2 },
                }}
              />
              <CardContent sx={{ px: 0 }}>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  gutterBottom
                  sx={{
                    fontSize: { xs: "1rem", sm: "1.1rem" },
                    textAlign: "left",
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{
                    fontSize: { xs: "0.85rem", sm: "0.95rem" },
                    textAlign: "left",
                  }}
                >
                  {item.description}
                </Typography>
              </CardContent>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Ingredients;
