import { useState } from "react";

export default function Form({ handleAddComment }) {
  
  const [content, setContent] = useState("");

  async function handleSubmit(e) {
    try {
      e.preventDefault();

      await handleAddComment(content);

      setContent("");

    } catch (error) {
      alert(error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <textarea
        rows="2"
        className="border w-full px-2 py-1 rounded resize-none"
        placeholder="Add a comment..."
        value={content}
        onChange={({ target }) => setContent(target.value)}
      />
      <button
        type="submit"
        className="bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-[0.2]"
        disabled={!content.trim()}
      >
        Add
      </button>
    </form>
  )
}

