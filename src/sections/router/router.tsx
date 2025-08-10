import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../../layout/mainLayout";
import { ScroolTop } from "../../utils/scroolTop";
import { Home } from "../../pages/home/home";

import { PageNotFound } from "../../pages/pageNotFound/pageNotFound";
// import Checkout from "../myCart/checkout";
import ForgotPasswordPage from "../../pages/forgotPasswordPage/forgotPassword";
import RegisterPage from "../../pages/registerPage/registerPage";
import LoginPage from "../../pages/login/loginPage";
import SectionProductsPage from "../../pages/sectionProductsPage/sectionProductsPage";
import SearchProductsPage from "../../pages/searchProductsPage/searchProductsPage";
import CategoryProductsPage from "../../pages/collectionProductsPage/collectionProductsPage";
import ProductReviewsPage from "../../pages/productReviewspage/productReviewsPage";
import ProductReviewGalleryPage from "../../pages/ProductReviewGalleryPage/ProductReviewGalleryPage";
import MyCartPage from "../../pages/myCartPage/myCartPage";
// import CheckoutPage from "../../pages/checkoutPage.tsx/checkoutPage";
import OrderSummaryPage from "../../pages/ordersummaryPage/ordersummaryPage";
import AboutUsPage from "../../pages/aboutUs/aboutUsPage";

import TiketPage from "../../pages/tiket/tiketPage";
import TiketDetailsPage from "../../pages/tiketDetails/tiketDetailsPage";
import OverViewPage from "../../pages/overview/overviewPage";
import { ProfilePage } from "../../pages/profile/profilePage";
import MyOrdersPage from "../../pages/myOrders/myOrdersPage";
import MyWishlistPage from "../../pages/myWishlist/myWishlistPage";
import TrackOrderPage from "../../pages/trackOrder/trackOrderPage";
import OrderReturnPage from "../../pages/orderReturns/orderReturnPage";
import ProtectedRoute from "../../utils/ProtectedRoute";
import SidebarLayout from "../Dashboard/sidebarLayout";
import WelcomeScreen from "../../nric_modules/WelcomeScreen";

export const RouterSection = createBrowserRouter([
  {
    path: "/",
    element: (
      <ScroolTop>
        <WelcomeScreen />
      </ScroolTop>
    ),
    children: [
      { index: true, element: <Home /> },

      { path: "/section/", element: <Home /> },
      // { path: "/about-us", element: <AboutUsPage /> },
      // { path: "/contact-us", element: <ContactPage /> },
      // { path: "/faq", element: <FaqPage /> },
      // { path: "/terms-and-conditions", element: <TermsAndConditionsPage /> },

      // {
      //   path: "/overview/view-tickets",
      //   element: (
      //     <ProtectedRoute>
      //       <TiketPage />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: "/overview/view-tickets/:ticketId",
      //   element: (
      //     <ProtectedRoute>
      //       <TiketDetailsPage />
      //     </ProtectedRoute>
      //   ),
      // },

      {
        path: "/overview",
        element: <SidebarLayout />,
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute>
                {/* <OverViewPage /> */}
                <PageNotFound />
              </ProtectedRoute>
            ),
          },
          {
            path: "profile",
            element: (
              <ProtectedRoute>
                {/* <ProfilePage /> */}
                <PageNotFound />
              </ProtectedRoute>
            ),
          },
          {
            path: "orders",
            element: (
              <ProtectedRoute>
                {/* <MyOrdersPage /> */}
                <PageNotFound />
              </ProtectedRoute>
            ),
          },
          {
            path: "wishlist",
            element: (
              <ProtectedRoute>
                {/* <MyWishlistPage /> */}
                <PageNotFound />
              </ProtectedRoute>
            ),
          },
          {
            path: "help",
            element: (
              <ProtectedRoute>
                <PageNotFound />
                {/* <HelpSection /> */}
              </ProtectedRoute>
            ),
          },
          {
            path: "consultations",
            element: (
              <ProtectedRoute>
                <PageNotFound />
              </ProtectedRoute>
            ),
          },
          {
            path: "health-records",
            element: (
              <ProtectedRoute>
                <PageNotFound />
              </ProtectedRoute>
            ),
          },
          {
            path: "payments",
            element: (
              <ProtectedRoute>
                <PageNotFound />
              </ProtectedRoute>
            ),
          },
          {
            path: "track-orders/:orderNum",
            element: (
              <ProtectedRoute>
                <TrackOrderPage />
              </ProtectedRoute>
            ),
          },
        ],
      },

      // {path: "/order-details/:orderNum", element: <OrderDetailsList />},

      // {
      //   path: "/order-details/:orderNum",
      //   element: (
      //     <ProtectedRoute>
      //       <OrderDetailPage />
      //     </ProtectedRoute>
      //   ),
      // },

      // {
      //   path: "/return-order/:orderNum",
      //   element: (
      //     <ProtectedRoute>
      //       <ReturnOrderForm />
      //     </ProtectedRoute>
      //   ),
      // },

      // {
      //   path: "/order-return/:orderNum",
      //   element: (
      //     <ProtectedRoute>
      //       <OrderReturnPage />
      //     </ProtectedRoute>
      //   ),
      // },

      // { path: "/products", element: <SearchProductsPage /> },

      // { path: "/collection/:slug", element: <CategoryProductsPage /> },
      // { path: "/section/:sectionSlug", element: <SectionProductsPage /> },
      // { path: "/product/:slug", element: <ProductDetailPage /> },

      // { path: "/product/reviews/:slug", element: <ProductReviewsPage /> },

      // {
      //   path: "/product/reviews/gallery/:slug",
      //   element: <ProductReviewGalleryPage />,
      // },
      // {
      //   path: "/product/ratings/:orderNum",
      //   element: (
      //     <ProtectedRoute>
      //       <OrderedProductRatings />
      //     </ProtectedRoute>
      //   ),
      // },

      // {
      //   path: "/cart/bag",
      //   element: <CheckoutStepper />,
      //   children: [
      //     { index: true, element: <MyCartPage /> },
      //     // { path: "/cart/bag/checkout", element: <CheckoutPage /> },
      //     { path: "/cart/bag/ordersummary", element: <OrderSummaryPage /> },
      //   ],
      // },

      // { path: "/cart/bag/address", element: <AddAddress /> },

      // { path: "/privacy-policy", element: <PrivacyPolicy /> },
      // { path: "/terms-conditions", element: <TermsConditions /> },
      // { path: "/fees-payments", element: <FeesPayments /> },
      // { path: "/refund-policy", element: <CancellationRefund /> },
      // { path: "/shipping-delivery", element: <ShippingDelivery /> },
      // { path: "/return-and-exchange", element: <ReturnandExchangePolicy /> },
      { path: "*", element: <PageNotFound /> },
    ],
  },
  { path: "/Login", element: <LoginPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/Register", element: <RegisterPage /> },
]);
