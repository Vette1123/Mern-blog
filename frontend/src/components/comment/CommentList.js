import { Link } from "react-router-dom";

import { PencilAltIcon, TrashIcon } from "@heroicons/react/solid";
import { useDispatch, useSelector } from "react-redux";

export default function CommentsList({ comments }) {
  const dispatch = useDispatch();
  const { isLoading, appErr, serverErr } = useSelector(
    (state) => state.category
  );
  console.log(comments);

  return (
    <div>
      <ul className="divide-y bg-gray-700 w-96 divide-gray-200 p-3 mt-5">
        <div className="text-gray-400"> - Comments</div>
        <>
          {comments?.map((comment) => (
            <li className="py-4  w-full">
              <div className="flex space-x-3">
                {/* user Image */}
                <img
                  className="h-6 w-6 rounded-full"
                  src={comment?.user.profilePhoto}
                  alt=""
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-green-400">
                      {comment?.user?.fullName}
                    </h3>
                    <p className="text-bold text-yellow-500 text-base ml-5">
                      {/* <Moment fromNow ago>
                                {comment?.createdAt}
                              </Moment> */}{" "}
                      Created At
                    </p>
                  </div>
                  <p className="text-sm text-gray-400">description here</p>
                  {/* Check if is the same user created this comment */}

                  <p class="flex">
                    <Link class="p-3" to="/post">
                      {/* Edit Icon */}
                      <PencilAltIcon class="h-5 mt-3 text-yellow-300" />
                    </Link>
                    {/* Delete icon */}
                    <button class="ml-3">
                      <TrashIcon class="h-5 mt-3 text-red-600" />
                    </button>
                  </p>
                </div>
              </div>
            </li>
          ))}
        </>
      </ul>
    </div>
  );
}
