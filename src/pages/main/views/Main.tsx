import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const MainPage: React.FC = () => {
  const inputEl = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.document.title = "🏡 git-3D-garden";
  }, []);

  function onEnterFarm() {
    const inputValue = inputEl.current?.value;
    navigate(`view-farm/${inputValue}`);
  }
  return (
    <>
      <div
        style={{
          backgroundImage: `url('https://i.pinimg.com/originals/51/3a/32/513a32a723edd6886d4e01a4789e6d4a.jpg')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          opacity: 0.15,
          zIndex: -1,
        }}
        className="h-screen w-screen absolute"
      />
      <div className="flex h-screen font-creepster">
        <div className="flex m-auto w-full flex-col">
          <p className="m-auto font-medium leading-tight text-xl mt-0 mb-2 text-red-600 mb-5">
            Enter the Github's username
          </p>
          <div className="w-1/6 m-auto ">
            <input
              ref={inputEl}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center text-2xl w-full"
              id="username"
              type="text"
              placeholder="Username"
              autoComplete="off"
            />
            <button
              onClick={onEnterFarm}
              className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded w-full"
            >
              Enter 3D Garden
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainPage;
