import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPostsAction } from "../../redux/slices/postSlice";
import { toast } from "react-toastify";

export default function PaginationOutlined({ count, page, limit }) {
  const dispatch = useDispatch();
  const { appErr, serverErr } = useSelector((state) => state.post);
  const handleChange = (event, value) => {
    console.log(value);
    dispatch(
      getAllPostsAction({
        page: value,
        limit: limit,
        category: "",
      })
    );
  };
  if (appErr || serverErr) {
    toast.error("Something went wrong");
  }

  return (
    <Stack
      spacing={2}
      style={{
        width: "100%",
        margin: "auto",
        backgroundColor: "#6f7598",
      }}
    >
      <Pagination
        count={count / limit}
        page={page}
        onChange={handleChange}
        variant="outlined"
        color="primary"
        size="large"
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "0 auto",
        }}
      />
    </Stack>
  );
}
