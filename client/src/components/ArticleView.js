import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ArticleTemplate from "./ArticleTemplate";
import { fetchArticle, createFavorite, deleteFavorite, deleteArticle } from "../utils/requests";

export default function ArticleView() {

  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticle(id)
      .then(data => {
        setArticle(data.article);
      })
      .catch(error => {
        navigate('/notfound', { replace: true });
      })
  }, [])

  async function addFavorite(id) {
    try {
      await createFavorite(id);

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

  async function cancelFavorite(id) {
    try {
      await deleteFavorite(id);

      const updatedArticle = {
        ...article,
        isFavorite: false,
        favoriteCount: article.favoriteCount -1
      }
  
      setArticle(updatedArticle);
    
    } catch (error) {
      alert(error)
    }
  }

  async function removeArticle(id) {
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
      addFavorite={addFavorite}
      cancelFavorite={cancelFavorite}
      removeArticle={removeArticle}
    />
  )
}


