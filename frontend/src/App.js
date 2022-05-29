import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/navigation/PrivateRoute";
import PrivateAdminRoute from "./components/navigation/PrivateAdminRoute";
import Navbar from "./components/navigation/Navbar";
import HomePage from "./pages/HomePage";
import Auth from "./components/Auth/Auth";
import ErrorPage from "./pages/ErrorPage";
// category
import CategoryCreate from "./components/category/CategoryCreate";
import CategoryList from "./components/category/CategoryList";
import CategoryUpdate from "./components/category/CategoryUpdate";
// post
import PostCreate from "./components/post/PostCreate";
import PostsList from "./components/post/PostList";
import PostDetails from "./components/post/PostDetails";
import PostUpdate from "./components/post/PostUpdate";
// comment
import CommentUpdate from "./components/comment/CommentUpdate";
// user profile
import Profile from "./components/profile/Profile";
// pagination

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/" element={<HomePage />} />
          </Route>
          {/* category routes */}
          <Route path="/category" element={<PrivateAdminRoute />}>
            <Route path="/category" element={<CategoryList />} />
          </Route>
          <Route path="/category/create" element={<PrivateAdminRoute />}>
            <Route path="/category/create" element={<CategoryCreate />} />
          </Route>
          <Route path="/category/update/:id" element={<PrivateAdminRoute />}>
            <Route path="/category/update/:id" element={<CategoryUpdate />} />
          </Route>
          {/* posts routes */}
          {/* <Route path="/post" element={<PrivateRoute />}> */}
          <Route path="/post" element={<PostsList />} />
          {/* </Route> */}
          <Route path="/post/create" element={<PrivateRoute />}>
            <Route path="/post/create" element={<PostCreate />} />
          </Route>
          <Route path="/comment/:id" element={<PrivateRoute />}>
            <Route path="/comment/:id" element={<CommentUpdate />} />
          </Route>
          {/* public post routes */}
          <Route path="/post/:id" element={<PostDetails />} />
          <Route path="/post/update/:id" element={<PostUpdate />} />
          {/* profile routes */}
          <Route path="/profile/:id" element={<PrivateRoute />}>
            <Route path="/profile/:id" element={<Profile />} />
          </Route>
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
