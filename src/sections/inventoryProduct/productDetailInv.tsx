// ProductDetail.tsx
import React from "react";
import {
  Grid,
  Typography,
  Box,
  Card,
  CardMedia,
  Rating,
  Button,
  Avatar,
  Stack,
  Divider,
  Chip,
} from "@mui/material";

// Enums
enum ProductStatusType {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

enum KeyType {
  STRING = "STRING",
  NUMBER = "NUMBER",
}

// Interfaces for Product Details
interface InvProdSpecs {
  id: number;
  productId: number;
  key: string;
  keyType: KeyType;
  value: string;
  required: boolean;
}

interface ItemGallery {
  id: number;
  itemId: number;
  fileId: number;
  fileUrl: string;
  isDefault: boolean;
}

interface ItemPricing {
  id: number;
  itemId: number;
  mrp: number;
  marketPrice: number;
  price: number;
  discount: number;
  currency: string;
  lastUpdatedOn: Date;
  priceChangedOn: Date;
}

interface Item {
  id: number;
  slug: string;
  productId: number;
  sku: string;
  title: string;
  description: string;
  status: ProductStatusType;
  totalRatings: number;
  avgRating: number;
  isDefault: boolean;
  itemPricing: ItemPricing;
  itemGallery: ItemGallery[];
}

interface InvProduct {
  id: number;
  slug: string;
  productCode: string;
  title: string;
  description: string;
  status: ProductStatusType;
  brand: string;
  ingredients: string[];
  shade?: string;
  volume: string;
  skinType: string[];
  items: Item[];
  productSpecs: InvProdSpecs[];
  reviews: Review[];
}

interface Review {
  userName: string;
  avatarUrl: string;
  rating: number;
  comment: string;
}

// Static Data for Cosmetic Product with Reviews
const mockProductData: InvProduct = {
  id: 1,
  slug: "cosmetic-product-1",
  productCode: "C12345",
  title: "Luxury Face Serum",
  description:
    "A rich and luxurious face cream that nourishes and hydrates your skin.",
  status: ProductStatusType.ACTIVE,
  brand: "RxHMS",
  ingredients: ["Shea Butter", "Vitamin E", "Aloe Vera", "Rose Extract"],
  volume: "50g",
  skinType: ["Dry", "Sensitive", "Normal"],
  items: [
    {
      id: 1,
      slug: "item-1",
      productId: 1,
      sku: "SKU123",
      title: "Luxury Face Cream 50g",
      description:
        "A face cream that provides deep hydration and nourishes dry skin.",
      status: ProductStatusType.ACTIVE,
      totalRatings: 120,
      avgRating: 4.8,
      isDefault: true,
      itemPricing: {
        id: 1,
        itemId: 1,
        mrp: 1200,
        marketPrice: 1000,
        price: 900,
        discount: 25,
        currency: "USD",
        lastUpdatedOn: new Date(),
        priceChangedOn: new Date(),
      },
      itemGallery: [
        {
          id: 1,
          itemId: 1,
          fileId: 1,
          fileUrl:
            "https://3.bp.blogspot.com/-qE7d_f7IQ_4/XLbRqQ30trI/AAAAAAAAAm8/J3f_0An5xYY-5DaGn8l7_G3AdLV0IExHQCLcBGAs/s1600/MG_1181-Editar1-3.jpg",
          isDefault: true,
        },
      ],
    },
  ],
  productSpecs: [
    {
      id: 1,
      productId: 1,
      key: "Volume",
      keyType: KeyType.STRING,
      value: "50g",
      required: true,
    },
    {
      id: 2,
      productId: 1,
      key: "Skin Type",
      keyType: KeyType.STRING,
      value: "Dry, Sensitive, Normal",
      required: true,
    },
  ],
  reviews: [
    {
      userName: "Manasa",
      avatarUrl: "https://wallpaperaccess.com/full/3776662.jpg?img=1",
      rating: 5,
      comment:
        "Absolutely love this product! It made my skin feel so soft and hydrated.",
    },
    {
      userName: "Harika",
      avatarUrl: "https://i.pravatar.cc/100?img=2",
      rating: 4,
      comment: "Great product, but I wish it was a bit cheaper.",
    },
    {
      userName: "Tabita ",
      avatarUrl:
        "https://t4.ftcdn.net/jpg/03/68/89/07/360_F_368890785_yPhrRtWYi0eRQkTaehpyAxytx0yX8Arx.jpg?img=3",
      rating: 3,
      comment:
        "It’s okay, but it didn’t work as well for my skin type as I hoped.",
    },
  ],
};

const ProductDetail: React.FC = () => {
  const product = mockProductData;

  return (
    <div className="container">
      <Box sx={{ padding: 3 }}>
        <Grid container spacing={3}>
          {/* Image Section */}
          <Grid item xs={12} sm={6}>
            <Card>
              <CardMedia
                component="img"
                height="500"
                image={product.items[0].itemGallery[0].fileUrl}
                alt={product.items[0].title}
              />
            </Card>
          </Grid>

          {/* Product Details */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h4" gutterBottom>
              {product.title}
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              {product.description}
            </Typography>
            <Typography variant="h6" color="textPrimary" gutterBottom>
              {`Brand: ${product.brand}`}
            </Typography>
            <Typography variant="h6" color="textPrimary" gutterBottom>
              {`Product Code: ${product.productCode}`}
            </Typography>
            <Typography variant="h6" color="textPrimary" gutterBottom>
              {`Price: $${product.items[0].itemPricing.price}`}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Rating:</strong>
              <Rating
                value={product.items[0].avgRating}
                readOnly
                precision={0.5}
              />
              {` (${product.items[0].totalRatings} Reviews)`}
            </Typography>
            <Button
              variant="contained"
              sx={{ color: "white", backgroundColor: "black" }}
            >
              Add to Cart
            </Button>

            {/* Ingredients and Skin Type */}
            <Box sx={{ marginTop: 5 }}>
              <Typography variant="h5" gutterBottom>
                Ingredients:
              </Typography>
              <Box sx={{ marginBottom: 2 }}>
                {product.ingredients.map((ingredient, index) => (
                  <Chip
                    key={index}
                    label={ingredient}
                    sx={{ marginRight: 1, marginBottom: 1 }}
                  />
                ))}
              </Box>
              <Typography variant="h5" gutterBottom>
                Suitable Skin Types:
              </Typography>
              {product.skinType.map((skinType, index) => (
                <Chip
                  key={index}
                  label={skinType}
                  sx={{ marginRight: 1, marginBottom: 1 }}
                />
              ))}
            </Box>

            {/* Product Specifications */}
            <Box sx={{ marginTop: 5 }}>
              <Typography variant="h5" gutterBottom>
                Product Specifications:
              </Typography>
              {product.productSpecs.map((spec) => (
                <Grid container key={spec.id} spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="body1">{spec.key}:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body1">{spec.value}</Typography>
                  </Grid>
                </Grid>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Reviews Section */}
        <hr />
        <Box sx={{ marginTop: 5 }}>
          <Typography variant="h5" gutterBottom>
            Customer Reviews:
          </Typography>
          {product.reviews.map((review, index) => (
            <Box key={index} sx={{ marginBottom: 3 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar alt={review.userName} src={review.avatarUrl} />
                <Typography variant="body1" fontWeight="bold">
                  {review.userName}
                </Typography>
                <Rating value={review.rating} readOnly precision={0.5} />
              </Stack>
              <Typography variant="body2" sx={{ marginTop: 1 }}>
                {review.comment}
              </Typography>
              {index < product.reviews.length - 1 && (
                <Divider sx={{ marginY: 2 }} />
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </div>
  );
};

export default ProductDetail;
