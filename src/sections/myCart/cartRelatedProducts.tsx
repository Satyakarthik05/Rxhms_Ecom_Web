import React, { useEffect, useState, useCallback } from "react";
import { Typography, Button, Grid, Container } from "@mui/material";
import "../relatedProducts/relatedProducts.css";

import { CustomCard } from "../../utils/customCard";
import { ProductCard } from "../inventoryProduct/model/productCard";
import { cartRelatedProductsService } from "./service/cartRelatedProductsService";

interface RelatedProductsProps {
  itemSlug: string[]; // assume always an array of slugs
}

const CartRelatedProducts: React.FC<RelatedProductsProps> = ({ itemSlug }) => {
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [products, setProducts] = useState<ProductCard[]>([]);
  const [allPagesLoaded, setAllPagesLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch products for a given page
  const loadProducts = useCallback(
    async (slugList: string[], offset: number) => {
      setIsLoading(true);
      try {
        const response = await cartRelatedProductsService(slugList, offset);
        const newRecords = response.records || [];

        if (offset === 0) {
          setProducts(newRecords);
        } else {
          setProducts((prev) => [...prev, ...newRecords]);
        }

        // If we've reached the last page, disable further loading
        if (offset >= response.totalPages - 1) {
          setAllPagesLoaded(true);
        }
      } catch (error) {
        console.error("Error loading related products:", error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (Array.isArray(itemSlug) && itemSlug.length > 0) {
      setPageNumber(0);
      setAllPagesLoaded(false);
      setProducts([]);
      loadProducts(itemSlug, 0);
    }
  }, [itemSlug, loadProducts]);

  useEffect(() => {
    if (pageNumber > 0 && !allPagesLoaded) {
      loadProducts(itemSlug, pageNumber);
    }
  }, [pageNumber, itemSlug, allPagesLoaded, loadProducts]);

  const handleShowMore = () => {
    if (!allPagesLoaded && !isLoading) {
      setPageNumber((prev) => prev + 1);
    }
  };

  return (
    <Container
      sx={{ position: "relative" }}
      maxWidth="xl"
      className="my-4 mt-5 p-0"
    >
      <div className="container">
        {products && products?.length > 0 && (
          <Typography variant="h4" className="text-center mb-5 font-bold">
            Related Products
          </Typography>
        )}
        <Grid container spacing={2} justifyContent="center">
          {products &&
            products?.length > 0 &&
            products.map((product: ProductCard) => (
              <Grid
                item
                // className="bestSellerCard"
                key={product.itemId}
                xs={6}
                sm={4}
                md={3}
              >
                <CustomCard product={product} />
              </Grid>
            ))}

          {!allPagesLoaded && (
            <Grid item xs={12} container justifyContent="center">
              {products && products?.length > 0 && (
                <Button
                  disabled={allPagesLoaded}
                  onClick={handleShowMore}
                  style={{
                    color: "#464646",
                    letterSpacing: "1%",
                    lineHeight: "135%",
                    fontWeight: "600",
                    backgroundColor: "transparent",
                    boxShadow: "none",
                    border: "1px solid #464646",
                  }}
                  variant="contained"
                  className=" mb-4  px-6 py-2 rounded-md"
                >
                  SHOW ALL
                </Button>
              )}
            </Grid>
          )}
        </Grid>
      </div>
    </Container>
  );
};

export default CartRelatedProducts;
