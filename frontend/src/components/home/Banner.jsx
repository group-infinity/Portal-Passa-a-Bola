// src/components/Banner.jsx

function Banner({ img, cor, txt }) {
  return (
    <div className="relative -top-5 flex w-full flex-col items-center justify-center overflow-hidden py-10 lg:py-17">
      <img
        src={img}
        alt=""
        className="absolute inset-0 -z-10 h-full w-full object-fill"
      />

      <div className="w-fit -rotate-[3.17deg] bg-white p-4">
        <h2
          style={{ color: `${cor}` }}
          className="break-words text-center font-[Anton] !text-4xl uppercase lg:!text-8xl"
        >
          {txt}
        </h2>
      </div>
    </div>
  );
}

export default Banner;