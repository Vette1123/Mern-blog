import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { createPostAction } from "../../redux/slices/postSlice";
import { toast } from "react-toastify";
import Dropzone from "react-dropzone";
import CategoryDropDown from "../category/CategoryDropDown";
import { useEffect } from "react";
import styled from "styled-components";
import Spinner from "../spinner/Spinner";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const navigate = useNavigate();
  const validate = (values) => {
    const errors = {};
    if (!values.title) {
      errors.title = "Required";
    } else if (values.title.length < 3) {
      errors.title = "Must be at least 3 characters";
    } else if (values.title.length > 20) {
      errors.title = "Must be less than 20 characters";
    }
    if (!values.description) {
      errors.description = "Required";
    } else if (values.description.length < 3) {
      errors.description = "Must be at least 3 characters";
    } else if (values.description.length > 20) {
      errors.description = "Must be less than 20 characters";
    }
    if (!values.category.label) {
      errors.category = "Select a category";
    }
    if (!values.image) {
      errors.image = "Image is required";
    } else if (values.image.length > 2) {
      errors.image = "Must be less than 2";
    }

    return errors;
  };

  //css for dropzone
  const Container = styled.div`
flex: 1;
display: flex;
flex-direction: column;
align-items: center;
padding: 20px;
border-width: 2px;
border-radius: 2px;
border-style: dashed;
background-color: #fafafa;
color: #bdbdbd;
border-color:'red'
transition: border 0.24s ease-in-out;
`;

  const dispatch = useDispatch();
  const { isLoading, posts, appErr, serverErr, isSuccess } = useSelector(
    (state) => state.post
  );
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      category: "",
      image: "",
    },
    validate,
    onSubmit: (values) => {
      const data = {
        title: values.title,
        description: values.description,
        category: values.category.label,
        image: values.image,
      };
      dispatch(createPostAction(data));
      navigate("/");
      toast.success("Post created successfully");
    },
  });

  useEffect(() => {
    if (serverErr || appErr) {
      toast.error(appErr);
    }
  }, [serverErr, appErr]);
  useEffect(() => {
    if (formik.errors.image) {
      toast.error(formik.errors.image);
    }
  }, [formik.errors.image]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-300">
            Create Post
          </h2>

          <p className="mt-2 text-center text-sm text-gray-600">
            <p className="font-medium text-green-600 hover:text-indigo-500">
              Share your ideas to the word. Your post must be free from
              profanity
            </p>
          </p>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={formik.handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <div className="mt-1">
                  {/* Title */}
                  <input
                    id="title"
                    name="title"
                    type="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    onFocus={formik.handleFocus}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                {/* Err msg */}
                <div className="text-red-500">
                  {formik.touched.title && formik.errors.title}
                </div>
              </div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <CategoryDropDown
                value={formik.values.category?.label}
                onChange={formik.setFieldValue}
                onBlur={formik.setFieldTouched}
                error={formik.errors.category}
                touched={formik.touched.category}
              />
              {/* errors here */}
              <div className="text-red-500">
                {formik.touched.category && formik.errors.category}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Description
                </label>
                {/* Description */}
                <textarea
                  rows="5"
                  cols="10"
                  className="rounded-lg appearance-none block w-full py-3 px-3 text-base text-center leading-tight text-gray-600 bg-transparent focus:bg-transparent  border border-gray-200 focus:border-gray-500  focus:outline-none"
                  type="text"
                  id="description"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  onFocus={formik.handleFocus}
                ></textarea>
                {/* Err msg */}
                <div className="text-red-500">
                  {formik.touched.description && formik.errors.description}
                </div>

                {/* image component */}
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700 mt-2"
                >
                  Please select an image to upload
                </label>

                <Container className="container bg-gray-600 mt-2">
                  <Dropzone
                    // accept={["image/jpeg", "image/png"]}
                    maxfiles={2}
                    onDrop={(acceptedFiles) => {
                      formik.setFieldValue("image", acceptedFiles);
                    }}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <div className="container">
                        <div
                          {...getRootProps({
                            className: "dropzone",
                            onDrop: (event) => event.stopPropagation(),
                          })}
                        >
                          <input {...getInputProps()} />
                          <p className="text-gray-300 text-lg cursor-pointer hover:text-gray-500">
                            Click here to select image
                          </p>
                        </div>
                      </div>
                    )}
                  </Dropzone>
                </Container>
                {/* error msg */}
                <div className="text-red-500">
                  {formik.touched.image && formik.errors.image}
                </div>
              </div>
              <div>
                {/* Submit btn */}
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
