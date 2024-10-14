import React from "react";
import "./MainPage.css";
import Navbar from "../components/Navbar";

const MainPage = () => {
  return (
    <div className="MainPage">
      <Navbar/>
      <div className="text-container">
        <h1>About R6TV</h1>
        <p>R6TV is a passion project meant to create a semi official ranking of the top teams! Currently the only "ranking" we have is SI points which is not dynamic nor always accurate.</p>
        <p>R6TV is a traditional elo system allocating a beginning elo value based on their region and then any matches* they have will raise or lower their value based on their opponents</p>
        <h4>Here are the initial elo values for each region***</h4>
        <ul>
            <li>NA: 1500</li>
            <li>EU: 1500</li>
            <li>BR: 1500</li>
            <li>OCE: 1375</li>
            <li>ASIA: 1375</li>
            <li>JPN: 1375</li>
            <li>KR: 1375</li>
            <li>MENA: 1375</li>
            <li>LATAM: 1325**</li>
        </ul>
        <h5>* Matches are defined as any official Blast Series game between two teams who are in a closed regional league during 2024 (now including EWC)</h5>
        <h5>** LATAM is given a lower initial value due to the number of teams in the league</h5>
        <h5>*** These values may be tweaked with time as this project is still in its infancy</h5>
        <h5>Made by <a href="https://x.com/BennTheBean">@BennTheBean</a></h5>
      </div>
    </div>
  );
};

export default MainPage;