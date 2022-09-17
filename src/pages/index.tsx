import type { NextPage } from "next";
import Store from "./store";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex flex-row py-10 justify-center">
      <Store />
      </div>
    </>
  );
};

export default Home;
