import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className="relative flex flex-col gap-10 text-center group">
      <div className="glow group-hover:opacity-100 duration-300"></div>
      <div className="relative bg-neutral-900 p-6 rounded-xl">
        <h1 className="text-8xl font-extrabold text-transparent bg-clip-text primary-gradient cursor-default">Welcome to DShop!</h1>
        </div>
      </div>
  );
};

export default Home;