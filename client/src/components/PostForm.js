import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../service/post";

export default function PostForm() {

  const [files, setFiles] = useState([]);
  const [caption, setCaption] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    try {
      e.preventDefault();

      const formData = new FormData();

      files.forEach(file => {
        formData.append("photos", file);
      })

      formData.append("caption", caption);

      await createPost(formData);

      navigate("/");

    } catch (error) {
      alert(error);
    }
  }

  const photoPreviewList = files.map(file => (
    <img
      key={file.name}
      className="w-12 h-12 object-cover"
      src={URL.createObjectURL(file)}
      alt={file.name}
    />
  ))

  return (
    <form className="px-4" onSubmit={handleSubmit}>
      <h3 className="my-4 text-lg font-semibold">Create new post</h3>

      {/* Upload button */}
      <label className="flex mb-4 cursor-pointer">
        <input
          type="file"
          className="hidden"
          onChange={({ target }) => setFiles(Array.from(target.files))}
          multiple={true}
          accept="image/png, image/jpg, image/jpeg, image/webp"
        />
        <svg 
          className="w-4 fill-blue-500 mr-2"
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 512 512"
        >
          <path d="M149.1 64.8L138.7 96H64C28.7 96 0 124.7 0 160V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H373.3L362.9 64.8C356.4 45.2 338.1 32 317.4 32H194.6c-20.7 0-39 13.2-45.5 32.8zM256 192a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"/>
        </svg>
        <span className="font-semibold text-sm text-blue-500">
          Select Photos
        </span>
      </label>

      {/* Preview list */}
      {files.length > 0 && (
        <div className="flex mb-4">
          {photoPreviewList}
        </div>
      )}

      {/* Caption */}
      <textarea
        rows="2"
        id="caption"
        className="mb-4 block w-full px-2 py-1 rounded border resize-none"
        placeholder="Write a caption..."
        onChange={({ target }) => setCaption(target.value)}
        value={caption}
      />

      {/* Submit button */}
      <button
        type="submit"
        className="px-4 py-2 text-sm font-semibold bg-blue-500 rounded-lg text-white disabled:opacity-[0.2]"
        disabled={files.length < 1}
      >
        Post
      </button>
    </form>
  )
}