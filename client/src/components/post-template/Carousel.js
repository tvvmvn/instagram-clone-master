import { useState } from "react";

export default function Carousel({ photoUrls }) {
  
  const [photoIndex, setPhotoIndex] = useState(0);
  const isFirstPhoto = photoIndex === 0;
  const isLastPhoto = photoIndex === photoUrls.length - 1;

  const photoList = photoUrls.map(photoUrl => (
    <li key={photoUrl} className="w-full h-[450px] flex-none">
      <img
        src={photoUrl}
        className="w-full h-full object-cover"
        alt=""
      />
    </li>
  ))

  const prevBtn = (
    <div className="absolute top-0 left-0 h-full flex items-center">
      <svg
        className="w-4 fill-white/[0.8] mx-2"
        onClick={() => setPhotoIndex(photoIndex - 1)}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <path d="M256 0C114.6 0 0 114.6 0 256c0 141.4 114.6 256 256 256s256-114.6 256-256C512 114.6 397.4 0 256 0zM310.6 345.4c12.5 12.5 12.5 32.75 0 45.25s-32.75 12.5-45.25 0l-112-112C147.1 272.4 144 264.2 144 256s3.125-16.38 9.375-22.62l112-112c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L221.3 256L310.6 345.4z" />
      </svg>
    </div>
  )

  const nextBtn = (
    <div className="absolute top-0 right-0 h-full flex items-center">
      <svg
        className="w-4 fill-white/[0.8] mx-2"
        onClick={() => setPhotoIndex(photoIndex + 1)}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <path d="M256 0C114.6 0 0 114.6 0 256c0 141.4 114.6 256 256 256s256-114.6 256-256C512 114.6 397.4 0 256 0zM358.6 278.6l-112 112c-12.5 12.5-32.75 12.5-45.25 0s-12.5-32.75 0-45.25L290.8 256L201.4 166.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l112 112C364.9 239.6 368 247.8 368 256S364.9 272.4 358.6 278.6z" />
      </svg>
    </div>
  )

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

      {/* Buttons */}
      {!isFirstPhoto && prevBtn}
      {!isLastPhoto && nextBtn}

      {/* Indicator */}
      <ul className="absolute bottom-0 w-full pb-4 flex justify-center gap-1 ">
        {dots}
      </ul>
    </div>
  )
} 