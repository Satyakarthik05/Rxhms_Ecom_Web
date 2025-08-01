import React from "react";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import "antd/dist/reset.css";

import { RouterSection } from "./sections/router/router";
import { Provider } from "react-redux";

import { ThemeProvider } from "@mui/material";
import WebTheme from "./utils/webTheme";
import { store } from "./Redux/store/store";

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={WebTheme}>
        <RouterProvider router={RouterSection} />
      </ThemeProvider>
    </Provider>
  );
};

export default App;
