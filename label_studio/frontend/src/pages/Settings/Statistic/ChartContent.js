import React from "react";
import { CCard, CCardBody } from "@coreui/react";
import { CChartDoughnut } from "@coreui/react-chartjs";
import "bootstrap/dist/css/bootstrap.min.css";
import "@coreui/coreui/dist/css/coreui.min.css";

export const ChartContent = React.memo(() => {
  return (
    <div className="left-content">
      <div className="title">Task Status</div>
      <div className="content">
        <CCard className="mb-4">
          <CCardBody>
            <CChartDoughnut
              data={{
                datasets: [
                  {
                    backgroundColor: ["#41B883", "#E46651"],
                    data: [40, 20],
                  },
                ],
              }}
            />
          </CCardBody>
        </CCard>
        <div className="describe">
          <div className="stage">stage</div>
          <div className="ratito">ratito</div>
        </div>
        <div className="describe-content">
          <div className="stage">
            <div className="describe-div color-red" />
            annotated
          </div>
          <div className="ratito">20</div>
        </div>
        <div className="describe-content">
          <div className="stage">
            <div className="describe-div color-green" />
            done
          </div>
          <div className="ratito">40</div>
        </div>
      </div>
    </div>
  );
});
