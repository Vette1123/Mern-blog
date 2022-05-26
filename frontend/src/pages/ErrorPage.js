import React from "react";
import { Link } from "react-router-dom";
import { HomeIcon } from "@heroicons/react/solid";

const ErrorPage = () => {
  return (
    <>
      <div
        className="
    flex
    items-center
    justify-center
    h-screen
    bg-gradient-to-r
    from-indigo-600
    to-blue-400
    overflow-hidden
    w-full
  "
      >
        <div className="px-40 py-20 bg-white rounded-md shadow-xl">
          <div className="flex flex-col items-center">
            <h1 className="font-bold text-blue-600 text-9xl">404</h1>

            <h6 className="mb-2 text-2xl font-bold text-center text-gray-800 md:text-3xl">
              <span className="text-red-500">Oops!</span> Page not found
            </h6>

            <p className="mb-8 text-center text-gray-500 md:text-lg">
              The page you’re looking for doesn’t exist.
            </p>

            <Link
              to="/"
              type="button"
              className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
            >
              <HomeIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              <span>Home</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ErrorPage;
