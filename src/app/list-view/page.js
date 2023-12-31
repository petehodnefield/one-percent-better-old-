"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
// Styles import
import mountainsImage from "../../../public/assets/images/mountains.png";
import ImprovementDetails from "../components/ImprovementDetails";

import Link from "next/link";

const ListView = ({ setView }) => {
  // Fetch our API for all improvements
  const [improvements, setImprovements] = useState();

  useEffect(() => {
    async function fetchAPI() {
      const response = await fetch("http://localhost:3001/user", {
        mode: "cors",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      });
      const jsonData = await response.json();
      const improvementsData = jsonData[0].improvements;
      setImprovements(improvementsData);
    }
    fetchAPI();
  }, []);

  return (
    <main className="home">
      {/* Background image */}
      <Image
        className="cover bg-img"
        src={mountainsImage}
        alt="A background image of colorful mountains representing growth"
      />

      {/* Title */}
      <div className="home__title-wrapper">
        <div className="home__title-content">
          <h1>
            <Link className="home__title" href={"/"}>
              1% Better
            </Link>
          </h1>
        </div>
      </div>

      <div className="home-content rounded-lg">
        <Link href="/" className="btn--view">
          Graph view
        </Link>
        {/* Text wrapper */}
        <div className="home-content__text-wrapper">
          <h2 className="home-content__title">My focus:</h2>
          <p className="home-content__goal">
            Increase my{" "}
            <span className="bold text--primary">web developer</span> skills by
            1% every day.
          </p>{" "}
        </div>
        {/* Container with improvement data */}
        <div className="home-data  home-data--list rounded">
          <div className="list__title-wrapper">
            <h3 className="list__title list__column--1">Date</h3>
            <h3 className="list__title list__column--2">Description</h3>
            <h3 className="list__title list__column--3">Skill Level</h3>
          </div>
          {/* This is where we'll map through all of our improvements */}
          {improvements
            ? improvements
                .toReversed()
                .map((improvement) => (
                  <ImprovementDetails
                    key={improvement.date}
                    improvement={improvement}
                  />
                ))
            : ""}
        </div>
      </div>
    </main>
  );
};

export default ListView;
