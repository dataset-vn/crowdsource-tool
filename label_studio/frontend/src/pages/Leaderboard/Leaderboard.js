import React, { Component } from 'react';
import '../../components/Ranking/Leaderboard.css';
import { EntryList } from '../../components/Ranking/EntryList';
import AsyncSelect from "react-select/async";

export class Leaderboard extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
        data: [],
        sortedByRecent: false,
        selectedOption: {},
    }
}

  ProjectList = (inputValue, callback) => {
    setTimeout(() => {
      fetch(
        "/api/projects" +
          inputValue,
        {
          method: "GET",
        }
      )
        .then((resp) => {
          return resp.json();
        })
        .then((data) => {
          const tempArray = [];
          if (data) {
            if (data.length) {
              data.forEach((project) => {
                tempArray.push({
                  label: `${project.title}`,
                  value: project.id,
                });
              });
            } else {
              tempArray.push({
                label: `${data.title}`,
                value: data.id,
              });
            }
          }
          callback(tempArray);
        })
        .catch((error) => {
          console.log(error, "Error");
        });
    }, 500);
  };

  onSearchChange = (selectedOption) => {
    if (selectedOption) {
      this.setState({
        selectedOption,
      });
    }
  };

  componentDidMount() {
    this.sortByTotal();
  }

  sortByRecent() {
    fetch("http://127.0.0.1:8080/api/projects/66/timeranking")
    .then((resp) => resp.json())
    .then((data) => {
        this.setState({
          data: data,
          sortedByRecent: true
        });
    });
  }

  sortByTotal() {
    fetch("http://127.0.0.1:8080/api/projects/66/ranking")
    .then((resp) => resp.json())
    .then((data) => {
        this.setState({
          data: data,
          sortedByRecent: false
        });
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Ranking Leaderboard</h1>
          These are our top contributors in Dataset JSC Labeling Platform
        </header>

        <div style={{ marginLeft: "40%", width: "300px" }}>
        <div>
          <p>Choose your projects:</p>
          <AsyncSelect
            value={this.state.selectedOption}
            loadOptions={this.ProjectList}
            placeholder="Project List"
            onChange={(e) => {
              this.onSearchChange(e);
            }}
            defaultOptions={true}
          />
        </div>
        </div>

        <section className="leaderboard">
          <div className="leaderboard__header">
            <p className="leaderboard__rank">Rank</p>
            <p className="leaderboard__name">Email</p>
            <p className={"leaderboard__recentPoints " + (this.state.sortedByRecent ? 'underline' : '')}
               onClick={this.sortByRecent.bind(this)}>
                Average lead time
            </p>
            <p className={"leaderboard__totalPoints " + (this.state.sortedByRecent ? '' : 'underline')}
               onClick={this.sortByTotal.bind(this)}>
                Total points
            </p>
          </div>
          <EntryList entries={this.state.data} />
        </section>
      </div>
    );
  }
}

Leaderboard.title = "Bảng xếp hạng";
Leaderboard.path = "/leaderboard";
Leaderboard.exact = true;



