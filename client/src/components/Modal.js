import {useState} from "react";

export default function Modal({children}) {
  const [active, setActive] = useState(false);

  const modal = (
    <div className="fixed inset-0 flex justify-center items-center bg-black/[0.2] z-10">
      <ul className="bg-white w-48 rounded">
        {children}
        <li>
          <button className="w-full p-1 text-red-400" onClick={() => setActive(false)}>Close</button>
        </li>
      </ul>  
    </div>
  )

  return (
    <>
      <button onClick={() => setActive(true)}>=</button>
      {active && modal}
    </>
  )
}