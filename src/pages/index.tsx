import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className="flex flex-col gap-10 text-center">
      <h1 className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-palette-200 to-palette-500">Welcome to DShop!</h1>
    </div>
  );
};

export default Home;