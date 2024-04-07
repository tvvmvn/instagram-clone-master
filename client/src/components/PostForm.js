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
      <label className="mb-4 inline-flex cursor-pointer">
        <input
          type="file"
          className="hidden"
          onChange={({ target }) => setFiles(Array.from(target.files))}
          multiple={true}
          accept="image/png, image/jpg, image/jpeg, image/webp"
        />
        <span className="px-4 py-2 font-semibold text-sm border-2 border-black rounded-lg">
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