import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Home from "./Pages/HomePage";
import Login from "./Pages/LoginPage";
import Signup from "./Pages/SignupPage";
import Error from "./Pages/ErrorPage";
import History from "./Pages/HistoryPage";
import Calculator from "./Pages/Calculator";

import { RouterProvider, createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <Error />,
    children: [
      {
        path: "/history",
        element: <History />,
      },
      {
        path: "/calculator",
        element: <Calculator />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
