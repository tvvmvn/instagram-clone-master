import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from '../service/api';

export default function PostCreate({ setModalOpen }) {

  const navigate = useNavigate();
  const [caption, setCaption] = useState("");
  const [files, setFiles] = useState([]);

  async function handleSubmit(e) {
    try {
      e.preventDefault();

      const formData = new FormData();

      files.forEach(file => {
        formData.append('photos', file);
      })

      formData.append('caption', caption);

      await createPost(formData);

      navigate('/');

    } catch (error) {
      alert(error);
    }
  }

  function handleOverlay(e) {
    if (e.target === e.currentTarget) {
      setModalOpen(false)
    }
  }

  const photoPreviewList = files.map(file => (
    <li key={file.name} className="pt-[100%] relative">
      <img
        className="absolute inset-0 w-full h-full object-cover"
        src={URL.createObjectURL(file)}
        alt={file.name}
      />
    </li>
  ))

  return (
    <div 
      className="fixed inset-0 bg-black/[0.2] z-10" 
      onClick={handleOverlay}
    >
      {/* Modal close Button */}
      <button
        type="button"
        className="float-right text-2xl px-4 py-2 text-white"
        onClick={() => setModalOpen(false)}
      >
        &times;
      </button>

      {/* Create Form */}
      <form
        className="bg-white max-w-xs mt-20 mx-auto rounded-2xl"
        onSubmit={handleSubmit}
      >
        {/* Title */}
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-center">Create new post</h3>
        </div>

        <div className="p-4">
          {/* Upload Button */}
          <label className="inline-block mb-2 font-semibold text-sm px-4 py-2 bg-gray-200 rounded-lg cursor-pointer">
            <input
              type="file"
              className="hidden"
              onChange={({ target }) => setFiles(Array.from(target.files))}
              multiple={true}
              accept="image/png, image/jpg, image/jpeg"
            />
            Select Photos +
          </label>

          {/* Preview list */}
          {files.length > 0 && (
            <ul className="grid grid-cols-3 mb-2">
              {photoPreviewList}
            </ul>
          )}

          {/* Caption writing area */}
          <div className="mb-2">
            <label
              htmlFor="caption"
              className="block font-semibold"
            >
              Caption
            </label>
            <textarea
              rows="2"
              id="caption"
              className="block w-full px-2 py-1 rounded border resize-none"
              onChange={({ target }) => setCaption(target.value)}
              value={caption}
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 text-sm font-semibold bg-blue-500 rounded-lg text-white disabled:opacity-[0.2]"
            disabled={files.length < 1}
          >
            Post
          </button>
        </div>
      </form>
    </div>
  )
}