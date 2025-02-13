import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// PAGES
import HomeLayout from "./pages/HomeLayout";
import Home from "./pages/Home";
import ErrorPage from "./pages/ErrorPage";

// AUTH PAGES
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";
import Support from "./pages/Support";

// ROUTER
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        path: "/",
        element: <Home />,
        errorElement: <ErrorPage />,
      },
      { path: "/account", element: <Account />, errorElement: <ErrorPage /> },
      { path: "/orders", element: <Orders />, errorElement: <ErrorPage /> },
      { path: "/cart", element: <Cart />, errorElement: <ErrorPage /> },
      { path: "/support", element: <Support />, errorElement: <ErrorPage /> },
    ],
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/register",
    element: <Register />,
    errorElement: <ErrorPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
