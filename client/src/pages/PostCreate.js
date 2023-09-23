import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from '../service/api';

export default function PostCreate() {

  const navigate = useNavigate();
  const [caption, setCaption] = useState("");
  const [files, setFiles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

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

  const overlay = (
    <div 
      className="fixed inset-0 bg-black/[0.2] z-10" 
      onClick={handleOverlay}
    >
      <form
        className="bg-white max-w-xs mt-20 mx-auto rounded-2xl"
        onSubmit={handleSubmit}
      >
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-center">Create new post</h3>
        </div>

        <div className="p-4">
          {/* Upload button */}
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

          {/* Caption */}
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

  return (
    <>
      {/* Modal button */}
      <svg
        className="opacity-40 w-12 fixed right-8 bottom-8 hover:opacity-80 cursor-pointer z-10"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        onClick={() => setModalOpen(true)}
      >
        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344V280H168c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H280v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
      </svg>

      {modalOpen && overlay}
    </>  
  )
}