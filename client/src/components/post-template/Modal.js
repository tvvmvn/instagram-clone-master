export default function Modal({
  id,
  setModalOpen,
  handleDelete
}) {
  function handleOverlay(e) {
    if (e.target === e.currentTarget) {
      setModalOpen(false);
    }
  }

  return (
    <div 
      className="fixed inset-0 flex justify-center items-center bg-black/[0.2] z-10" 
      onClick={handleOverlay}
    >
      <ul className="bg-white w-60 rounded-lg">
        <li className="border-b">
          <button
            className="w-full px-4 py-2 text-sm text-red-500"
            onClick={() => handleDelete(id)}
          >
            Delete
          </button>
        </li>
        <li>
          <button
            className="w-full px-4 py-2 text-sm"
            onClick={() => setModalOpen(false)}
          >
            Close
          </button>
        </li>
      </ul>
    </div>
  )
}