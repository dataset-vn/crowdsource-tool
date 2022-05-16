import React, { Component } from "react";
import "./Leaderboard.css";

export const EntryList = ({ entries }) => {
  const entry = entries.map((entry, i) => {
    return (
      <li key={i} className="leaderboard__entry">
        <p className="leaderboard__rank">{i + 1}</p>
        <p className="leaderboard__name">{entry.email}</p>
        <p className="leaderboard__recentPoints">{entry.avg_lead_time}</p>
        <p className="leaderboard__totalPoints">{entry.total_points}</p>
      </li>
    );
  });

  return <ul>{entry}</ul>;
};

export default EntryList;
