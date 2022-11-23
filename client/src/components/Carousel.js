import {useState} from "react";

export default function Carousel({images}) {
  const [index, setIndex] = useState(0);

  console.log(index);

  return (
    <div className="overflow-x-hidden relative">
      <ul className="flex transition" style={{transform: `translateX(-${index*100}%)`}}>
        {images.map(image => (
          <li key={image} className="w-full h-80 shrink-0">
            <img
              src={`${process.env.REACT_APP_HOSTNAME}/articles/${image}`}
              className="w-full h-full object-cover"
              alt={image}
            />
          </li>
        ))}
      </ul>

      <div className="absolute top-0 left-0 h-full flex items-center">
        <button
          className="bg-white px-2 hidden"
          onClick={() => setIndex(index - 1)}
          style={{display: index !==0 && "block"}}
        >
          &#10094;
        </button>
      </div>

      <div className="absolute top-0 right-0 h-full flex items-center">
        <button
          className="bg-white px-2 hidden"
          onClick={() => setIndex(index + 1)}
          style={{display: index !== images.length - 1 && "block"}}
        >
          &#10095;
        </button>
      </div>

      <ul className="absolute bottom-0 w-full py-2 flex justify-center gap-1 ">
        {images.map((image, i) => (
          <li 
            key={i} 
            className="w-2 h-2 rounded-full bg-white/[0.4]" 
            style={{ backgroundColor: i === index && "#555" }}
          >
          </li>
        ))}
      </ul>
    </div>
  )
} 