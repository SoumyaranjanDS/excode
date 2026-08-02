import React from "react";
import Hero from "./Hero";
import Feture from "./Feature";
import Seo from "../../components/Seo";

const Home = () => {
  return (
    <>
      <Seo 
        title="Home"
        url="/"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "excode",
          "applicationCategory": "EducationalApplication",
          "operatingSystem": "Web",
          "description": "AI-powered developer skill assessment platform and interactive coding arena."
        }}
      />
      <div className="flex flex-col w-full min-h-screen bg-background relative overflow-hidden">
        <Hero />
        <Feture />
      </div>
    </>
  );
};

export default Home;
