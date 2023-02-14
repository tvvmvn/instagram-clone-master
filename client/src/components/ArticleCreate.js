import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createArticleReq } from '../utils/requests';

export default function ArticleCreate({ active, setActive }) {

  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);

  async function handleSubmit(e) {
    try {
      e.preventDefault();

      const formData = new FormData();

      for (let file of files) {
        formData.append('images', file);
      }

      formData.append('description', description);

      await createArticleReq(formData);

      navigate('/');
      
    } catch (error) {
      alert(error);
    }
  }

  function close(e) {
    if (e.target === e.currentTarget) {
      setActive(false);
    }
  }

  // console.log(files)

  if (active) {
    return (
      <div className="fixed inset-0 bg-black/[0.2] z-10" onClick={close}>
        <button
          type="button"
          className="float-right text-2xl px-4 py-2 text-white"
          onClick={() => setActive(false)}
        >
          &times;
        </button>
        <form
          className="p-4 bg-white max-w-xs mt-20 mx-auto rounded-2xl"
          onSubmit={handleSubmit}
        >
          <h3 className="text-lg font-semibold text-center">Create new post</h3>
          <hr className="my-4" />
          <div className="mb-2">
            <label className="inline-block font-semibold text-sm px-4 py-2 bg-gray-200 rounded-lg cursor-pointer">
              <input
                type="file"
                className="hidden"
                onChange={({ target }) => setFiles(Array.from(target.files))}
                multiple={true}
                accept="image/*"
              />
              Select Photos +
            </label>

            <ul className="flex flex-wrap">
              {files.map(file => (
                <li key={file.name}>
                  <img className="w-16 h-16 object-cover" src={URL.createObjectURL(file)} alt={file.name} />
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-2">
            <label
              htmlFor="description"
              className="block font-semibold"
            >
              Description
            </label>
            <textarea
              rows="2"
              id="description"
              className="block w-full px-2 py-1 rounded border"
              onChange={({ target }) => setDescription(target.value)}
              value={description}
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 text-sm font-semibold bg-blue-500 rounded-lg text-white disabled:opacity-[0.2]"
            // disabled={images.length < 1}
          >
            Post
          </button>
        </form>
      </div>
    )
  }

}