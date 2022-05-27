import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/navigation/PrivateRoute";
import PrivateAdminRoute from "./components/navigation/PrivateAdminRoute";
import Navbar from "./components/navigation/Navbar";
import HomePage from "./pages/HomePage";
import Auth from "./components/Auth/Auth";
import ErrorPage from "./pages/ErrorPage";
import CategoryCreate from "./components/category/CategoryCreate";
import CategoryList from "./components/category/CategoryList";
import CategoryUpdate from "./components/category/CategoryUpdate";
import { useSelector } from "react-redux";

const App = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/" element={<HomePage />} />
          </Route>
          <Route path="/auth" element={<Auth />} />
          <Route path="/category" element={<PrivateRoute />}>
            <Route path="/category" element={<CategoryList />} />
          </Route>
          <Route path="/category/create" element={<PrivateRoute />}>
            <Route path="/category/create" element={<CategoryCreate />} />
          </Route>
          <Route path="/category/update/:id" element={<PrivateAdminRoute />}>
            <Route path="/category/update/:id" element={<CategoryUpdate />} />
          </Route>
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
