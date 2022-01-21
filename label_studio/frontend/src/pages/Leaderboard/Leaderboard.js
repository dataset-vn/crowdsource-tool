import React, { Component } from 'react';
import '../../components/Ranking/Leaderboard.css';
import EntryList from '../../components/Ranking/EntryList';
import { Button } from "../../components";

export class Leaderboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
        data: [],
        sortedByRecent: false
    }
}

  componentDidMount() {
    this.sortByTotal();
  }

  sortByRecent() {
    fetch('http://127.0.0.1:8080/api/projects/43/recentranking')
    .then((resp) => resp.json())
    .then((data) => {
        this.setState({
          data: data,
          sortedByRecent: true
        });
    });
  }

  sortByTotal() {
    fetch('http://127.0.0.1:8080/api/projects/43/ranking')
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
        <section className="leaderboard">
          <div className="leaderboard__header">
            <p className="leaderboard__rank">Rank</p>
            <p className="leaderboard__name">Email</p>
            <p className={"leaderboard__recentPoints " + (this.state.sortedByRecent ? 'underline' : '')}
               onClick={this.sortByRecent.bind(this)}>
                Points in last 30 days
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



