import {useState, useEffect, useContext} from "react"
import ArticleTemplate from "./ArticleTemplate";
import { fetchFeed, favoriteReq, deleteArticleReq } from "../utils/requests";
import Spinner from './Spinner';

const limit = 5;

export default function Feed() {
  
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [articles, setArticles] = useState([]);
  const [skip, setSkip] = useState(0);
  const [articleCount, setArticleCount] = useState(0);

  useEffect(() => {
    setIsLoaded(false);
    
    fetchFeed(limit, skip)
      .then(data => {
        setArticleCount(data.articleCount);
          
        let updatedArticles = [...articles, ...data.articles];
        setArticles(updatedArticles);
      })
      .catch(error => {
        setError(error);
      })
      .finally(() => setIsLoaded(true))
      
  }, [skip])

  async function toggleFavorite(slug, isFavorite) {
    try {
      await favoriteReq(slug, isFavorite);

      const updatedArticles = articles.map(article => {
        if (article.slug === slug) {
          return {
            ...article,
            isFavorite: !isFavorite,
            favoriteCount: article.favoriteCount + (isFavorite ? - 1 : + 1)
          }
        }
        return article;
      })
  
      setArticles(updatedArticles);

    } catch (error) {
      alert(error)
    }
  }

  async function deleteArticle(slug) {
    try {
      await deleteArticleReq(slug); 

      const remainingArticles = articles.filter(article => {
        if (slug !== article.slug) {
          return article;
        }
      });
  
      setArticles(remainingArticles);
    
    } catch (error) {
      alert(error)
    }
  }

  const articleList = articles.map(article => (
    <li key={article.slug} className="border-b pb-4">
      <ArticleTemplate
        article={article}
        toggleFavorite={toggleFavorite}
        deleteArticle={deleteArticle}
      />
    </li>
  ))

  const moreButton = (articleCount > limit && articleCount > articles.length) && (
    <div className="flex justify-center my-2">
      <button 
        className="p-1 text-blue-500" 
        onClick={() => setSkip(skip + limit)}
      >
        More
      </button>
    </div>
  )

  return (
    <>
      <ul className="">
        {articleList}
      </ul>

      {isLoaded ? moreButton : <Spinner />}
      {error && <p className="text-red-500">{error.message}</p>}
    </>  
  )
}

