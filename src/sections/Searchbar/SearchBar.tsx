import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Drawer,
  List,
  ListItemText,
  Collapse,
  Badge,
  Avatar,
  InputBase,
  useMediaQuery,
  useTheme,
  Typography,
  ListItemButton,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  ExpandMore,
  ExpandLess,
  Close as CloseIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "../../Redux/store/store";
import HeaderIcon from "../../assets/media/icons/Aurave f_logo 3 green.svg";
import cartIcon from "../../assets/media/icons/BagSvg.svg";
import profile from "../../assets/media/icons/UserSvg.svg";
import WishlistIcon from "../../assets/media/icons/WishlistSvg.svg";
import { styled } from "@mui/material/styles";
import type { Section } from "../header/model/section";
import type { CategoryTree } from "../header/model/categoryTree";
import { StatusType } from "../header/enum/statusType";
import { fetchMegaSearch } from "../../Redux/slices/megaSearchSlice";
import { CategoryTreeById, Serviceuri } from "../header/service/sectionService";
import { SearchRequest } from "./model/searchRequest";
import Header from "../header/header";
import { AvatarUri } from "../Dashboard/profileService/profileService";
import { getCartAsync } from "../../Redux/slices/addToCart";
import { getFlagsAsync } from "../../Redux/slices/flagsSlice";
import { batch } from "react-redux";
import { GetCompanyLogoUri } from "./service/megaSearch";
import ProfileDrawer from "../Dashboard/responsive/profileDrawer";
import { addSticky, removeSticky } from "../../Redux/slices/headerStickyToggle";
import navbarIcon from "../../assets/media/icons/navbarIcon.svg";
import searchIcon from "../../assets/media/icons/Search.svg";
import { retryPaymentTermAsync } from "../../Redux/slices/retryPaymentTerm";
import { returnTermAsync } from "../../Redux/slices/returnTerm";

const SearchBar = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  backgroundColor: theme.palette.info.main,
  padding: "1px 12px",
  borderRadius: "25px",
}));

export const categoryTreeData: CategoryTree[] = [
  {
    id: 1,
    title: "Health & Wellness",
    imageUrl:
      "https://images.unsplash.com/photo-1588776814546-cfeaa1d0f3f5?fit=crop&w=400&q=80",
    slug: "health-wellness",
    level: 0,
    status: StatusType.ACTIVE,
    childCategory: [
      {
        id: 11,
        title: "Fitness",
        imageUrl: "",
        slug: "fitness",
        level: 1,
        status: StatusType.ACTIVE,
        childCategory: [
          {
            id: 111,
            title: "Yoga Mats",
            imageUrl: "",
            slug: "yoga-mats",
            level: 2,
            status: StatusType.ACTIVE,
            childCategory: [],
          },
        ],
      },
      {
        id: 12,
        title: "Supplements",
        imageUrl: "",
        slug: "supplements",
        level: 1,
        status: StatusType.ACTIVE,
        childCategory: [],
      },
    ],
  },
  {
    id: 2,
    title: "Personal Care",
    imageUrl:
      "https://images.unsplash.com/photo-1613323593659-11fb387fe8cf?fit=crop&w=400&q=80",
    slug: "personal-care",
    level: 0,
    status: StatusType.ACTIVE,
    childCategory: [
      {
        id: 21,
        title: "Skin Care",
        imageUrl: "",
        slug: "skin-care",
        level: 1,
        status: StatusType.ACTIVE,
        childCategory: [],
      },
      {
        id: 22,
        title: "Hair Care",
        imageUrl: "",
        slug: "hair-care",
        level: 1,
        status: StatusType.ACTIVE,
        childCategory: [],
      },
    ],
  },
  {
    id: 3,
    title: "Medicines",
    imageUrl:
      "https://images.unsplash.com/photo-1603398938378-3a3b0da2b86c?fit=crop&w=400&q=80",
    slug: "medicines",
    level: 0,
    status: StatusType.ACTIVE,
    childCategory: [
      {
        id: 31,
        title: "Cold & Cough",
        imageUrl: "",
        slug: "cold-cough",
        level: 1,
        status: StatusType.ACTIVE,
        childCategory: [],
      },
      {
        id: 32,
        title: "Pain Relief",
        imageUrl: "",
        slug: "pain-relief",
        level: 1,
        status: StatusType.ACTIVE,
        childCategory: [],
      },
    ],
  },
];

const exceptHeaderList = ["About Us"];

const SearchBarSection = () => {
  // const { data: sections, isLoading, error } = useFetch<Section[]>(Serviceuri);
  // const {
  //   data: logoUrl,
  //   isLoading: isLogoLoading,
  //   error: logoError,
  // } = useFetch<string>(GetCompanyLogoUri);
  // console.log("logoUrl", logoUrl);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down("md")); // true for mobile (<600px) and tablet (600px–899.95px)

  const [categoryTree, SetcategoryTree] = useState<any | null>(
    categoryTreeData
  );

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const [expandedSubCategory, setExpandedSubCategory] = useState<number | null>(
    null
  );
  const [searchValue, setSearchValue] = useState("");
  const [focus, setFocus] = useState<boolean>(false);

  const cartItemCount = useSelector(
    (state: RootState) => state.cart.cart.totalQty
  );
  // const { avatarUrl, isCleared } = useSelector(
  //   (state: RootState) => state.avatar
  // );
  const username = useSelector((store: RootState) => store.jwtToken.username);

  // const { data: imageUrlOnLoad } = useFetchByQuery<string>(AvatarUri, {
  //   username,
  // });

  let avatorImg: any;

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  // useEffect(() => {
  //   batch(() => {
  // dispatch(getCartAsync({ username: username }));
  // dispatch(getFlagsAsync());
  // dispatch(retryPaymentTermAsync());
  // dispatch(returnTermAsync());
  //   });
  // }, [dispatch, username]);

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
  };

  const handleCategoryClick = (categoryId: number) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    setExpandedSubCategory(null);
  };

  const handleSubCategoryClick = (subCategoryId: number) => {
    setExpandedSubCategory(
      expandedSubCategory === subCategoryId ? null : subCategoryId
    );
  };

  const handleCartClick = () => {
    navigate("/cart/bag");
    setDrawerOpen(false);
  };

  const handleWishlistClick = () => {
    navigate("/overview/wishlist");

    // const loginResponseData = JSON.parse(
    //   localStorage.getItem("loginResponse") || "{}"
    // );

    // if (loginResponseData.username && loginResponseData.isCustomerExist) {
    //   navigate("/overview/wishlist");
    //   setDrawerOpen(false);
    // } else {
    //   navigate("/login");
    //   setDrawerOpen(false);
    // }
  };

  const getcategotyTree = async (section: Section) => {
    // setActiveSection(section.id);
    try {
      console.log("sectionId =>", section.id);
      // SetcategoryTree(null);
      // const response = await CategoryTreeById(section.id);
      // if (!response.errorPresent) {
      //   console.log("response in component", response);
      //   SetcategoryTree(response.content.categoryTree);
      //   // setCategoryChild(null);
      // }
    } catch (err) {
      console.log(err);
    }
  };

  const handleProfileClick = () => {
    navigate("/overview");
    // const loginResponseData = JSON.parse(
    //   localStorage.getItem("loginResponse") || "{}"
    // );

    // if (loginResponseData.username && loginResponseData.isCustomerExist) {
    //   navigate("/overview");
    // } else {
    //   navigate("/login");
    // }
    // setDrawerOpen(false);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (event.target.value.trim()) {
      setFocus(true);
    }
    setSearchValue(event.target.value);
  };

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      if (searchValue.trim()) {
        const value22: SearchRequest = {
          searchKey: searchValue,
        };
        setFocus(false);
        setSearchOpen(false);
        // dispatch(fetchMegaSearch(value22 as SearchRequest));
        setSearchValue("");
        navigate(`/products/?q=${searchValue}`);
      }
    }
  };

  const handleClearSearch = () => {
    setSearchValue("");
  };

  const handleCategoryNavigate = (slug: string) => {
    navigate(`/collection/${slug}`);
    setDrawerOpen(false);
  };

  const [mobiledrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleProfileResponsiveClick = () => {
    const loginResponseData = JSON.parse(
      localStorage.getItem("loginResponse") || "{}"
    );

    if (loginResponseData.username && loginResponseData.isCustomerExist) {
      if (isMobileOrTablet) {
        setMobileDrawerOpen(true); // Only open drawer on mobile/tablet
      } else {
        navigate("/overview"); // Navigate only on desktop
      }
    } else {
      navigate("/login"); // Always navigate if not logged in
    }

    // dispatch(removeSticky());
  };

  return (
    <Box sx={{ container: "xl" }}>
      <AppBar
        sx={{ position: "static", boxShadow: "none", backgroundColor: "#fff" }}
      >
        <Toolbar
          // sx={{
          //   display: "flex",
          //   justifyContent: "space-between",
          // }}
          className=" w-100 d-flex flex-row justify-content-between align-items-center"
        >
          {/* Mobile Menu Icon */}
          <Box>
            {(isMobile || isTablet) && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleDrawerToggle}
                sx={{ color: (theme) => theme.palette.success.main, pr: 0 }}
              >
                <Box
                  component="img"
                  src={navbarIcon}
                  alt="logo"
                  sx={{
                    height: { xs: "32px", sm: "40px", md: "48px" },
                    width: { xs: "auto", sm: "auto", md: "auto" },
                    p: { xs: 0.1, sm: 0.75, md: 1 },
                  }}
                />
              </IconButton>
            )}

            {/* Logo */}
            {
              <Link to="/" style={{ textDecoration: "none", color: "#000" }}>
                <Typography
                  sx={{
                    color: (theme) => theme.palette.success.main,
                    fontSize: "30px",

                    fontWeight: 600,
                    "&:hover": {
                      color: (theme) => theme.palette.success.main,
                    },
                  }}
                >
                  RxHMS
                </Typography>
              </Link>
            }
          </Box>

          {/* Desktop Navigation */}
          {/* {!isMobile && !isTablet && !searchOpen && (
            <Box sx={{ display: "flex", justifyContent: "center", flex: 1 }}>
              {sections?.map((section) => (
                <Box key={section.id} sx={{ mx: 2 }}>
                  <Link
                    to={`/section/${section?.slug.trim().replace(/\s+/g, "")}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Typography
                      sx={{
                        color: (theme) => theme.palette.info.dark,
                        textTransform: "uppercase",
                        fontWeight: 700,
                        "&:hover": {
                          color: (theme) => theme.palette.success.main,
                        },
                      }}
                    >
                      {section?.title}
                    </Typography>
                  </Link>
                </Box>
              ))}
            </Box>
          )} */}

          {!focus && !isMobile && !isTablet && !searchOpen && (
            <Header isLoading={false} />
          )}

          {/* {!focus && !isMobile && (
            <Header sections={sections} isLoading={isLoading} error={error} />
          )} */}

          {/* Search Bar - Tablet & Desktop */}
          {!isMobile && (
            <SearchBar
              sx={{
                width: { sm: "50%", md: focus ? "70%" : "21%" },
                ml: 2,
                mr: { xs: 0, md: 2 },
                color: (theme) => theme.palette.success.main,
                backgroundColor: (theme) => theme.palette.info.main,
              }}
            >
              {/* <SearchIcon
                sx={{ color: (theme) => theme.palette.success.main }}
              /> */}

              <Box
                component="img"
                src={searchIcon}
                alt="logo"
                sx={{
                  height: { xs: "35px" },
                  width: { xs: "auto", sm: "auto", md: "auto" },
                  p: { xs: 0.3, sm: 0.75, md: 1 },
                  pl: { xs: 0, md: "auto" },
                }}
              />
              <InputBase
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                placeholder="Search..."
                value={searchValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                sx={{
                  fontSize: "16px",
                  marginLeft: { xs: 0.1 },
                  width: "100%",
                  color: (theme) => theme.palette.success.main,
                }}
              />
              {searchValue && (
                <IconButton onClick={handleClearSearch} size="small">
                  <CloseIcon
                    sx={{
                      color: (theme) => theme.palette.success.main,
                      fontSize: "16px",
                    }}
                  />
                </IconButton>
              )}
            </SearchBar>
          )}

          {/* Action Icons */}
          <Box
            sx={{
              display: "flex",
              alignItems: "between",
              mr: { xs: 0, sm: 3 },
              gap: { xs: 0.1, sm: 1 },
            }}
          >
            {/* Mobile Search Icon */}
            {isMobile && !searchOpen && (
              <IconButton
                onClick={handleSearchToggle}
                sx={{
                  color: (theme) => theme.palette.success.main,
                  pr: { xs: 0.2, md: 0 },
                }}
              >
                <Box
                  component="img"
                  src={searchIcon}
                  alt="logo"
                  sx={{
                    height: { xs: "30px" },
                    width: { xs: "auto", sm: "auto", md: "auto" },
                    p: { xs: 0.6, sm: 0.75, md: 1 },
                    px: { xs: 0, md: "auto" },
                    pr: { xs: 0.5, md: 1 },
                  }}
                />
              </IconButton>
            )}

            {/* <IconButton
              aria-label="wishlist"
              onClick={handleWishlistClick}
              sx={{ width: "auto" }}
            >
              <Avatar
                sx={{
                  p: 0.4,
                  width: { xs: 30, md: 30 },
                  height: { xs: 30, md: 30 },
                  bgcolor: "transparent",
                }}
              >
                <img
                  className="w-100"
                  src={WishlistIcon || "/placeholder.svg"}
                  alt="wishlist"
                />
              </Avatar>
            </IconButton>

            <IconButton
              onClick={
                isMobileOrTablet
                  ? handleProfileResponsiveClick
                  : handleProfileClick
              }
              sx={{ width: "auto", p: 0.3 }}
            >
              <Avatar
                src={avatarUrl || imageUrlOnLoad || undefined}
                alt="User Profile"
                sx={{
                  bgcolor: "transparent",
                  width: { xs: 30, md: 30 },
                  height: { xs: 30, md: 30 },
                }}
              >
                {!avatarUrl && (
                  <img
                    className="w-100 p-1"
                    src={profile || "/placeholder.svg"}
                    alt="profile"
                  />
                )}
              </Avatar>
            </IconButton>

            <IconButton
              aria-label="cart"
              onClick={handleCartClick}
              sx={{ width: "auto", p: 0.3 }}
            >
              <Box
                sx={{
                  // backgroundColor: "success.main",
                  height: { xs: 30, md: 30 },
                  width: { xs: 30, md: 30 },
                  p: 0,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Badge color="secondary" badgeContent={cartItemCount}>
                  <img src={cartIcon || "/placeholder.svg"} alt="cartIcon" />
                </Badge>
              </Box>
            </IconButton> */}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 0.5, md: 1 },
              }}
            >
              {/* Wishlist Icon */}
              <IconButton
                aria-label="wishlist"
                onClick={handleWishlistClick}
                sx={{
                  padding: { xs: 0.8, md: 1 },
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: { xs: 30, md: 30 },
                    height: { xs: 30, md: 30 },
                    bgcolor: "transparent",
                    p: 0,
                    "& img": {
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    },
                  }}
                >
                  <img
                    src={WishlistIcon || "/placeholder.svg"}
                    alt="wishlist"
                    style={{ width: "100%", height: "100%" }}
                  />
                </Avatar>
              </IconButton>

              {/* Profile Icon */}

              <IconButton
                onClick={
                  isMobileOrTablet
                    ? handleProfileResponsiveClick
                    : handleProfileClick
                }
                sx={{ width: "auto", p: 0.3 }}
              >
                <Avatar
                  src={avatorImg}
                  alt="User Profile"
                  sx={{
                    bgcolor: "transparent",
                    width: { xs: 30, md: 30 },
                    height: { xs: 30, md: 30 },
                  }}
                >
                  {
                    // <img
                    //   className="w-100 p-1"
                    //   src={profile || "/placeholder.svg"}
                    //   alt="profile"
                    // />
                    <Avatar
                      src={profile || undefined}
                      alt="User Profile"
                      sx={{
                        bgcolor: "transparent",
                        width: { xs: 30, md: 30 },
                        height: { xs: 30, md: 30 },
                        p: 0,
                        "& img": {
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        },
                      }}
                    >
                      <img
                        src={profile || "/placeholder.svg"}
                        alt="profile"
                        style={{ width: "100%", height: "100%" }}
                      />
                    </Avatar>
                  }
                </Avatar>
              </IconButton>

              {/* Cart Icon */}
              <IconButton
                aria-label="cart"
                onClick={handleCartClick}
                sx={{
                  padding: { xs: 0.8, md: 1 },
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <Box
                  sx={{
                    height: { xs: 30, md: 30 },
                    width: { xs: 30, md: 30 },
                    p: 0!,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "& img": {
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    },
                  }}
                >
                  <Badge
                    color="secondary"
                    badgeContent={cartItemCount}
                    sx={{
                      "& .MuiBadge-badge": {
                        fontSize: "0.7rem",
                        height: "18px",
                        minWidth: "18px",
                        padding: "0 0 !important",
                      },
                    }}
                  >
                    <Avatar
                      src={cartIcon || undefined}
                      alt="User Profile"
                      sx={{
                        bgcolor: "transparent",
                        width: { xs: 30, md: 30 },
                        height: { xs: 30, md: 30 },
                        p: 0,
                        "& img": {
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        },
                      }}
                    >
                      <img
                        src={cartIcon || "/placeholder.svg"}
                        alt="profile"
                        style={{ width: "100%", height: "100%" }}
                      />
                    </Avatar>
                    {/* <img
                      src={cartIcon || "/placeholder.svg"}
                      alt="cartIcon"
                      style={{ width: "100%", height: "100%" }}
                    /> */}
                  </Badge>
                </Box>
              </IconButton>
            </Box>
          </Box>
        </Toolbar>

        {/* Mobile Search Bar */}
        {isMobile && searchOpen && (
          <Box sx={{ p: 1, backgroundColor: "#fff" }}>
            <SearchBar
              sx={{
                width: "100%",
                color: (theme) => theme.palette.success.main,
                backgroundColor: (theme) => theme.palette.info.main,
              }}
            >
              <Box
                component="img"
                src={searchIcon}
                alt="logo"
                sx={{
                  height: { xs: "32px" },
                  width: { xs: "auto", sm: "auto", md: "auto" },
                  p: { xs: 0.6, sm: 0.75, md: 1 },
                  pl: { xs: 0, md: "auto" },
                }}
              />
              <InputBase
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                placeholder="Search..."
                value={searchValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                autoFocus
                sx={{
                  fontSize: "16px",
                  marginLeft: 1,
                  width: "100%",
                  color: (theme) => theme.palette.success.main,
                }}
              />
              {searchValue ? (
                <IconButton onClick={handleClearSearch} size="small">
                  <CloseIcon
                    sx={{
                      color: (theme) => theme.palette.success.main,
                      fontSize: "16px",
                    }}
                  />
                </IconButton>
              ) : (
                <IconButton onClick={handleSearchToggle} size="small">
                  <CloseIcon
                    sx={{
                      color: (theme) => theme.palette.success.main,
                      fontSize: "16px",
                    }}
                  />
                </IconButton>
              )}
            </SearchBar>
          </Box>
        )}
      </AppBar>

      {/* Mobile Category Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
        {/* {categoryDrawer} */}
        <Box sx={{ width: 300, p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: (theme) => theme.palette.success.main }}
            >
              Category
            </Typography>
            <IconButton onClick={handleDrawerToggle}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* <List disablePadding>
            {sections?.map((section) => (
              <React.Fragment key={section.id}>
                <ListItemButton
                  sx={{
                    py: 1.5,
                    borderBottom: "1px solid #eee",
                    color: (theme) =>
                      expandedCategory === section.id
                        ? theme.palette.success.main
                        : theme.palette.info.dark,
                  }}
                >
                  {exceptHeaderList.includes(section.title) ? (
                    <>
                      <Link
                        to={`/${section?.slug}`}
                        onClick={handleDrawerToggle}
                      >
                        <ListItemText primary={section.title} />
                      </Link>
                    </>
                  ) : (
                    <>
                      <ListItemText
                        primary={section?.title}
                        onClick={() => {
                          navigate(`/section/${section?.slug}`);
                          handleDrawerToggle();
                        }}
                      />
                      {expandedCategory === section.id ? (
                        <ExpandLess
                          onClick={(e) => {
                            handleCategoryClick(section.id);
                            getcategotyTree(section);
                          }}
                        />
                      ) : (
                        <ExpandMore
                          onClick={(e) => {
                            handleCategoryClick(section.id);
                            getcategotyTree(section);
                          }}
                        />
                      )}
                    </>
                  )}
                </ListItemButton>

                <Collapse
                  in={expandedCategory === section.id}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {categoryTree?.map(
                      (category: CategoryTree) =>
                        category.status === StatusType.ACTIVE && (
                          <React.Fragment key={category.id}>
                            <ListItemButton
                              sx={{ pl: 4 }}
                              // onClick={() => {
                              //   if (category.childCategory?.length) {
                              //     handleSubCategoryClick(category.id); ///// to procusts page
                              //   } else {
                              //     handleCategoryNavigate(category.slug); ///// to procusts page
                              //   }
                              // }}
                            >
                              <ListItemText
                                primary={category.title}
                                onClick={() => {
                                  navigate(`/collection/${category?.slug}`);
                                  handleDrawerToggle();
                                }}
                              />
                              {category.childCategory?.length > 0 &&
                                (expandedSubCategory === category.id ? (
                                  <ExpandLess
                                    onClick={() => {
                                      if (category.childCategory?.length) {
                                        handleSubCategoryClick(category.id); ///// to procusts page
                                      } else {
                                        handleCategoryNavigate(category.slug); ///// to procusts page
                                      }
                                    }}
                                  />
                                ) : (
                                  <ExpandMore
                                    onClick={() => {
                                      if (category.childCategory?.length) {
                                        handleSubCategoryClick(category.id); ///// to procusts page
                                      } else {
                                        handleCategoryNavigate(category.slug); ///// to procusts page
                                      }
                                    }}
                                  />
                                ))}
                            </ListItemButton>

                            {category.childCategory?.length > 0 && (
                              <Collapse
                                in={expandedSubCategory === category.id}
                                timeout="auto"
                                unmountOnExit
                              >
                                <List component="div" disablePadding>
                                  {category.childCategory.map(
                                    (subCategory: CategoryTree) =>
                                      subCategory.status ===
                                        StatusType.ACTIVE && (
                                        <ListItemButton
                                          key={subCategory.id}
                                          sx={{ pl: 6 }}
                                          onClick={() =>
                                            handleCategoryNavigate(
                                              subCategory.slug
                                            )
                                          }
                                        >
                                          <ListItemText
                                            primary={
                                              <Typography
                                                variant="body2"
                                                sx={{
                                                  "&::before": {
                                                    content: '"•"',
                                                    marginRight: "8px",
                                                    color: (theme) =>
                                                      theme.palette.success
                                                        .main,
                                                  },
                                                }}
                                              >
                                                {subCategory.title}
                                              </Typography>
                                            }
                                          />
                                        </ListItemButton>
                                      )
                                  )}
                                </List>
                              </Collapse>
                            )}
                          </React.Fragment>
                        )
                    )}
                  </List>
                </Collapse>
              </React.Fragment>
            ))}
          </List> */}
        </Box>
      </Drawer>
      <ProfileDrawer
        open={mobiledrawerOpen}
        onClose={() => {
          setMobileDrawerOpen(false);
          dispatch(addSticky());
        }}
      />
    </Box>
  );
};

export default SearchBarSection;
