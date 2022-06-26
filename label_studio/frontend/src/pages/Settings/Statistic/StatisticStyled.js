import styled from "styled-components";

export const StatisticsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  .title {
    width: 100%;
    background-color: #d6a2e8;
    padding: 8px 20px;
    border-radius: 4px;
    font-weight: bold;
    font-size: 14px;
  }
  input:focus {
    outline-width: 0;
  }
  .content {
    margin-top: 16px;
    width: 100%;
    min-height: 80vh;
    border: 1px solid #dfe4ea;
    border-radius: 4px;
    padding: 10px;
  }
  .color-red {
    background-color: #e46651;
  }
  .color-green {
    background-color: #41b883;
  }
  .describe-div {
    width: 10px;
    height: 10px;
    margin-right: 12px;
    margin-left: -22px;
  }
  .left-content {
    width: 25%;
    margin-right: 20px;
    .mb-4 {
      margin: 10px 40px;
    }
    .describe {
      display: flex;
      width: 100%;
      flex-direction: row;
      font-weight: bold;
      font-size: 14px;
      background-color: #7bed9f;
      border-radius: 16px;
      padding: 6px 30px;
      margin-bottom: 10px;
      .stage {
        width: 70%;
      }
      .ratito {
        width: 30%;
      }
    }
    .describe-content {
      display: flex;
      width: 100%;
      flex-direction: row;
      font-size: 14px;
      padding: 10px 30px;
      border-bottom: 1px solid #dfe4ea;
      .stage {
        width: 70%;
        display: flex;
        flex-direction: row;
        align-items: center;
      }
      .ratito {
        width: 30%;
      }
    }
  }
  .right-content {
    width: 75%;
    .filter {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .input-search {
        width: 250px;
        padding: 5px 8px;
      }
      .calendar-statistic {
        padding: 5px 8px;
        margin-left: 20px;
        margin-right: 20px;
      }
      .filter-right {
        display: flex;
        flex-direction: row;
        align-items: center;
      }
    }
    table {
      width: 100%;
      margin-top: 50px;
      thead {
        tr {
          border-bottom: 1px solid #dfe4ea;
          td {
            padding-bottom: 12px;
          }
        }
      }
      tbody {
        tr {
          td {
            padding: 12px 0px;
          }
          border-bottom: 1px solid #dfe4ea;
        }
      }
    }
  }
`;
