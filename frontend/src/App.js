import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/navigation/Navbar";
import HomePage from "./pages/HomePage";
import Auth from "./components/Auth/Auth";
import ErrorPage from "./pages/ErrorPage";
import CategoryCreate from "./components/category/CategoryCreate";
import CategoryList from "./components/category/CategoryList";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/category" element={<CategoryList />} />
          <Route path="/category/create" element={<CategoryCreate />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
