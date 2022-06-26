import "bootstrap/dist/css/bootstrap.min.css";
import "@coreui/coreui/dist/css/coreui.min.css";
import { ChartContent } from "./ChartContent";
import { StatisticsWrapper } from "./StatisticStyled";
import React from "react";
import { TableContent } from "./TableContent";

export const Statistics = () => {
  return (
    <StatisticsWrapper>
      <ChartContent />
      <TableContent />
    </StatisticsWrapper>
  );
};

Statistics.title = "Thống kê";
Statistics.path = "/statistic";
