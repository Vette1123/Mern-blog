import { PlusCircleIcon, BookOpenIcon } from "@heroicons/react/solid";
import { useDispatch, useSelector } from "react-redux";
import { createCategoryAction } from "../../redux/slices/categorySlice";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import Spinner from "../spinner/Spinner";
import { toast } from "react-toastify";

const validate = (values) => {
  const errors = {};
  if (!values.title) {
    errors.title = "Required";
  } else if (values.title.length < 3) {
    errors.title = "Must be at least 3 characters";
  } else if (values.title.length > 20) {
    errors.title = "Must be less than 20 characters";
  }
  return errors;
};

const CategoryCreate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, category, appErr, serverErr } = useSelector(
    (state) => state.category
  );

  const formik = useFormik({
    initialValues: {
      title: "",
    },
    validate,
    onSubmit: (values) => {
      dispatch(createCategoryAction(values));
      navigate("/category");
      toast.success("Category created successfully");
      if (appErr || serverErr) {
        toast.error(appErr);
      }
      formik.resetForm();
    },
  });

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <BookOpenIcon className="mx-auto h-12 w-auto" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Add New Category
          </h2>
          <div className="mt-2 text-center text-sm text-gray-600">
            <p className="font-medium text-indigo-600 hover:text-indigo-500">
              These are the categories user will select when creating a post
            </p>
            <div>
              {appErr || serverErr ? (
                <h2 className="text-red-500 text-center text-lg">
                  {serverErr} {appErr}
                </h2>
              ) : null}
            </div>
          </div>
        </div>
        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Name
              </label>
              {/* Title */}
              <input
                type="text"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-center focus:z-10 sm:text-sm"
                placeholder="New Category"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                onFocus={formik.handleFocus}
              />
              <div className="text-red-400 mb-2">
                {formik.touched.title && formik.errors.title}
              </div>
            </div>
          </div>

          <div>
            <div>
              {/* Submit */}
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <PlusCircleIcon
                    className="h-5 w-5 text-yellow-500 group-hover:text-indigo-400"
                    aria-hidden="true"
                  />
                </span>
                Add new Category
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryCreate;
