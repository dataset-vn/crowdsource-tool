import { Block, Elem } from "../../../utils/bem";
import {
  CRow,
  CCard,
  CCol,
  CDropdown,
  CCardHeader,
  CCardBody,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
} from "@coreui/react";
import { getStyle } from "@coreui/utils";
import {
  CChartBar,
  CChartLine,
  CChartDoughnut,
  CChartPie,
  CChartPolarArea,
} from "@coreui/react-chartjs";
import CIcon from "@coreui/icons-react";
import { cilArrowBottom, cilOptions } from "@coreui/icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "@coreui/coreui/dist/css/coreui.min.css";

export const Statistics = () => {
  const random = () => Math.round(Math.random() * 100);
  return (
    <>
      <Block>
        <Elem name="column" mix="email">
          ádasdas
        </Elem>
        <Block>
          <CCol sm={6} lg={3}>
            <CWidgetStatsA
              className="mb-4"
              color="primary"
              value={
                <>
                  26K{" "}
                  <span className="fs-6 fw-normal">
                    (-12.4% <CIcon icon={cilArrowBottom} />)
                  </span>
                </>
              }
              title="Users"
              action={
                <CDropdown alignment="end">
                  <CDropdownToggle
                    color="transparent"
                    caret={false}
                    className="p-0"
                  >
                    <CIcon
                      icon={cilOptions}
                      className="text-high-emphasis-inverse"
                    />
                  </CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem>Action</CDropdownItem>
                    <CDropdownItem>Another action</CDropdownItem>
                    <CDropdownItem>Something else here...</CDropdownItem>
                    <CDropdownItem disabled>Disabled action</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              }
              chart={
                <CChartLine
                  className="mt-3 mx-3"
                  style={{ height: "70px" }}
                  data={{
                    labels: [
                      "January",
                      "February",
                      "March",
                      "April",
                      "May",
                      "June",
                      "July",
                    ],
                    datasets: [
                      {
                        label: "My First dataset",
                        backgroundColor: "transparent",
                        borderColor: "rgba(255,255,255,.55)",
                        pointBackgroundColor: getStyle("--cui-primary"),
                        data: [65, 59, 84, 84, 51, 55, 40],
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        grid: {
                          display: false,
                          drawBorder: false,
                        },
                        ticks: {
                          display: false,
                        },
                      },
                      y: {
                        min: 30,
                        max: 89,
                        display: false,
                        grid: {
                          display: false,
                        },
                        ticks: {
                          display: false,
                        },
                      },
                    },
                    elements: {
                      line: {
                        borderWidth: 1,
                        tension: 0.4,
                      },
                      point: {
                        radius: 4,
                        hitRadius: 10,
                        hoverRadius: 4,
                      },
                    },
                  }}
                />
              }
            />
          </CCol>
          <CRow>
            <CCol xs={6}>
              <CCard className="mb-4">
                <CCardHeader>Bar Chart</CCardHeader>
                <CCardBody>
                  <CChartBar
                    data={{
                      labels: [
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                      ],
                      datasets: [
                        {
                          label: "GitHub Commits",
                          backgroundColor: "#f87979",
                          data: [40, 20, 12, 39, 10, 40, 39, 80, 40],
                        },
                      ],
                    }}
                    labels="months"
                  />
                </CCardBody>
              </CCard>
            </CCol>
            <CCol xs={6}>
              <CCard className="mb-4">
                <CCardHeader>Line Chart</CCardHeader>
                <CCardBody>
                  <CChartLine
                    data={{
                      labels: [
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                      ],
                      datasets: [
                        {
                          label: "My First dataset",
                          backgroundColor: "rgba(220, 220, 220, 0.2)",
                          borderColor: "rgba(220, 220, 220, 1)",
                          pointBackgroundColor: "rgba(220, 220, 220, 1)",
                          pointBorderColor: "#fff",
                          data: [
                            random(),
                            random(),
                            random(),
                            random(),
                            random(),
                            random(),
                            random(),
                          ],
                        },
                        {
                          label: "My Second dataset",
                          backgroundColor: "rgba(151, 187, 205, 0.2)",
                          borderColor: "rgba(151, 187, 205, 1)",
                          pointBackgroundColor: "rgba(151, 187, 205, 1)",
                          pointBorderColor: "#fff",
                          data: [
                            random(),
                            random(),
                            random(),
                            random(),
                            random(),
                            random(),
                            random(),
                          ],
                        },
                      ],
                    }}
                  />
                </CCardBody>
              </CCard>
            </CCol>
            <CCol xs={6}>
              <CCard className="mb-4">
                <CCardHeader>Doughnut Chart</CCardHeader>
                <CCardBody>
                  <CChartDoughnut
                    data={{
                      labels: ["VueJs", "EmberJs", "ReactJs", "AngularJs"],
                      datasets: [
                        {
                          backgroundColor: [
                            "#41B883",
                            "#E46651",
                            "#00D8FF",
                            "#DD1B16",
                          ],
                          data: [40, 20, 80, 10],
                        },
                      ],
                    }}
                  />
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </Block>
      </Block>
    </>
  );
};

Statistics.title = "Thống kê";
Statistics.path = "/statistic";
