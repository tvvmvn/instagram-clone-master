import { useState } from "react";
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";

export default function Carousel({ photoUrls }) {
  
  const [photoIndex, setPhotoIndex] = useState(0);
  const isFirstPhoto = photoIndex === 0;
  const isLastPhoto = photoIndex === photoUrls.length - 1;

  const photoList = photoUrls.map(photoUrl => (
    <li key={photoUrl} className="w-full h-[450px] flex-none">
      <img
        src={photoUrl}
        className="w-full h-full object-cover"
        alt={photoUrl}
      />
    </li>
  ))

  const dots = photoUrls.map((photoUrl, dotIndex) => (
    <li
      key={photoUrl}
      className="w-2 h-2 rounded-full bg-white opacity-50"
      style={{ opacity: (dotIndex === photoIndex) && "1" }}
    >
    </li>
  ))

  return (
    <div className="overflow-x-hidden relative">
      {/* Photos */}
      <ul
        className="flex transition"
        style={{ transform: `translateX(-${photoIndex * 100}%)`}}
      >
        {photoList}
      </ul>

      {/* Prev button */}
      {!isFirstPhoto && (
        <div className="absolute top-0 left-0 h-full flex items-center">
          <FaCircleChevronLeft
            className="ml-3"
            size="18" 
            color="white" 
            onClick={() => setPhotoIndex(photoIndex - 1)}
          />
        </div>
      )}

      {/* Next button */}
      {!isLastPhoto && (
        <div className="absolute top-0 right-0 h-full flex items-center">
          <FaCircleChevronRight
            className="mr-3"
            size="18" 
            color="white" 
            onClick={() => setPhotoIndex(photoIndex + 1)}
          />
        </div>
      )}

      {/* Indicator */}
      {photoUrls.length > 1 && (
        <ul className="absolute bottom-0 w-full pb-4 flex justify-center gap-2">
          {dots}
        </ul>
      )}
    </div>
  )
} 