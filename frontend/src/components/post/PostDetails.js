import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/solid";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPostByIdAction,
  deletePostAction,
} from "../../redux/slices/postSlice";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../spinner/Spinner";
import { toast } from "react-toastify";
import DateFormater from "../../utils/DateFormater";
import CommentCreate from "../comment/CommentCreate";
import CommentsList from "../comment/CommentList";

const PostDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { singlePost, isLoading, appErr, serverErr } = useSelector(
    (state) => state.post
  );

  const { isUpdated, ra5ara } = useSelector((state) => state.comment);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const isCreatedBy = user?._id === singlePost?.data?.user?._id;

  useEffect(() => {
    dispatch(getPostByIdAction(id));
  }, [dispatch, isUpdated, ra5ara]);
  useEffect(() => {
    if (appErr || serverErr) {
      toast.error(appErr - serverErr);
    }
  }, [appErr, serverErr]);

  if (isLoading) return <Spinner />;

  return (
    <>
      <section class="py-20 2xl:py-40 bg-gray-800 overflow-hidden">
        <div class="container px-4 mx-auto">
          {/* Post Image */}
          <img
            class="mb-24 w-full h-96 object-cover"
            src={singlePost?.data.image}
            alt={singlePost?.data.title}
          />
          <div class="max-w-2xl mx-auto text-center">
            <h2 class="mt-7 mb-14 text-6xl 2xl:text-7xl text-white font-bold font-heading">
              {singlePost?.data.title}
            </h2>

            {/* User */}
            <div class="inline-flex pt-14 mb-14 items-center border-t border-gray-500">
              <img
                class="mr-8 w-20 lg:w-24 h-20 lg:h-24 rounded-full"
                src={singlePost?.data.user.profilePhoto}
                alt=""
              />
              <div class="text-left">
                <h4 class="mb-1 text-2xl font-bold text-gray-50">
                  <span class="text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-yellow-200 to-orange-600">
                    {singlePost?.data.user?.firstName}
                    {singlePost?.data.user?.lastName}
                  </span>
                </h4>
                <p class="text-gray-500">
                  <DateFormater date={singlePost?.data.createdAt} />
                </p>
              </div>
            </div>
            {/* Post description */}
            <div class="max-w-xl mx-auto">
              <p class="mb-6 text-left  text-xl text-gray-200">
                {singlePost?.data.description}
                {/* Show delete and update btn if created user */}
                {isCreatedBy && (
                  <p class="flex">
                    <Link
                      class="p-3"
                      to={`/post/update/${singlePost?.data.id}`}
                    >
                      <PencilAltIcon class="h-8 mt-3 text-yellow-300" />
                    </Link>

                    <button
                      onClick={() => {
                        dispatch(deletePostAction(singlePost?.data._id));
                        navigate("/post");
                      }}
                      class="ml-3"
                    >
                      <TrashIcon class="h-8 mt-3 text-red-600" />
                    </button>
                  </p>
                )}
              </p>
            </div>
          </div>
        </div>
        {/* Add comment Form component here */}
        {isAuthenticated && <CommentCreate postId={id} />}
        <div className="flex justify-center  items-center">
          {/* <CommentsList comments={post?.comments} postId={post?._id} /> */}
          <CommentsList comments={singlePost?.data.comments} />
        </div>
      </section>
    </>
  );
};

export default PostDetails;
