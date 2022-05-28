import { useFormik } from "formik";
import { createCommentAction } from "../../redux/slices/commentSlice";

import { useDispatch, useSelector } from "react-redux";
import Spinner from "../spinner/Spinner";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function CommentCreate({ postId }) {
  const validate = (values) => {
    const errors = {};
    if (!values.description) {
      errors.description = "Required";
    } else if (values.description.length < 3) {
      errors.description = "Must be at least 3 characters";
    } else if (values.description.length > 20) {
      errors.description = "Must be less than 20 characters";
    }
    return errors;
  };
  const dispatch = useDispatch();
  const { isLoading, appErr, serverErr } = useSelector(
    (state) => state.comment
  );
  const formik = useFormik({
    initialValues: {
      description: "",
    },
    validate,
    onSubmit: (values) => {
      const data = {
        description: values?.description,
        postId,
      };
      dispatch(createCommentAction(data));
    },
  });

  useEffect(() => {
    if (appErr || serverErr) {
      toast.error(appErr - serverErr);
    }
  }, [appErr, serverErr]);

  if (isLoading) return <Spinner />;

  return (
    <div className="flex flex-col justify-center items-center">
      {/* Form start here */}
      <form
        className="mt-1 flex max-w-sm m-auto"
        onSubmit={formik.handleSubmit}
      >
        {/* Description */}
        <input
          className="shadow-sm focus:ring-indigo-500  mr-2 focus:border-indigo-500 block w-full p-2 border-1 sm:text-sm border-gray-300 rounded-md"
          placeholder="Add New comment"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.text}
          onFocus={formik.handleFocus}
          name="description"
          id="description"
        />
        {/* submit btn */}
        <button
          type="submit"
          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </form>

      <div className="text-red-400 mb-2 mt-2">
        {formik.touched.description && formik.errors.description}
      </div>
    </div>
  );
}
