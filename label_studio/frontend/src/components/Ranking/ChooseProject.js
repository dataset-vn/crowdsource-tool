import React, { Component } from "react";
import AsyncSelect from "react-select/async";
import Select from "react-select";

export class Dropdown extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
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

  render() {
    return (
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
    );
  }
}
