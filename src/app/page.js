"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
// Styles import
import mountainsImage from "../../public/assets/images/mountains.png";

// Chart import
import Link from "next/link";
import GraphView from "./components/GraphView";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import ListView from "./list-view/page";

export default function Home() {
  // Date formats
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const month = monthNames[new Date().getMonth()];
  const day = new Date().getDate();
  const year = new Date().getFullYear();
  const todaysDate = `${month} ${day}, ${year}`;

  // State handling our previous improvements data
  const [improvements, setImprovements] = useState([]);
  // State handling our form data
  const [newImprovement, setNewImprovement] = useState({});

  const [completedImprovement, setCompletedImprovement] = useState();

  const [view, setView] = useState("graph");
  console.log("view", view);

  async function addNewImprovement(url, user, data) {
    console.log(JSON.stringify(data));
    const response = await fetch(`${url}${user}`, {
      method: "POST",
      mode: "cors",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const jsonData = await response.json();
    setCompletedImprovement(true);
    console.log(jsonData);
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Hello world");
    addNewImprovement(
      `http://localhost:3001/improvement/improvement?id=`,
      // Change this to dynamic userId
      "64be8452534548ff78bea27e",
      newImprovement
    );
    window.location.reload();
  };

  // If there's a date matching the current date, make the button disabled

  const url = "https://one-percent-better-api.onrender.com/user";

  async function fetchAPI() {
    const response = await fetch("http://localhost:3001/user", {
      mode: "cors",
      method: "GET",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    });
    const jsonData = await response.json();
    console.log("jsonData", jsonData);
    const individualDataArrays = await jsonData[0].improvements.map(
      (data, index, arr) => {
        if (arr.length - 1 === index) {
          if (data.date === todaysDate) {
            setCompletedImprovement(true);
          }
          const newSkillPercentage = data.skillPercentage * 1.01;
          setNewImprovement({
            ...newImprovement,
            skillPercentage: newSkillPercentage,
            date: todaysDate,
          });
        }
        setImprovements((oldImprovments) => [
          ...oldImprovments,
          {
            date: data.date,
            improvement: data.skillPercentage,
          },
        ]);
      }
    );
  }

  useEffect(() => {
    fetchAPI();
  }, []);

  if (improvements.length < 0) return <div>Loading...</div>;

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
        {/* Link to stats view */}
        <Link href="/list-view" className="btn--view">
          List view
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

        {/* Graph with data */}
        <div className="home-data rounded">
          {improvements ? (
            <Line
              datasetIdKey="id"
              data={{
                labels: [],
                datasets: [
                  {
                    id: 1,
                    label: "Web development skills",
                    data: improvements,
                    parsing: {
                      xAxisKey: "date",
                      yAxisKey: "improvement",
                    },
                  },
                ],
              }}
            />
          ) : (
            ""
          )}
        </div>

        {/* Form where you input what you worked on that day */}
        <form onSubmit={handleFormSubmit} id="improvementForm" className="form">
          <div className="improvement-form__content">
            <div className="improvement-form__text-wrapper improvement-form__text-wrapper--left">
              <label
                htmlFor="improvement"
                className="improvement-form__title--sm"
              >
                What I learned/practiced
              </label>
              <textarea
                name="improvement"
                id="improvement"
                onChange={(e) =>
                  setNewImprovement({
                    ...newImprovement,
                    description: e.target.value,
                  })
                }
                className="form__textarea form__textarea--light rounded"
                maxLength={50}
              ></textarea>
            </div>
            <div className="improvement-form__text-wrapper improvement-form__text-wrapper--centered">
              <h3 className="improvement-form__title--lg">Today's date</h3>
              <p className="improvement-form__date">{todaysDate}</p>
              <button
                type="submit"
                className={`btn btn--lg btn--dark rounded-md ${
                  completedImprovement ? "btn--disabled" : ""
                }`}
              >
                Add improvement
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
