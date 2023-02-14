import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ArticleTemplate from "./ArticleTemplate";
import { fetchArticle, favoriteReq, deleteArticleReq } from "../utils/requests";

export default function ArticleView() {

  const { slug } = useParams();
  const [error, setError] = useState(null)
  const [article, setArticle] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticle(slug)
      .then(data => {
        setArticle(data.article);
      })
      .catch(error => {
        setError(error);
      })
      .finally(() => setIsLoaded(true));
  }, [])

  async function toggleFavorite(slug, isFavorite) {
    try {
      await favoriteReq(slug, isFavorite);

      const updatedArticle = {
        ...article,
        isFavorite: !isFavorite,
        favoriteCount: article.favoriteCount + (isFavorite ? - 1 : + 1)
      }
  
      setArticle(updatedArticle);
    
    } catch (error) {
      alert(error)
    }
  }

  async function deleteArticle(slug) {
    try {
      await deleteArticleReq(slug);
      
      navigate('/', { replace: true });
    
    } catch (error) {
      alert(error)
    }
  }

  if (error) {
    return <p className="text-red-500">{error.message}</p>
  }

  if (!isLoaded) {
    return <p>fetching an article...</p>
  }

  return (
    <ArticleTemplate
      article={article}
      toggleFavorite={toggleFavorite}
      deleteArticle={deleteArticle}
    />
  )
}


