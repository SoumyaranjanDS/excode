import React from "react";
import Hero from "./Hero";
import Feture from "./Feature";

const Home = () => {
  return (
    <div className="flex flex-col w-full min-h-screen bg-background relative overflow-hidden">
      <Hero />
      <Feture />
    </div>
  );
};

export default Home;
