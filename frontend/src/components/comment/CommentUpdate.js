import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {
  getCommentAction,
  updateCommentAction,
} from "../../redux/slices/commentSlice";
import { toast } from "react-toastify";
import Spinner from "../spinner/Spinner";

//Form schema

const CommentUpdate = () => {
  //dispatch
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  //fetch comment
  useEffect(() => {
    dispatch(getCommentAction(id));
  }, [dispatch, id]);
  //select comment from store
  const { commentDetails, isLoading, serverErr, appErr } = useSelector(
    (state) => state?.comment
  );
  const validate = (values) => {
    const errors = {};
    if (!values.description) {
      errors.description = "Comment is required";
    } else if (values.description.length < 5) {
      errors.description = "Comment must be at least 5 characters";
    }
    return errors;
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      description: commentDetails?.data.description,
    },
    validate,
    onSubmit: (values) => {
      const data = {
        id,
        description: values?.description,
      };
      //dispatch action
      dispatch(updateCommentAction(data));
      toast.success("Comment updated successfully");
      navigate(-1);
    },
  });
  if (appErr || serverErr) {
    toast.error(appErr - serverErr);
  }

  if (isLoading) return <Spinner />;
  //redirect

  return (
    <div className="h-96 flex justify-center items-center">
      <div className="flex flex-col justify-center items-center">
        <form
          onSubmit={formik.handleSubmit}
          className="mt-1 flex max-w-sm m-auto"
        >
          <textarea
            onBlur={formik.handleBlur("description")}
            value={formik.values.description}
            onChange={formik.handleChange("description")}
            type="text"
            name="text"
            id="text"
            className="shadow-sm focus:ring-indigo-500  mr-2 focus:border-indigo-500 block w-full p-2 border-2 sm:text-sm border-gray-300 rounded-md"
            placeholder="Add New comment"
          />

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
    </div>
  );
};

export default CommentUpdate;
