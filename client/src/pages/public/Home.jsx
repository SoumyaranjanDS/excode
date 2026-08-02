import React from "react";
import Hero from "./Hero";
import Feture from "./Feature";
import Seo from "../../components/Seo";

const Home = () => {
  return (
    <>
      <Seo 
        title="Developer Skill Assessment Platform & AI Coding Interview Tool"
        description="Excode is an online coding test platform for hiring. Evaluate candidates with Docker sandbox coding assessments and hire developers based on verified coding skills."
        url="/"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "excode",
            "applicationCategory": "EducationalApplication",
            "operatingSystem": "Web",
            "description": "AI-powered developer skill assessment platform and interactive coding arena."
          },
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "excode",
            "url": "https://excode.in",
            "logo": "https://excode.in/excode.svg"
          }
        ]}
      />
      <div className="flex flex-col w-full min-h-screen bg-background relative overflow-hidden">
        <Hero />
        <Feture />
      </div>
    </>
  );
};

export default Home;
