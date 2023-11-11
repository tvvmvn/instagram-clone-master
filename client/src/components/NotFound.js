import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function NotFound() {

  useEffect(() => {
    document.title = `Page not found - Instagram`;
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold my-4 text-center">
        Sorry, this page isn't available
      </h1>
      <p className="my-4 text-center">
        The link you followed may be broken, 
        or the page may have been removed. 
      </p>
      
      <Link to="/" className="block text-center text-blue-500 font-semibold">
        Go back to Instagram
      </Link>
    </div>  
  )
}