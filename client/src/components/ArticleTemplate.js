import {useState, useContext} from "react";
import {Link} from "react-router-dom";
import AuthContext from "./AuthContext";
import Carousel from "./Carousel";
import Modal from "./Modal";
import Avatar from "./Avatar";

export default function ArticleTemplate({article, favorite, unfavorite, deleteArticle}) {

  const auth = useContext(AuthContext);
  const isMaster = auth.user.username === article.user.username;
  const created = new Date(article.created).toLocaleDateString();

  function toggleFavorite(e) {
    console.log(e.currentTarget)
    
    const articleId = article._id;

    if (article.isFavorite) {
      unfavorite(articleId)
    } else {
      favorite(articleId)
    }
  }

  const modal = (
    <Modal>
      <li className="border-b">
        <button className="w-full p-1" onClick={() => deleteArticle(article._id)}>Delete</button>
      </li>
    </Modal>
  )

  return (
    <>
      <div className="px-2 mb-2 flex justify-between items-center">
        <Avatar user={article.user} />
        {isMaster && modal}
      </div>

      <div className="mb-4">
        <Carousel images={article.photos} />
      </div>

      <div className="px-2">
        <div className="flex">
          <button type="button" className={article.isFavorite && 'text-red-400'} onClick={toggleFavorite}>
            Favorite
          </button>
          <div className="ml-1">{article.favoriteCount} likes</div>
        </div>

        <p className="mb-2">
          <span className="font-bold">{article.user.username}</span>
          {" "}
          {article.description}
        </p>

        <div className="text-gray-400">
          <Link to={`/article/${article._id}/comments`}>Comments</Link>
        </div>

        <small className="text-gray-400 text-xs">{created}</small>
      </div>
    </>  
  )
}

