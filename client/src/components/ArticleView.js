import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ArticleTemplate from "./ArticleTemplate";
import { getArticle, deleteArticle, favorite, unfavorite } from "../utils/requests";

export default function ArticleView() {

  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getArticle(id)
      .then(data => {
        setArticle(data.article);
      })
      .catch(error => {
        navigate('/notfound', { replace: true });
      })
  }, [])

  async function handleFavorite(id) {
    try {
      await favorite(id)

      const updatedArticle = {
        ...article,
        isFavorite: true,
        favoriteCount: article.favoriteCount + 1
      }

      setArticle(updatedArticle);

    } catch (error) {
      alert(error)
    }
  }

  async function handleUnfavorite(id) {
    try {

      await unfavorite(id);

      const updatedArticle = {
        ...article,
        isFavorite: false,
        favoriteCount: article.favoriteCount - 1
      }

      setArticle(updatedArticle);
    
    } catch (error) {
      alert(error)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteArticle(id);
      
      navigate('/', { replace: true });
    
    } catch (error) {
      alert(error)
    }
  }

  if (!article) {
    return <p>fetching an article...</p>
  }

  return (
    <ArticleTemplate
      article={article}
      handleFavorite={handleFavorite}
      handleUnfavorite={handleUnfavorite}
      handleDelete={handleDelete}
    />
  )
}


