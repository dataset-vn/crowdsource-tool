import React, { useState, useEffect } from "react";
import "../../components/Ranking/Leaderboard.css";
import { EntryList } from "../../components/Ranking/EntryList";
import AsyncSelect from "react-select/async";

//import { Dropdown } from "../../components/Ranking/ChooseProject";

export const Leaderboard = () => {
  const [listProject, setListProject] = useState([]);
  const [data, setData] = useState([]);

  const getListProjects = () => {
    fetch("http://127.0.0.1:8080/api/projects")
      .then((resp) => resp.json())
      .then((data) => {
        setListProject(
          data?.map((element) => {
            return {
              label: `${element.title}`,
              value: element.id,
            };
            // eslint-disable-next-line comma-dangle
          })
        );
      });
  };

  useEffect(() => {
    getListProjects();
  }, []);
  const sortByTotal = (projectID) => {
    console.log("projectID, projectID", projectID);
    fetch(`http://127.0.0.1:8080/api/projects/${projectID}/ranking`)
      .then((resp) => {
        return resp.json();
      })
      .then((data) => {
        setData(data);
      });
  };

  const ProjectList = (inputValue, callback) => {
    const searchData = listProject?.filter(
      (element) =>
        element?.label
          ?.toUpperCase()
          ?.trim()
          // eslint-disable-next-line comma-dangle
          ?.includes(inputValue?.toUpperCase().trim()) || inputValue === ""
    );
    if (listProject.length === 0) {
      fetch("http://127.0.0.1:8080/api/projects")
        .then((resp) => resp.json())
        .then((data) => {
          callback(
            data?.map((element) => {
              return {
                label: `${element.title}`,
                value: element.id,
              };
              // eslint-disable-next-line comma-dangle
            })
          );
        });
    }
    callback(searchData);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">Ranking Leaderboard</h1>
        These are our top contributors in Dataset JSC Labeling Platform
      </header>

      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ width: "300px" }}>
          <p>Choose your projects:</p>
          <AsyncSelect
            defaultOptions
            cacheOptions
            loadOptions={ProjectList}
            onChange={(e) => {
              console.log("eeeee", e);
              sortByTotal(e?.value);
            }}
          />
        </div>
      </div>

      <section className="leaderboard">
        <div className="leaderboard__header">
          <p className="leaderboard__rank">Rank</p>
          <p className="leaderboard__name">Email</p>
          <p className="leaderboard__recentPoints ">Points in last 30 days</p>
          <p className={"leaderboard__totalPoints "}>Total points</p>
        </div>
        <EntryList entries={data} />
      </section>
    </div>
  );
};

Leaderboard.title = "Bảng xếp hạng";
Leaderboard.path = "/leaderboard";
Leaderboard.exact = true;
