import { useMemo, useState } from "react";
import { Card } from "../../../components";
import { useTranslation } from "react-i18next";
import "./Statistics.styl";

export const Statistics = () => {

  return (
    <Card size="small" bodyStyle={{ padding: "0", paddingTop: "1px" }}>
       <p> Header </p>
    </Card>
  );
};

Statistics.title = "Thống kê";
Statistics.path = "/statistics";