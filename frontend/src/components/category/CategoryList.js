import { Link } from "react-router-dom";
import { PencilAltIcon } from "@heroicons/react/outline";
import { getAllCategoriesAction } from "../../redux/slices/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Spinner from "../spinner/Spinner";
import ErrorPage from "../../pages/ErrorPage";
import { toast } from "react-toastify";

const CategoryList = () => {
  const dispatch = useDispatch();
  const { categoryList, isLoading, appErr, serverErr } = useSelector(
    (state) => state.category
  );
  console.log(categoryList);
  useEffect(() => {
    dispatch(getAllCategoriesAction());
  }, [dispatch]);

  if (categoryList?.data <= 0) {
    return <ErrorPage />;
  }
  if (appErr || serverErr) {
    toast.error(appErr - serverErr);
  }
  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Author
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Created At
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Edit
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categoryList?.data.map((category) => (
                    <tr className="bg-gray-50" key={category._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full"
                              src={category?.user?.profilePhoto}
                              alt="category profile"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {category?.user?.firstName}
                              <span> </span>
                              {category?.user?.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {category?.user?.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {category.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {/* {<DateFormatter date={category?.createdAt} />} */}
                      </td>
                      <Link to={`/update-category/${category?._id}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <PencilAltIcon className="h-5 text-indigo-500" />
                        </td>
                      </Link>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryList;
