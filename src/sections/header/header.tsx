import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  CircularProgress,
  Typography,
  Grid,
  List,
  Link as MuiLink,
  ListItem,
} from "@mui/material";
import { Section } from "./model/section";
import { CategoryTreeById } from "./service/sectionService";
import "./header.css";
import { CategoryTree } from "./model/categoryTree";
import { StatusType } from "./enum/statusType";

const exceptHeaderList = ["About Us"];

interface HeaderProps {
  sections?: Section[] | null;
  isLoading: boolean;
  error?: string | null;
}

export const sections: Section[] = [
  {
    id: 1,
    slug: "pharmacy",
    title: "Pharmacy",
    description: "Medicines and prescriptions",
    fileId: 101,
    imageUrl:
      "https://images.unsplash.com/photo-1603398938378-3a3b0da2b86c?fit=crop&w=900&q=80",
    status: StatusType.ACTIVE,
    childCategory: [
      {
        id: 201,
        title: "Prescription Drugs",
        slug: "prescription-drugs",
        status: StatusType.ACTIVE,
        imageUrl: "",
        level: 1,
        childCategory: [],
      },
    ],
  },
  {
    id: 2,
    slug: "health-supplements",
    title: "Health Supplements",
    description: "Vitamins, minerals, and more",
    fileId: 102,
    imageUrl:
      "https://images.unsplash.com/photo-1595684717313-3e83ef91efad?fit=crop&w=900&q=80",
    status: StatusType.ACTIVE,
    childCategory: [
      {
        id: 202,
        title: "Multivitamins",
        slug: "multivitamins",
        status: StatusType.ACTIVE,
        imageUrl: "",
        level: 1,
        childCategory: [],
      },
    ],
  },
  {
    id: 3,
    slug: "personal-care",
    title: "Personal Care",
    description: "Skin, hair & hygiene",
    fileId: 103,
    imageUrl:
      "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?fit=crop&w=900&q=80",
    status: StatusType.ACTIVE,
    childCategory: [
      {
        id: 203,
        title: "Skin Care",
        slug: "skin-care",
        status: StatusType.ACTIVE,
        imageUrl: "",
        level: 1,
        childCategory: [],
      },
    ],
  },
  {
    id: 4,
    slug: "baby-care",
    title: "Baby Care",
    description: "Essentials for newborns and kids",
    fileId: 104,
    imageUrl:
      "https://images.unsplash.com/photo-1604301933692-3e1372d54a9b?fit=crop&w=900&q=80",
    status: StatusType.ACTIVE,
    childCategory: [
      {
        id: 204,
        title: "Diapers",
        slug: "diapers",
        status: StatusType.ACTIVE,
        imageUrl: "",
        level: 1,
        childCategory: [],
      },
    ],
  },
  {
    id: 5,
    slug: "medical-devices",
    title: "Medical Devices",
    description: "Thermometers, BP monitors, etc.",
    fileId: 105,
    imageUrl:
      "https://images.unsplash.com/photo-1580281657521-5cabe280b8b6?fit=crop&w=900&q=80",
    status: StatusType.ACTIVE,
    childCategory: [
      {
        id: 205,
        title: "Monitoring Devices",
        slug: "monitoring-devices",
        status: StatusType.ACTIVE,
        imageUrl: "",
        level: 1,
        childCategory: [],
      },
    ],
  },
  {
    id: 6,
    slug: "ayurveda",
    title: "Ayurveda",
    description: "Traditional Ayurvedic products",
    fileId: 106,
    imageUrl:
      "https://images.unsplash.com/photo-1613323593659-11fb387fe8cf?fit=crop&w=900&q=80",
    status: StatusType.ACTIVE,
    childCategory: [
      {
        id: 206,
        title: "Herbal Oils",
        slug: "herbal-oils",
        status: StatusType.ACTIVE,
        imageUrl: "",
        level: 1,
        childCategory: [],
      },
    ],
  },
  {
    id: 7,
    slug: "fitness",
    title: "Fitness",
    description: "Sports and energy essentials",
    fileId: 107,
    imageUrl:
      "https://images.unsplash.com/photo-1600180758890-8b06f0bf1f8a?fit=crop&w=900&q=80",
    status: StatusType.ACTIVE,
    childCategory: [
      {
        id: 207,
        title: "Protein Powders",
        slug: "protein-powders",
        status: StatusType.ACTIVE,
        imageUrl: "",
        level: 1,
        childCategory: [],
      },
    ],
  },
];

export const dummyCategory = {
  title: "Medicines",
  categoryTree: [
    {
      id: 101,
      title: "Pain Relief",
      slug: "pain-relief",
      status: "ACTIVE",
      childCategory: [
        {
          id: 201,
          title: "Tablets",
          slug: "pain-tablets",
          status: "ACTIVE",
        },
        {
          id: 202,
          title: "Creams",
          slug: "pain-creams",
          status: "ACTIVE",
        },
      ],
    },
    {
      id: 102,
      title: "Cold & Cough",
      slug: "cold-cough",
      status: "ACTIVE",
      childCategory: [
        {
          id: 203,
          title: "Syrups",
          slug: "cough-syrups",
          status: "ACTIVE",
        },
      ],
    },
  ],
};
export const dummySections = [
  {
    id: 1,
    title: "Medicines",
    slug: "medicines",
    imageUrl:
      "https://images.unsplash.com/photo-1588776814546-cfeaa1d0f3f5?fit=crop&w=900&q=80",
  },
  {
    id: 2,
    title: "Wellness",
    slug: "wellness",
    imageUrl:
      "https://images.unsplash.com/photo-1604537466570-5f574f5a1f4c?fit=crop&w=900&q=80",
  },
  {
    id: 3,
    title: "Diagnostics",
    slug: "diagnostics",
    imageUrl:
      "https://images.unsplash.com/photo-1578496479763-2386a5a5c06a?fit=crop&w=900&q=80",
  },
  {
    id: 4,
    title: "About Us",
    slug: "about-us",
    imageUrl:
      "https://images.unsplash.com/photo-1580281657525-afa27f4bc3bc?fit=crop&w=900&q=80",
  },
];

const Header: React.FC<HeaderProps> = ({ isLoading, error }) => {
  // const { data: sections, isLoading, error } = useFetch<Section[]>(Serviceuri);
  const [category, setSetcategory] = useState<any | null>(dummyCategory);
  const [categoryChild, setCategoryChild] = useState<any | null>(dummyCategory);
  const [headerOpen, setHeaderOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [activeSectionForImage, setActiveSectionForImage] = useState<
    number | null
  >(null);

  const sectionImage = useCallback(() => {
    return sections?.findIndex(
      (section) => section.id === activeSectionForImage
    );
  }, [sections, activeSectionForImage]);

  const activeSectionIdIndex = sectionImage();

  const handleMouseEnter = async (
    event: React.MouseEvent<HTMLElement>,
    section: Section
  ) => {
    setActiveSection(section.id);
    setActiveSectionForImage(section.id);
    // setSetcategory(response.content);

    // try {
    //   setSetcategory(null);
    //   const response = await CategoryTreeById(section.id);
    //   if (!response.errorPresent) {
    //     console.log("response in component", response);
    //     setSetcategory(response.content);
    //     setCategoryChild(null);
    //   }
    // } catch (err) {
    //   console.log(err);
    // }
  };

  if (isLoading) return <CircularProgress />;
  if (error)
    return (
      <Typography className="text-center" color="error">
        Error loading sections
      </Typography>
    );

  console.log("HeaderData", sections);
  console.log("activeSectionIdIndex", activeSectionIdIndex);
  console.log(
    "imgae",
    activeSectionIdIndex !== undefined &&
      sections?.[activeSectionIdIndex]?.imageUrl
  );

  return (
    <Box sx={{ height: "100%", display: { xs: "none", md: "block" } }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#fff",
          // boxShadow: "0px 0px 1px 0px rgba(0, 0, 0, 0.25)",
          boxShadow: "0px 0px 1px 0px rgba(0, 0, 0, 0)",
          // borderBottom: "1px solid #EEF2F6",
        }}
        className={`${activeSection ? "header" : ""}`}
      >
        <div className=" container-fluid-xs">
          <Toolbar>
            <Box
              sx={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
                fontWeight: "bold",
                cursor: "pointer",
                whiteSpace: "nowrap",
                padding: 0,
                maxHeight: "50px",
              }}
            >
              {sections?.map((section) => {
                const activeSec = section.id === activeSection;

                return exceptHeaderList.includes(section?.title) ? (
                  <Box
                    key={section.id}
                    className={`h-100 py-3 mx-sm-0 mx-md-1  mx-lg-1 mx-xl-2 header-item ${
                      activeSec ? "" : ""
                    }`}
                    sx={{ borderBottom: activeSec ? "2px solid #1e2624" : "" }}
                  >
                    <Link
                      className="router-link"
                      key={section.id}
                      style={{ fontWeight: "700", textTransform: "uppercase" }}
                      to={`/${section?.slug.trim().replace(/\s+/g, "")}`}
                    >
                      <Typography
                        onMouseEnter={() => {
                          setActiveSection(null);
                        }}
                        sx={{
                          color: (theme) => theme.palette.success.main,
                          textTransform: "uppercase",
                          transition: "color 0.3s ease",
                          fontSize: { xs: "10px", md: "13px", lg: "15px" },
                          "&:hover": {
                            color: (theme) => theme.palette.success.main,
                          },
                        }}
                      >
                        {section?.title}
                      </Typography>
                    </Link>
                  </Box>
                ) : (
                  <Box
                    key={section.id}
                    className={`h-100 py-3 mx-sm-0 mx-md-1  mx-lg-1 mx-xl-2 header-item ${
                      activeSec ? "" : ""
                    }`}
                    sx={{ borderBottom: activeSec ? "2px solid #1e2624" : "" }}
                  >
                    <Link
                      className="router-link"
                      key={section.id}
                      style={{ fontWeight: "700", textTransform: "uppercase" }}
                      to={`/section/${section?.slug
                        .trim()
                        .replace(/\s+/g, "")}`}
                    >
                      <Typography
                        onMouseEnter={(e) => {
                          handleMouseEnter(e, section);
                          setHeaderOpen(true);
                        }}
                        onClick={() => {
                          setHeaderOpen(false);
                        }}
                        sx={{
                          fontSize: { xs: "10px", md: "13px", lg: "15px" },
                          color: (theme) =>
                            activeSec
                              ? theme.palette.success.main
                              : theme.palette.success.main,
                          textTransform: "uppercase",
                        }}
                        // color="#000"
                      >
                        {section?.title}
                      </Typography>
                    </Link>
                  </Box>
                );
              })}
            </Box>
          </Toolbar>
        </div>
      </AppBar>

      {headerOpen && (
        <Box
          onMouseLeave={() => setActiveSection(null)}
          className="container megamenu pt-0"
        >
          <Box
            className="headerDrawer"
            sx={{
              backgroundColor: (theme) => theme.palette.info.main,
              color: (theme) => theme.palette.success.main,
            }}
          >
            <Grid container spacing={2} sx={{ paddingTop: 0, paddingLeft: 0 }}>
              <Grid
                className="px-5 pt-5 pb-3 pb-sm-3 pt-sm-3"
                item
                xs={12}
                md={6}
                sx={{
                  flex: 1,
                  overflow: "auto",
                  width: "100%",
                  pt: "0 !important",
                  // maxHeight: "30rem",
                  padding: "25rem",
                  height: "26rem",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    mb: 1,
                    fontWeight: "700",
                    color: (theme) => theme.palette.success.main,
                  }}
                  className="pt-5 pt-sm-3"
                >
                  {category?.title || ""}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <List disablePadding>
                      {category?.categoryTree?.length > 0 &&
                        category.categoryTree.map(
                          (each: CategoryTree) =>
                            each.status === StatusType.ACTIVE && (
                              <ListItem key={each.id} disablePadding>
                                <Link
                                  style={{
                                    padding: "4px 0px",
                                  }}
                                  to={`collection/${each.slug}`}
                                  className="router-link"
                                >
                                  <span
                                    className="menuItems"
                                    style={{
                                      width: "auto",
                                      cursor: "pointer",
                                      padding: "4px 0px",
                                    }}
                                    onMouseEnter={() =>
                                      setCategoryChild(each.childCategory)
                                    }
                                    onMouseLeave={() => setActiveSection(null)}
                                    onClick={() => {
                                      setActiveSection(null);
                                      setHeaderOpen(false);
                                    }}
                                  >
                                    {each.title}
                                  </span>
                                </Link>
                              </ListItem>
                            )
                        )}
                    </List>
                  </Grid>

                  {/* Column 2 */}
                  <Grid
                    item
                    xs={6}
                    p={0}
                    sx={{
                      borderLeft: categoryChild ? "1px solid #ddd" : "none",
                    }}
                  >
                    <List disablePadding>
                      {categoryChild?.length > 0 &&
                        categoryChild.map(
                          (each: CategoryTree, index: number) =>
                            each.status === StatusType.ACTIVE && (
                              <ListItem key={index} disablePadding>
                                <Link
                                  onMouseLeave={() => setActiveSection(null)}
                                  onClick={() => {
                                    setActiveSection(null);
                                    setHeaderOpen(false);
                                  }}
                                  style={{
                                    padding: "4px 0px",
                                  }}
                                  to={`collection/${each.slug}`}
                                  className="router-link"
                                >
                                  <span
                                    className="menuItems"
                                    style={{
                                      width: "auto",
                                      cursor: "pointer",
                                      padding: "4px 0px",
                                    }}
                                  >
                                    {each.title}
                                  </span>
                                </Link>

                                {/* <MuiLink
                                  component={Link}
                                  to={`collection/${each.slug}`}
                                  onMouseLeave={() => setActiveSection(null)}
                                  onClick={() => {
                                    setActiveSection(null);
                                    setHeaderOpen(false);
                                  }}
                                  underline="none"
                                  sx={{ padding: "4px 0" }}
                                >
                                  <Typography
                                    variant="body1"
                                    sx={{
                                      width: "auto",
                                      cursor: "pointer",
                                      padding: "4px 0",
                                    }}
                                  >
                                    {each.title}
                                  </Typography>
                                </MuiLink> */}
                              </ListItem>
                            )
                        )}
                    </List>
                  </Grid>
                </Grid>
              </Grid>

              {/* Right Column: Image */}
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  display: {
                    xs: "none",
                    md: "block",
                  },
                  flex: 1,
                  pt: "0 !important",
                  overflow: "hidden",
                  width: "100%",
                  maxHeight: "30rem",
                }}
              >
                {/* <Box
                  component="img"
                  // src={require("../../assets/media/images/carosel 2.png")}
                  src={
                    activeSectionIdIndex
                      ? sections?.[activeSectionIdIndex]?.imageUrl
                      : require("../../assets/media/images/carosel 2.png")
                  }
                  alt="Shop Category"
                  sx={{
                    // height: "400px", // or any height you need
                    background: `linear-gradient(0deg, rgba(51, 79, 62, 0.60) 0%, rgba(51, 79, 62, 0.60) 100%), 
                     url('/path-to-image.jpg') lightgray -0.274px 40.046px / 100.043% 145.458% no-repeat`,
                    backgroundBlendMode: "normal",

                    width: "100%",
                    maxHeight: "100%",
                    objectFit: "cover",
                    borderBottomRightRadius: "4px",
                  }}
                /> */}
                <Box
                  sx={{
                    height: "26rem",
                    width: "100%",
                    background: `linear-gradient(
                      0deg,
                      rgba(51, 79, 62, 0.60) 0%,
                      rgba(51, 79, 62, 0.60) 100%
                    ), url(${
                      activeSectionIdIndex !== undefined
                        ? sections?.[activeSectionIdIndex]?.imageUrl
                        : require("../../assets/media/images/carosel 2.png")
                    }) lightgray -0.274px 40.046px / 100.043% 145.458% no-repeat`,
                    backgroundBlendMode: "normal",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderBottomRightRadius: "4px",
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Header;
