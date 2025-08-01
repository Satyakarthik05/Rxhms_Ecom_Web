"use client";

import React from "react";
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  Paper,
  CircularProgress,
  RadioGroup,
  Radio,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useFetch } from "../../customHooks/useFetch";
import { GET_CATEGORIES } from "./service/service";
import { getFilteredDataService } from "./service/getFilteredData";
import { PageState } from "../../web-constants/constants";
import type { Category } from "../header/model/category";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { getFilterCategoryService } from "./service/getFilterCategoryService";
import type { AppDispatch, RootState } from "../../Redux/store/store";
import { useSelector } from "react-redux";
import type { CategoryFilter } from "./model/categoryFilter";
import { SearchRequest } from "../Searchbar/model/searchRequest";
import { fetchMegaSearch } from "../../Redux/slices/megaSearchSlice";
import { useDispatch } from "react-redux";
import { Tune } from "@mui/icons-material";
import { getCategoriesWithSectionService } from "./service/getCategoriesWithSectionService";
import { getPriceRangeWithSectionService } from "./service/getPriceRangeWithSectionService";
import {
  getCategoriesWithCategoryService,
  getPriceRangeWithCategoryService,
} from "./service/getCategoriesWithCategoryService";
import { getDataWithSectionSlugService } from "./service/getDataBySectionService";
import { ProductCard } from "./model/productCard";

// const categories = ["Skincare", "Haircare", "Body Care", "Bath & Shower"];
// const brands = ["Brand A", "Brand B", "Brand C", "Brand D"];

interface FiltersProps {
  setProducts: Dispatch<SetStateAction<ProductCard[]>>;
  setPageStatus: Dispatch<SetStateAction<PageState>>;
  setIsfilteredData: Dispatch<SetStateAction<boolean>>;
  selectedCategories: CategoryFilter[];
  setSelectedCategories: Dispatch<SetStateAction<CategoryFilter[]>>;
  pageNumber: number;
  setAllPagesLoaded: Dispatch<SetStateAction<boolean>>;
  isDrawer?: boolean;
  setPriceRange: Dispatch<SetStateAction<number[] | null>>;
  priceRange: number[];
  setCategoriesSlugs: Dispatch<SetStateAction<string[]>>;
  categoriesSlugs: string[];
  setPageNumber: Dispatch<SetStateAction<number>>;
}

// const priceOptions = [
//   { label: "All Price", value: [1, 1000] },
//   { label: "Under ₹99", value: [1, 99] },
//   { label: "Under ₹199", value: [1, 199] },
//   { label: "₹200 to ₹300", value: [200, 300] },
//   { label: "₹300 to ₹500", value: [300, 500] },
//   { label: "₹500 to ₹1,000", value: [500, 1000] },
//   // { label: "₹1,000 to ₹10,000", value: [1000, 10000] },
// ];

export const Filters: React.FC<FiltersProps> = ({
  setProducts,
  setPageStatus,
  selectedCategories,
  setSelectedCategories,
  pageNumber,
  setIsfilteredData,
  setAllPagesLoaded,
  isDrawer = false,
  setPriceRange,
  priceRange,
  setCategoriesSlugs,
  categoriesSlugs,
  setPageNumber,
}) => {
  const { data: searchedProducts } = useSelector(
    (state: RootState) => state.megaSearch
  );

  // const [categoriesSlugs, setCategoriesSlugs] = useState<string[]>([]);
  // const [priceRange, setPriceRange] = useState([
  //   searchedProducts.minPrice,
  //   searchedProducts.maxPrice,
  // ]);
  // const [priceRange, setPriceRange] = useState([0, 1000]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>(
    "category"
  );

  const [isDragging, setIsDragging] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const path = location.search;
  const { slug, sectionSlug } = useParams();

  const {
    data: allCategories,
    error,
    isLoading,
  } = useFetch<any[]>(GET_CATEGORIES);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  const isFirstRender = useRef<boolean>(true);
  const prevPriceRange = useRef(priceRange);
  const prevCategoriesIds = useRef<string[]>(categoriesSlugs);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [categories, setCategories] = useState<CategoryFilter[]>([]);
  const [initiaPriceRange, setInitiaPriceRange] = useState<any>({
    minPrice: searchedProducts.minPrice,
    maxPrice: searchedProducts.maxPrice,
  });

  const [displayPriceRange, setDisplayPriceRange] = useState<number[]>([
    initiaPriceRange.minPrice,
    initiaPriceRange.maxPrice,
  ]);

  console.log("categoriesSlugs", categoriesSlugs);
  // console.log("###initiaPriceRange", initiaPriceRange);

  // useEffect(() => {
  //   let searchTerm: any = "";
  //   if (slug || sectionSlug || query) {
  //     searchTerm = query || slug || sectionSlug;

  //     const fetchFilteredCategories = async () => {
  //       try {
  //         console.log("searchTerm", searchTerm);
  //         setSelectedCategories([]);
  //         setCategoriesSlugs([]);
  //         setFilteredCategories([]);
  //         if (searchTerm) {
  //           // const response = await getFilterCategoryService(searchTerm);
  //           // console.log("Filtered categories:", response.data);
  //           // if (!response.errorPresent) {
  //           //   setFilteredCategories(response.content);
  //           // }

  //           const value22: SearchRequest = {
  //             searchKey: searchTerm || slug || sectionSlug,
  //             categorySlugs: categoriesSlugs,
  //             offset: 0,
  //           };
  //           dispatch(fetchMegaSearch(value22 as SearchRequest));
  //         }
  //       } catch (error) {
  //         console.error("Error fetching filtered categories:", error);
  //       }
  //     };

  //     fetchFilteredCategories();
  //   }
  // }, [location.search, slug, sectionSlug, query]);

  const getCategorieswithSectionSlug = async (sectionSlug: string) => {
    try {
      const [response, responseOfPrice] = await Promise.all([
        getCategoriesWithSectionService(sectionSlug),
        getPriceRangeWithSectionService(sectionSlug),
      ]);
      setCategories(response.content);
      setInitiaPriceRange(responseOfPrice.content);
      setDisplayPriceRange([
        responseOfPrice.content.minPrice,
        responseOfPrice.content.maxPrice,
      ]);
    } catch (err) {
      setCategories([]);
      setInitiaPriceRange({
        minPrice: 0,
        maxPrice: 0,
      });
      console.log(err);
    }
  };

  const getCategorieswithCategorySlug = async (categorySlug: string) => {
    try {
      const [response, responseOfPrice] = await Promise.all([
        getCategoriesWithCategoryService(categorySlug),
        getPriceRangeWithCategoryService(categorySlug),
      ]);

      console.log("@#@#@categorySlug", categorySlug, response, responseOfPrice);
      setCategories(response.content);
      setInitiaPriceRange(responseOfPrice.content);
      setDisplayPriceRange([
        responseOfPrice.content.minPrice,
        responseOfPrice.content.maxPrice,
      ]);
    } catch (err) {
      setCategories([]);
      console.log(err);
    }
  };

  useEffect(() => {
    if (slug && !path && !sectionSlug) {
      // getDatawithSlug(slug, pageNumber);
      getCategorieswithCategorySlug(slug);
    }

    // if (!slug && !path && !sectionSlug) {
    //   // getAllProducts(pageNumber);
    //   console.log("########All products");
    // }

    if (!slug && !path && sectionSlug) {
      getCategorieswithSectionSlug(sectionSlug);
    }
  }, [slug, path, sectionSlug]);

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      // setPriceRange(newValue);
      setDisplayPriceRange(newValue);
      setIsDragging(true);
      // Clear any existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    }
  };

  const handleSliderChangeCommitted = (
    event: React.SyntheticEvent | Event,
    newValue: number | number[]
  ) => {
    setIsDragging(false);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      if (
        Array.isArray(newValue) &&
        (newValue[0] !== prevPriceRange.current[0] ||
          newValue[1] !== prevPriceRange.current[1])
      ) {
        prevPriceRange.current = newValue;
        setPriceRange(displayPriceRange);
      }
    }, 500);
  };

  const handleChange = (event: any) => {
    const selected = JSON.parse(event.target.value);
    setDisplayPriceRange(selected);
    setPriceRange(selected);
  };

  console.log("megaSearch/fetchMegaSearch", categoriesSlugs);

  const getFilteredResult = async () => {
    const searchTerm = slug || sectionSlug || query;
    try {
      setPageStatus(PageState.LOADING);
      const request: SearchRequest = {
        searchKey: searchTerm,
        categorySlugs: categoriesSlugs,
        offset: pageNumber,
        pageSize: 9,
      };

      setIsfilteredData(true);
      setAllPagesLoaded(false);
      if (searchTerm) {
        const response = await getDataWithSectionSlugService(
          searchTerm,
          pageNumber,
          categoriesSlugs
        );
        console.log("filterd Data #Log ", response.content);
      }
      if (path) {
        dispatch(fetchMegaSearch(request as SearchRequest));
      }

      setPageStatus(PageState.SUCCESS);
      console.log("filteredProducts :>");
    } catch (err) {
      setPageStatus(PageState.ERROR);
      console.log(err);
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevCategoriesIds.current = categoriesSlugs;
      prevPriceRange.current = priceRange;
      return;
    }
    const categoriesChanged =
      JSON.stringify(prevCategoriesIds.current) !==
      JSON.stringify(categoriesSlugs);

    const priceChanged =
      !isDragging &&
      JSON.stringify(prevPriceRange.current) !== JSON.stringify(priceRange);

    if (categoriesChanged || (priceChanged && !isDragging)) {
      prevCategoriesIds.current = categoriesSlugs;
      if (!isDragging) {
        prevPriceRange.current = priceRange;
      }
      getFilteredResult();
    }
  }, [categoriesSlugs, priceRange, isDragging]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (searchedProducts.categories) {
      setCategories(searchedProducts.categories);
    } else {
      setCategories([]);
    }
  }, [searchedProducts]);

  const handleCategoryChange = (
    category: CategoryFilter,
    isChecked: boolean
  ) => {
    if (isChecked) {
      setSelectedCategories((prev) => [...prev, category]);
    } else {
      setSelectedCategories((prev) =>
        prev.filter((item) => item.slug !== category.slug)
      );
    }
  };

  const handleFilter = (slug: string, isChecked: boolean) => {
    if (isChecked) {
      // Add slug to the list when checked
      setCategoriesSlugs((prev) => [...prev, slug]);
    } else {
      // Remove slug from the list when unchecked
      setCategoriesSlugs((prev) => prev.filter((item) => item !== slug));
    }
  };
  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedAccordion(isExpanded ? panel : false);
    };

  console.log("searchedProducts.categories", searchedProducts.categories);
  console.log(
    "minPrice",
    searchedProducts.minPrice || priceRange[0] === 0
      ? initiaPriceRange.minPrice
      : priceRange[0]
  );

  let minPrice;

  if (searchedProducts.minPrice !== undefined) {
    minPrice = searchedProducts.minPrice;
  } else if (priceRange[0] === 0) {
    minPrice = initiaPriceRange.minPrice;
  } else {
    minPrice = priceRange[0];
  }
  let maxPrice;

  if (searchedProducts.maxPrice !== undefined) {
    maxPrice = searchedProducts.maxPrice;
  } else if (priceRange[1] === 0) {
    maxPrice = initiaPriceRange.maxPrice;
  } else {
    maxPrice = priceRange[1];
  }

  console.log("minPriceMax", maxPrice);

  return (
    <>
      {!error ? (
        <Paper
          elevation={0}
          sx={{
            minHeight: { xs: "auto", md: "65vh" },
            backgroundColor: "transparent",
            color: "success.light",
          }}
        >
          {/* <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Filters
          </Typography> */}

          <Accordion
            expanded={isDrawer || expandedAccordion === "category"}
            onChange={handleAccordionChange("category")}
            elevation={0}
            sx={{ backgroundColor: "transparent", color: "success.light" }}
          >
            <AccordionSummary
              expandIcon={!isDrawer && <ExpandMoreIcon />}
              sx={{ px: 0 }}
            >
              <Typography sx={{ fontWeight: 500, color: "success.light" }}>
                Category ( {categories?.length || 0} )
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <FormGroup sx={{ m: 0, p: 0 }}>
                {categories !== null &&
                  categories?.length > 0 &&
                  categories.map((category: CategoryFilter) => (
                    <Box className="d-flex flex-row justify-content-between align-items-center">
                      <FormControlLabel
                        sx={{ m: 0 }}
                        key={category.id}
                        control={
                          <Checkbox
                            size="small"
                            sx={{
                              color: categoriesSlugs.includes(category.slug)
                                ? "success.main"
                                : "info.main",
                              py: 0.8,
                              px: 0.2,
                              pr: 0.9,
                            }}
                            onChange={(e) => {
                              console.log("category.sulg", category.slug);
                              handleFilter(category.slug, e.target.checked);
                              handleCategoryChange(category, e.target.checked);
                            }}
                            checked={categoriesSlugs.includes(category.slug)}
                          />
                        }
                        label={category.title}
                      />
                      <Typography>
                        {/* ({String(category.productCount).padStart(2, "0")}) */}
                        ({category.productCount})
                      </Typography>
                    </Box>
                  ))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>

          {/* <Accordion elevation={0} sx={{ backgroundColor: "transparent" }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
          <Typography sx={{ fontWeight: 500 }}>Brand</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0 }}>
          <FormGroup>
            {brands.map((brand) => (
              <FormControlLabel
                key={brand}
                control={<Checkbox checked={false} size="small" disabled />} // Checkbox is checked as false and disabled
                label={brand}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion> */}

          <Accordion
            expanded={isDrawer || expandedAccordion === "price"}
            onChange={handleAccordionChange("price")}
            elevation={0}
            sx={{ backgroundColor: "transparent" }}
          >
            <AccordionSummary
              expandIcon={!isDrawer && <ExpandMoreIcon />}
              sx={{ px: 0 }}
            >
              <Typography sx={{ fontWeight: 500, color: "success.light" }}>
                Price Range
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Slider
                value={displayPriceRange}
                onChange={handleSliderChange}
                onChangeCommitted={handleSliderChangeCommitted}
                valueLabelDisplay="auto"
                // min={searchedProducts?.minPrice || 0}
                min={searchedProducts?.minPrice || initiaPriceRange.minPrice}
                // max={searchedProducts?.maxPrice || 1000}
                max={searchedProducts?.maxPrice || initiaPriceRange.maxPrice}
                sx={{ mt: 2, p: -1 }}
              />
              <Box
                className="w-100"
                display="flex"
                justifyContent="space-between"
                mt={1}
              >
                <Typography variant="body2" sx={{ bgcolor: "info.main", p: 1 }}>
                  Min price ₹
                  {/* {searchedProducts.minPrice || priceRange[0] === 0
                    ? initiaPriceRange.minPrice
                    : priceRange[0]} */}
                  {minPrice}
                </Typography>
                <Typography sx={{ bgcolor: "info.main", p: 1 }} variant="body2">
                  Max Price ₹ {maxPrice}
                  {/* {searchedProducts.maxPrice || priceRange[1] === 0
                    ? initiaPriceRange.maxPrice
                    : priceRange[1]} */}
                </Typography>
              </Box>

              {/* <Box className="mt-2">
                <RadioGroup
                  sx={{ fontSize: "12px", color: "success.light" }}
                  value={JSON.stringify(priceRange)}
                  onChange={handleChange}
                >
                  {priceOptions.map((option, index) => (
                    <FormControlLabel
                      sx={{ fontSize: "12px" }}
                      key={index}
                      value={
                        option.label === "All Price"
                          ? JSON.stringify([
                              initiaPriceRange.minPrice,
                              initiaPriceRange.maxPrice,
                            ])
                          : JSON.stringify(option.value)
                      }
                      control={
                        <Radio
                          sx={{ py: 0.5, fontSize: "12px" }}
                          color="success"
                        />
                      }
                      label={option.label}
                    />
                  ))}
                </RadioGroup>
              </Box> */}
            </AccordionDetails>
          </Accordion>
        </Paper>
      ) : (
        <Box
          sx={{
            minHeight: "65vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography> Filter not available </Typography>
        </Box>
      )}
      {isLoading && (
        <Box
          sx={{
            height: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </>
  );
};

export default React.memo(Filters);
