import { Link } from "react-router-dom";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/solid";
import { useDispatch, useSelector } from "react-redux";
import Moment from "react-moment";
import { deleteCommentAction } from "../../redux/slices/commentSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function CommentsList({ comments }) {
  const dispatch = useDispatch();
  const { isLoading, appErr, serverErr } = useSelector(
    (state) => state.comment
  );
  useEffect(() => {
    if (appErr || serverErr) {
      toast.error(appErr - serverErr);
    }
  }, [appErr, serverErr]);

  const { user } = useSelector((state) => state.auth);
  return (
    <div>
      <ul className="divide-y bg-gray-700 w-96 divide-gray-200 p-3 mt-5">
        <div className="text-gray-400 mb-4">
          {comments?.length} Total Comments
        </div>
        <>
          {comments?.map((comment) => (
            <li key={comment?._id} className="py-4  w-full">
              <div className="flex space-x-3">
                {/* user Image */}
                <img
                  className="h-6 w-6 rounded-full"
                  src={comment?.user.profilePhoto}
                  alt={comment?.description}
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-green-400">
                      {comment?.user?.firstName} {comment?.user?.lastName}
                    </h3>
                    <p className="text-bold text-yellow-500 text-base ml-5">
                      <Moment fromNow ago>
                        {comment?.createdAt}
                      </Moment>
                    </p>
                  </div>
                  <p className="text-sm text-gray-400">
                    {comment?.description}
                  </p>
                  {/* Check if is the same user created this comment */}
                  {user?._id === comment?.user._id && (
                    <p className="flex">
                      <Link className="p-3" to={`/comment/${comment?._id}`}>
                        {/* Edit Icon */}
                        <PencilAltIcon className="h-5 mt-3 text-yellow-300" />
                      </Link>
                      {/* Delete icon */}
                      <button
                        className="ml-3"
                        onClick={() =>
                          dispatch(deleteCommentAction(comment?._id))
                        }
                      >
                        <TrashIcon className="h-5 mt-3 text-red-600" />
                      </button>
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </>
      </ul>
    </div>
  );
}
