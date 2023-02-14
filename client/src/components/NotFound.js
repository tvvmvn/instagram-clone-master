import { useEffect } from 'react';
import { Link } from "react-router-dom";

export default function NotFound() {

  useEffect(() => {
    document.title = `Page not found - Instagram`;
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold my-4 text-center">Sorry, this page isn't available</h1>
      <p className="block text-center">
        The link you followed may be broken, or the page may have been removed. {" "}
        <Link to="/" className="text-blue-500">Go back to Instagram</Link>
      </p>
    </div>  
  )
}

// import { useState, useRef } from 'react'

// export default function App() {
//   const [name, setName] = useState("");
//   const [selectedFile, setSelectedFile] = useState(null);

//   const submitForm = (e) => {
//     e.preventDefault();

//     console.log(name)
//     console.log(selectedFile)
//   };

//   return (
//     <div className="App">
//       <form onSubmit={submitForm}>
//         <input
//           type="text"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />

//         <FileUploader
//           onFileSelectSuccess={(file) => setSelectedFile(file)}
//           onFileSelectError={({ error }) => alert(error)}
//         />

//         <button onClick={submitForm}>Submit</button>
//       </form>
//     </div>
//   );
// };

// function FileUploader({onFileSelectSuccess, onFileSelectError}) {

//   const handleFileInput = (e) => {
//     // handle validations
//     const file = e.target.files[0];

//     if (file.size > 1e7) {
//       onFileSelectError({ error: "File size cannot exceed more than 10MB" });
//     } else {
//       onFileSelectSuccess(file);
//     } 
//   };

//   return (
//     <div className="file-uploader">
//       <input type="file" onChange={handleFileInput} />
//     </div>
//   )
// }