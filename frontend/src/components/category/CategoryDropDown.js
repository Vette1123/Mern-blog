import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategoriesAction } from "../../redux/slices/categorySlice";
import Select from "react-select";
import { toast } from "react-toastify";
const CategoryDropDown = (props) => {
  const dispatch = useDispatch();

  const { categoryList, isLoading, appErr, serverErr } = useSelector(
    (state) => state.category
  );

  useEffect(() => {
    dispatch(getAllCategoriesAction());
  }, [dispatch]);

  const data = categoryList?.data.map((item) => ({
    value: item._id,
    label: item.title,
  }));
  const handleChange = (value) => {
    props.onChange("category", value);
  };
  //handleBlur
  const handleBlur = () => {
    props.onBlur("category", true);
  };

  useEffect(() => {
    if (props.error) {
      toast.error(appErr);
    }
  }, [props.error]);
  return (
    <Select
      options={data}
      onChange={handleChange}
      onBlur={handleBlur}
      id="category"
      value={props?.value?.label}
    />
  );
};

export default CategoryDropDown;
