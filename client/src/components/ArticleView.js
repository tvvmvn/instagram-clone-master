import {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import ArticleTemplate from "./ArticleTemplate";
import fetchData from "./fetchData";

export default function ArticleView() {
  const {articleId} = useParams();
  const [error, setError] = useState(null)
  const [article, setArticle] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    fetchData(`${process.env.REACT_APP_HOSTNAME}/articles/${articleId}`)
    .then(data => {
      setArticle(data);
    })
    .catch(error => {
      setError(error)
    })
    .finally(() => setIsLoaded(true))
  }, [])

  function favorite(articleId) {
    fetch(`${process.env.REACT_APP_HOSTNAME}/articles/${articleId}/favorite`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
    })
    .then(res => {
      if (!res.ok) {
        throw res;
      }
      const editedArticle = {...article, isFavorite: true, favoriteCount: article.favoriteCount + 1 };
      setArticle(editedArticle);
    })
    .catch(error => {
      alert("Something's broken")
    })
  }

  function unfavorite(articleId) {
    fetch(`${process.env.REACT_APP_HOSTNAME}/articles/${articleId}/favorite`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` },
    })
    .then(res => {
      if (!res.ok) {
        throw res;
      }
      const editedArticle = {...article, isFavorite: false, favoriteCount: article.favoriteCount - 1 };
      setArticle(editedArticle);
    })
    .catch(error => {
      alert("Something's broken")
    })
  }

  function deleteArticle(articleId) { 
    return console.log(articleId);

    fetch(`${process.env.REACT_APP_HOSTNAME}/articles/${articleId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
    })
    .then(res => {
      if (!res.ok) {
        throw res;
      }
      navigate("/", { replace: true })
    })
    .catch(error => {
      alert("Something's broken")
    })
  }

  if (error) {
    return <p>failed to fetch article</p>
  }
  if (!isLoaded) {
    return <p>fetching article...</p>
  }
  return(
    <ArticleTemplate
      article={article} 
      favorite={favorite}
      unfavorite={unfavorite}
      deleteArticle={deleteArticle}
    />    
  )
}


