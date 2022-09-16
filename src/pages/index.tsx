import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex flex-col max-w-4xl gap-10 my-auto">
        <div className="relative flex flex-col text-center scale-75 group lg:scale-100">
          <div className="duration-300 glow group-hover:opacity-100"></div>
          <div className="relative p-6 dark:bg-neutral-900 bg-neutral-100 rounded-xl">
            <h1 className="font-extrabold text-transparent cursor-default text-8xl bg-clip-text primary-gradient">
              Welcome to DShop!
            </h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
