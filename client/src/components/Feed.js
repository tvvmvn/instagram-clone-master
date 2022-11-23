import {useState, useEffect, Suspense} from "react"
import ArticleTemplate from "./ArticleTemplate";
import fetchData from "./fetchData";

const limit = 5;

export default function Feed() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [articles, setArticles] = useState([]);
  const [skip, setSkip] = useState(limit);

  useEffect(() => {
    setIsLoaded(false);
    setError(null);

    fetchData(`${process.env.REACT_APP_HOSTNAME}/feed/?limit=${limit}&skip=${skip}`)
    .then(data => {
      setArticles([...articles, ...data])
    })
    .catch(error => {
      setError(error)
    })
    .finally(() => setIsLoaded(true))
  }, [skip])

  function unfavorite(articleId) {
    fetch(`${process.env.REACT_APP_HOSTNAME}/articles/${articleId}/favorite`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
    })
    .then(res => {
      if (!res.ok) {
        throw res;
      }
      const editedArticles = articles.map(article => {
        if (articleId === article._id) {
          return { ...article, isFavorite: false, favoriteCount: article.favoriteCount - 1 };
        }
        return article;
      })
      setArticles(editedArticles);
    })
    .catch(error => {
      alert("Something's broken")
    });
  }

  function favorite(articleId) {
    fetch(`${process.env.REACT_APP_HOSTNAME}/articles/${articleId}/favorite`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
    })
    .then(res => {
      if (!res.ok) {
        throw res;
      }
      const editedArticles = articles.map(article => {
        if (articleId === article._id) {
          return { ...article, isFavorite: true, favoriteCount: article.favoriteCount + 1 };
        }
        return article;
      })
      setArticles(editedArticles);
    })
    .catch(error => {
      alert("Something's broken")
    });
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
      const updatedArticles = articles.filter(article => articleId !== article._id);
      setArticles(updatedArticles);
    })
    .catch(error => {
      alert("Something's broken")
    })
  }

  const articleList = articles.map(article => (
    <li key={article._id} className="mb-4">
      <ArticleTemplate
        article={article} 
        favorite={favorite}
        unfavorite={unfavorite}
        deleteArticle={deleteArticle}
      />
    </li>
  ))

  return (
    <>
      <ul className="">
        {articleList}
      </ul>
      <div className="flex justify-center my-2">
        <button className="p-1 text-blue-500" onClick={() => setSkip(skip + limit)}>Load +</button>
      </div>

      {!isLoaded && <p>fetching feed...</p>}
      {error && <p>failed to fetch feed</p>}
    </>  
  )
}