import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import Carousel from "./Carousel";
import Modal from "./Modal";
import { FaEllipsis, FaRegHeart, FaHeart, FaRegComment } from "react-icons/fa6";

export default function PostTemplate({ 
  id, 
  username,
  avatarUrl,
  photoUrls,
  caption,
  liked,
  likesCount,
  commentCount,
  displayDate,
  handleLike, 
  handleUnlike,
  handleDelete, 
  isMaster
}) {

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="mt-4 bg-white">
      {/* Author area */}
      <div className="px-2 mb-2 flex justify-between items-center">
        <Link
          to={`/profiles/${username}`}
          className="inline-flex items-center"
        >
          <img
            src={avatarUrl}
            className="w-10 h-10 object-cover border rounded-full"
          />
          <span className="ml-2">
            {username}
          </span>
        </Link>

        {modalOpen && (
          <Modal 
            id={id}
            setModalOpen={setModalOpen} 
            handleDelete={handleDelete} 
          />
        )}

        {isMaster && (
          <FaEllipsis onClick={() => setModalOpen(true)} />
        )}
      </div>

      {/* Carousel */}
      <Carousel photoUrls={photoUrls} />

      <div className="mt-2 px-2">
        {/* Likes/Unlikes and Comment button */}
        <div className="flex">
          {liked ? (
            <FaHeart 
              size="24"
              className="fill-red-500" 
              onClick={() => handleUnlike(id)} 
            />
          ) : (
            <FaRegHeart 
              size="24"
              onClick={() => handleLike(id)} 
            />
          )}

          <Link to={`/p/${id}/comments`} className="ml-2">
            <FaRegComment size="24" />
          </Link>
        </div>

        {/* Likes count */}
        <p className="text-sm my-2">{likesCount} likes</p>

        {/* Photo caption */}
        {caption && (
          <p className="my-4">
            <Link to={`/profiles/${username}`} className="font-semibold">
              {username}
            </Link>
            {" "}
            {caption}
          </p>
        )}

        {/* Comment link */}
        {commentCount > 0 && (
          <p className="text-gray-400 text-sm my-2">
            <Link to={`/p/${id}/comments`}> 
              View all {commentCount} Comments
            </Link>
          </p>
        )}

        {/* Post date */}
        <p className="text-gray-400 text-xs">{displayDate}</p>
      </div>
    </div>
  )
}