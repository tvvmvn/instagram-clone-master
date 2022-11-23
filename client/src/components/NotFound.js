import {Link} from "react-router-dom";

export default function NotFound() {
  return (
    <div className="p-4">
      <h1 className="text-2xl">This page is unavailable</h1>
      <div className="">
        <Link to="/">Back to Home</Link>
      </div>
    </div>  
  )
}