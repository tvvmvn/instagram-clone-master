import { useRef, useEffect } from 'react';

export default function Form({ search }) {
  
  const inputEl = useRef(null);

  useEffect(() => {
    inputEl.current.focus();
  })

  return (
    <label className="block mb-4">
      <input
        type="text"
        className="border px-2 py-1 rounded w-full outline-none"
        onChange={({ target }) => search(target.value)}
        placeholder="Search"
        ref={inputEl}
      />
    </label>
  )
}