"use client";

import { useMemo, useRef } from "react";
import { useEffect, useState } from "react";
import "./products.css";
import {
  Grid,
  Box,
  Typography,
  MenuItem,
  Select,
  CircularProgress,
  Button,
  Divider,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ProductCards } from "./productCard";
import { Filters } from "./productsFiltes";
import { useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../Redux/store/store";
import { PageState } from "../../web-constants/constants";
import { getAllProductsService } from "./service/getAllProducts";
import type { ProductCard } from "./model/productCard";
import { useDispatch } from "react-redux";
import ProductNotFoundPage from "../../utils/notFound/productNotFound";
import type { SearchRequest } from "../Searchbar/model/searchRequest";
import {
  cleareSearchData,
  fetchMegaSearch,
} from "../../Redux/slices/megaSearchSlice";
import ClearIcon from "@mui/icons-material/Clear";
import { Drawer } from "antd";
import { addSticky, removeSticky } from "../../Redux/slices/headerStickyToggle";
import FilterListIcon from "@mui/icons-material/FilterList";
import { getDataWithSectionSlugService } from "./service/getDataBySectionService";
import type { CategoryFilter } from "./model/categoryFilter";
import { getDefaultWishlistAsync } from "../../Redux/slices/wishListSlice";

export const categories = ["Body Scrubs", "Exfoliants"];
export const brands = ["mCaffeine", "Sanfe"];

const Products = () => {
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [products, setProducts] = useState<ProductCard[]>([]);
  const [pageStatus, setPageStatus] = useState(PageState.IDLE);
  const [addItemId, setAddItemId] = useState<number[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [allPagesLoaded, setAllPagesLoaded] = useState<boolean>(false);
  const [infiniteLoadin, setInfiniteLoading] = useState<boolean>(false);
  const [isOpenfilters, setIsOpenfilters] = useState<boolean>(false);

  const theme = useTheme();
  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down("md"));

  const { data: searchedProducts, status: SearchStatus } = useSelector(
    (state: RootState) => state.megaSearch
  );
  const { username } = useSelector((state: RootState) => state.jwtToken);
  const [selectedCategories, setSelectedCategories] = useState<
    CategoryFilter[]
  >([]);

  const location = useLocation();
  const path = location.search;
  const { slug, sectionSlug } = useParams();
  const searchQuery = new URLSearchParams(useLocation().search).get("q");

  const [categoriesSlugs, setCategoriesSlugs] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[] | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const isLoadingRef = useRef<boolean>(false);

  const [isResetting, setIsResetting] = useState<boolean>(false);

  const routeKey = useMemo(() => {
    return `${location.pathname}-${slug || ""}-${sectionSlug || ""}-${
      searchQuery || ""
    }`;
  }, [location.pathname, slug, sectionSlug, searchQuery]);

  const prevRouteKeyRef = useRef(routeKey);

  // console.log("routeKey", routeKey);
  console.log("$$categoriesSlugs", categoriesSlugs);
  console.log("$$selectedCategories", selectedCategories);
  useEffect(() => {
    if (prevRouteKeyRef.current !== routeKey) {
      console.log(
        " Route changed from:",
        prevRouteKeyRef.current,
        "to:",
        routeKey
      );

      setIsResetting(true);

      console.log("Clearing all filters and resetting state");
      setPageNumber(0);
      setAllPagesLoaded(false);
      setProducts([]);
      setCategoriesSlugs([]);
      setPriceRange(null);
      setSelectedCategories([]);
      setPageStatus(PageState.IDLE);

      prevRouteKeyRef.current = routeKey;

      setTimeout(() => {
        console.log(" Reset complete, allowing API calls");
        setIsResetting(false);
      }, 10);
    }
  }, [routeKey]);

  useEffect(() => {
    if (!isResetting) {
      console.log("- Fetching data with current state:");
      console.log("- Page:", pageNumber);
      console.log("- Categories:", categoriesSlugs);
      console.log("- Price Range:", priceRange);
      console.log("- Route:", routeKey);

      fetchData();
    } else {
      console.log("Skipping fetch - currently resetting");
    }
  }, [pageNumber, categoriesSlugs, priceRange, isResetting]);

  const fetchData = async () => {
    if (isLoadingRef.current || isResetting) return;
    isLoadingRef.current = true;

    try {
      setPageStatus(PageState.LOADING);
      let response;

      const currentCategoriesSlugs = categoriesSlugs;
      const currentPriceRange = priceRange;

      console.log(" Making API call with:");
      console.log("- targetSlug:", slug || sectionSlug);
      console.log("- categories:", currentCategoriesSlugs);
      console.log("- pageNumber:", pageNumber);

      if (path && searchQuery) {
        const searchRequest: SearchRequest = {
          searchKey: searchQuery,
          categorySlugs:
            currentCategoriesSlugs.length > 0 ? currentCategoriesSlugs : null,
          offset: pageNumber,
          minPrice: priceRange ? priceRange[0] : null,
          maxPrice: priceRange ? priceRange[1] : null,
        };
        // console.log("searchRequest", searchRequest);
        // console.log("searchRequest", priceRange);
        dispatch(fetchMegaSearch(searchRequest));
        return;
      } else if (slug || sectionSlug) {
        const targetSlug = slug || sectionSlug;
        const minPrice = currentPriceRange?.[0] ?? null;
        const maxPrice = currentPriceRange?.[1] ?? null;
        const categories =
          currentCategoriesSlugs.length > 0 ? currentCategoriesSlugs : null;

        response = await getDataWithSectionSlugService(
          targetSlug!,
          pageNumber,
          categories,
          minPrice,
          maxPrice
        );

        console.log("###targetSlug", targetSlug);
        console.log("###categories", categories);
        console.log("###minPrice", minPrice);
        console.log("###maxPrice", maxPrice);
        console.log("### pageNum,", pageNumber);
      } else {
        response = await getAllProductsService(pageNumber);
      }

      console.log("$$$response", response.content);

      if (response && !response.errorPresent) {
        const newProducts = response.content.records || [];

        setProducts((prev) => {
          if (pageNumber > 0) {
            return [...prev, ...newProducts];
          } else {
            return newProducts;
          }
        });

        if (pageNumber >= response.content.totalPages - 1) {
          setAllPagesLoaded(true);
        }

        setPageStatus(PageState.SUCCESS);
      } else {
        setPageStatus(PageState.ERROR);
      }

      if (response === undefined) {
        setProducts([]);
        setPageStatus(PageState.ERROR);
      }
    } catch (error) {
      console.error(" Error fetching data:", error);
      setProducts([]);
      setPageStatus(PageState.ERROR);
    } finally {
      setInfiniteLoading(false);
      isLoadingRef.current = false;
    }
  };

  // useEffect(() => {
  //   dispatch(getDefaultWishlistAsync({ username }));
  // }, [dispatch, username]);

  useEffect(() => {
    setPageStatus(SearchStatus);
    if (
      SearchStatus === PageState.SUCCESS &&
      searchedProducts?.products?.records
    ) {
      const newProducts = searchedProducts.products.records;

      setProducts((prev) => {
        if (pageNumber > 0) {
          return [...prev, ...newProducts];
        } else {
          return newProducts;
        }
      });

      // if (pageNumber >= searchedProducts.products.totalPages - 1) {
      //   setAllPagesLoaded(true);
      // }
    }
  }, [searchedProducts, SearchStatus, pageNumber]);

  useEffect(() => {
    return () => {
      dispatch(cleareSearchData());
    };
  }, [dispatch]);

  const handleSortChange = (event: any) => {
    setSortBy(event.target.value);
  };

  const sortedProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    const productsCopy = [...products];

    switch (sortBy) {
      case "priceLowToHigh":
        return productsCopy.sort((a, b) => a.itemPrice - b.itemPrice);
      case "priceHighToLow":
        return productsCopy.sort((a, b) => b.itemPrice - a.itemPrice);
      case "discountLowToHigh":
        return productsCopy.sort((a, b) => a.itemDiscount - b.itemDiscount);
      case "discountHighToLow":
        return productsCopy.sort((a, b) => b.itemDiscount - a.itemDiscount);
      default:
        return productsCopy;
    }
  }, [products, sortBy]);

  const handleRemoveCategory = (categorySlug: string) => {
    const updatedCategories = selectedCategories.filter(
      (each) => each.slug !== categorySlug
    );
    const mapedData: string[] = updatedCategories.map((each) => each.slug);

    console.log(" Removing category:", categorySlug);
    console.log("Updated categories:", mapedData);

    setSelectedCategories(updatedCategories);
    setCategoriesSlugs(mapedData);
    setAllPagesLoaded(false);
  };

  const handleClearAllFilters = () => {
    console.log("Clearing all filters");
    setSelectedCategories([]);
    setCategoriesSlugs([]);
    setPriceRange(null);
    setAllPagesLoaded(false);
  };

  const title = (slug || sectionSlug)
    ?.split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: { xs: 0, md: 0 },
        px: 0,
        paddingLeft: { xs: "0px !important", md: "10px !important" },
        paddingRight: { xs: "0px !important", md: "10px !important" },
      }}
    >
      <Grid
        container
        sx={{ width: "100% important" }}
        spacing={{ xs: 0, md: 2 }}
      >
        <Grid item xs={12} md={3}>
          <Box
            sx={{
              position: "sticky",
              top: "130px",
              borderRight: "1px solid #F1EAE4",
              paddingRight: "16px",
            }}
          >
            <Box>
              <Typography
                className="text-start"
                sx={{
                  fontWeight: 400,
                  fontSize: { xs: "20px", md: "22px" },
                  color: "success.light",
                  mb: { xs: 1.5, md: 2 },
                  px: { xs: 0.5, md: 0 },
                }}
              >
                {title || "All Products"} (
                {products && products.length > 0 ? products.length : 0})
              </Typography>
            </Box>

            <Box className="d-none d-lg-block">
              {selectedCategories.length > 0 && (
                <Box
                  className="mt-2 mb-2"
                  display="flex"
                  flexWrap="wrap"
                  gap={1}
                  alignItems="center"
                >
                  {selectedCategories.map((category, index) => (
                    <Box
                      key={index}
                      className="d-flex flex-row justify-content-between align-items-center"
                    >
                      <Typography
                        sx={{
                          fontWeight: 400,
                          fontSize: "14px",
                          color: "success.light",
                          bgcolor: "info.main",
                          borderRadius: 2,
                          px: 1,
                          py: 0.5,
                        }}
                      >
                        {category.title}{" "}
                        <ClearIcon
                          fontSize="small"
                          sx={{
                            color: "error.main",
                            textTransform: "none",
                            fontSize: "16px",
                            ms: 3,
                            cursor: "pointer",
                          }}
                          onClick={() => handleRemoveCategory(category.slug)}
                        />
                      </Typography>
                    </Box>
                  ))}

                  <Button
                    sx={{
                      color: "error.main",
                      textTransform: "none",
                      fontSize: "14px",
                    }}
                    onClick={handleClearAllFilters}
                  >
                    Clear All
                  </Button>
                </Box>
              )}

              <Divider sx={{ mb: 1, borderColor: "success.light" }} />

              <Filters
                setProducts={setProducts}
                setPageStatus={setPageStatus}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                pageNumber={pageNumber}
                setIsfilteredData={() => {}}
                setAllPagesLoaded={setAllPagesLoaded}
                priceRange={priceRange ?? [0, 0]}
                setPriceRange={setPriceRange}
                setCategoriesSlugs={setCategoriesSlugs}
                categoriesSlugs={categoriesSlugs}
                setPageNumber={setPageNumber}
              />
            </Box>
          </Box>
        </Grid>

        {pageStatus === PageState.LOADING && pageNumber === 0 && (
          <Grid item xs={12} md={9}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "80vh",
              }}
            >
              <CircularProgress />
            </Box>
          </Grid>
        )}

        {pageStatus === PageState.ERROR && (
          <Grid item xs={12} md={9}>
            <ProductNotFoundPage />
          </Grid>
        )}

        {(pageStatus === PageState.SUCCESS ||
          (pageStatus === PageState.LOADING && pageNumber > 0)) && (
          <Grid item xs={12} className="hide-scrollbar" md={9}>
            <Box>
              <Box
                sx={{
                  bgcolor: "white",
                  height: "35px",
                  mb: 2,
                  borderRadius: "5px",
                  paddingLeft: { xs: "3px !important", md: "0px !important" },
                  paddingRight: { xs: "3px !important", md: "0px !important" },
                }}
              >
                <Box className="d-flex flex-row justify-content-between justify-content-lg-end align-items-center">
                  <Box
                    sx={{
                      backgroundColor: "transparent",
                      height: "35px",
                      borderRadius: "5px",
                      mb: 0,
                    }}
                    className="d-block d-lg-none"
                  >
                    <Button
                      variant="outlined"
                      sx={{
                        textTransform: "none",
                        border: "1px solid",
                        borderColor: "success.light",
                      }}
                      onClick={() => {
                        dispatch(removeSticky());
                        setIsOpenfilters(true);
                      }}
                    >
                      <Typography
                        sx={{
                          color: "success.light",
                          fontSize: { xs: "0.8rem", md: "1rem" },
                        }}
                      >
                        Filters <FilterListIcon />
                      </Typography>
                    </Button>
                  </Box>
                  <Box
                    sx={{ width: "auto" }}
                    display="flex"
                    alignItems="center"
                    p={0}
                    gap={1}
                  >
                    <Typography
                      className="d-none d-lg-block"
                      sx={{ color: "success.light" }}
                    >
                      Sort by:
                    </Typography>
                    <Select
                      value={sortBy}
                      onChange={handleSortChange}
                      size="small"
                      sx={{
                        fontSize: { xs: "0.8rem", md: "1rem" },
                        color: "success.light",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "success.light",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "success.light",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "success.light",
                        },
                      }}
                    >
                      <MenuItem
                        sx={{
                          color: "success.light",
                          fontSize: { xs: "0.8rem", md: "1rem" },
                        }}
                        value="relevance"
                      >
                        <Box component="span" sx={{ fontWeight: "600" }}>
                          Relevance
                        </Box>
                      </MenuItem>
                      <MenuItem
                        sx={{
                          color: "success.light",
                          fontSize: { xs: "0.8rem", md: "1rem" },
                        }}
                        value="priceLowToHigh"
                      >
                        <Box component="span" sx={{ fontWeight: "600" }}>
                          Price
                        </Box>
                        : Low to High
                      </MenuItem>
                      <MenuItem
                        sx={{
                          color: "success.light",
                          fontSize: { xs: "0.8rem", md: "1rem" },
                        }}
                        value="priceHighToLow"
                      >
                        <Box component="span" sx={{ fontWeight: "600" }}>
                          Price
                        </Box>
                        : High to Low
                      </MenuItem>
                      <MenuItem
                        sx={{
                          color: "success.light",
                          fontSize: { xs: "0.8rem", md: "1rem" },
                        }}
                        value="discountLowToHigh"
                      >
                        <Box component="span" sx={{ fontWeight: "600" }}>
                          Discount
                        </Box>
                        : Low to High
                      </MenuItem>
                      <MenuItem
                        sx={{
                          color: "success.light",
                          fontSize: { xs: "0.8rem", md: "1rem" },
                        }}
                        value="discountHighToLow"
                      >
                        <Box component="span" sx={{ fontWeight: "600" }}>
                          Discount
                        </Box>
                        : High to Low
                      </MenuItem>
                    </Select>
                  </Box>
                </Box>
              </Box>
            </Box>

            {sortedProducts.length > 0 ? (
              <Grid container spacing={{ xs: 1, md: 2 }}>
                {sortedProducts.map((product: any, idx: number) => (
                  <Grid item xs={6} key={idx} sm={4} md={6} lg={4}>
                    <ProductCards
                      product={product}
                      setAddItemId={setAddItemId}
                      addItemId={addItemId}
                      activeId={activeId}
                      setActiveId={setActiveId}
                    />
                  </Grid>
                ))}
                {infiniteLoadin && (
                  <Grid item xs={12}>
                    <Box
                      sx={{ height: "80vh" }}
                      display="flex"
                      justifyContent="center"
                      p={2}
                    >
                      <CircularProgress />
                    </Box>
                  </Grid>
                )}
              </Grid>
            ) : (
              <ProductNotFoundPage />
            )}

            <Box>
              {allPagesLoaded && (
                <p className="mt-3">Total items {products.length}</p>
              )}
              {!allPagesLoaded && products.length > 0 && (
                <Button
                  variant="outlined"
                  sx={{ textTransform: "none", borderRadius: "4px" }}
                  className="bestSeller-button mt-2 mt-md-3 px-3 px-md-4 py-1 py-md-2 rounded-md"
                  onClick={() => {
                    setPageNumber((prev) => prev + 1);
                    setInfiniteLoading(true);
                  }}
                  disabled={infiniteLoadin}
                >
                  <Typography className="bestSeller-button-text">
                    {infiniteLoadin ? "Loading..." : "Show More"}
                  </Typography>
                </Button>
              )}
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Mobile Filter Drawer */}
      <Box className="d-block d-lg-none">
        <Drawer
          placement={"right"}
          open={isMobileOrTablet ? isOpenfilters : false}
          width={400}
          className="custom-drawer p-3"
          style={{ zIndex: 1050, position: "absolute" }}
          closable={false}
        >
          <Box sx={{ position: "relative", backgroundColor: "white" }}>
            <Box className="d-flex flex-row justify-content-between align-items-start mb-3">
              <Typography
                className="text-start"
                sx={{
                  fontWeight: 400,
                  fontSize: "22px",
                  color: "success.light",
                  mb: { xs: 1.5, md: 2 },
                }}
              >
                {title || "All Products"} (
                {products && products.length > 0 ? products.length : 0})
              </Typography>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => {
                  setIsOpenfilters(false);
                  dispatch(addSticky());
                }}
              ></button>
            </Box>
          </Box>

          <Box className="d-block d-lg-none">
            {selectedCategories.length > 0 && (
              <Box
                className="mt-2 mb-2"
                display="flex"
                flexWrap="wrap"
                gap={1}
                alignItems="center"
              >
                {selectedCategories.map((category, index) => (
                  <Box
                    key={index}
                    className="d-flex flex-row justify-content-between align-items-center"
                  >
                    <Typography
                      sx={{
                        fontWeight: 400,
                        fontSize: "14px",
                        color: "success.light",
                        bgcolor: "info.main",
                        borderRadius: 2,
                        px: 1,
                        py: 0.5,
                      }}
                    >
                      {category.title}{" "}
                      <ClearIcon
                        fontSize="small"
                        sx={{
                          color: "error.main",
                          textTransform: "none",
                          fontSize: "16px",
                          ms: 3,
                          cursor: "pointer",
                        }}
                        onClick={() => handleRemoveCategory(category.slug)}
                      />
                    </Typography>
                  </Box>
                ))}

                <Button
                  sx={{
                    color: "error.main",
                    textTransform: "none",
                    fontSize: "14px",
                  }}
                  onClick={handleClearAllFilters}
                >
                  Clear All
                </Button>
              </Box>
            )}

            <Divider sx={{ mb: 1, borderColor: "success.light" }} />

            <Filters
              setProducts={setProducts}
              setPageStatus={setPageStatus}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              pageNumber={pageNumber}
              setIsfilteredData={() => {}}
              setAllPagesLoaded={setAllPagesLoaded}
              priceRange={priceRange ?? [0, 0]}
              setPriceRange={setPriceRange}
              setCategoriesSlugs={setCategoriesSlugs}
              categoriesSlugs={categoriesSlugs}
              setPageNumber={setPageNumber}
            />
          </Box>

          <Box
            sx={{ position: "absolute", bottom: 15, backgroundColor: "white" }}
            className="w-75 pt-3 d-flex flex-row justify-content-between align-items-center mt-3"
          >
            <Button
              onClick={() => {
                handleClearAllFilters();
                dispatch(addSticky());
                setIsOpenfilters(false);
              }}
              sx={{
                textDecoration: "none",
                borderRadius: "4px",
              }}
              className="bestSeller-button w-50 me-5"
            >
              <Typography className="bestSeller-button-text">
                Clear All
              </Typography>
            </Button>
            <Button
              onClick={() => {
                dispatch(addSticky());
                setIsOpenfilters(false);
              }}
              sx={{
                textDecoration: "none",
                borderRadius: "4px",
              }}
              className="carousel-button w-50 ms-2"
            >
              <Typography className="carousel-button-text">Apply</Typography>
            </Button>
          </Box>
        </Drawer>
      </Box>
    </Container>
  );
};

export default Products;
