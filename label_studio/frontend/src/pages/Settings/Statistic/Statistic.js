import "bootstrap/dist/css/bootstrap.min.css";
import "@coreui/coreui/dist/css/coreui.min.css";
import { ChartContent } from "./ChartContent";
import { StatisticsWrapper } from "./StatisticStyled";
import React from "react";

export const Statistics = () => {
  const [startDate, setStartDate] = React.useState(
    new Date().toLocaleDateString("fr-CA"),
  );
  const [endDate, setEndDate] = React.useState(
    new Date().toLocaleDateString("fr-CA"),
  );
  return (
    <StatisticsWrapper>
      <ChartContent />
      <div className="right-content">
        <div className="title">Instance / Day</div>
        <div className="content">
          <div className="filter">
            <input
              type="text"
              id="fname"
              name="fname"
              className="input-search"
              placeholder="Tìm kiếm ..."
            />
            <div className="filter-right">
              <input
                className="calendar-statistic"
                name="project_due"
                id="project_due"
                type="date"
                data-date=""
                data-date-format="YYYY-MM-DD"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              {"  "} ~ {"  "}
              <input
                className="calendar-statistic"
                name="project_due"
                id="project_due"
                type="date"
                data-date=""
                data-date-format="YYYY-MM-DD"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Số nhãn dán</th>
                <th>Số nhãn review</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>huynhphoke@gmail.com</td>
                <td>300</td>
                <td>100</td>
              </tr>

              <tr>
                <td>huynhphoke@gmail.com</td>
                <td>30</td>
                <td>100</td>
              </tr>
              <tr>
                <td>huynhphoke@gmail.com</td>
                <td>30</td>
                <td>100</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </StatisticsWrapper>
  );
};

Statistics.title = "Thống kê";
Statistics.path = "/statistic";
