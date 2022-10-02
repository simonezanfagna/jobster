import React, { useState } from "react";
import BarChartComponent from "./BarChartComponent";
import AreaChartComponent from "./AreaChartComponent";
import Wrapper from "../assets/wrappers/ChartsContainer";
import { useSelector } from "react-redux";

export default function ChartsContainer() {
  const [barChart, setBarChart] = useState(true);
  const { monthlyApplications } = useSelector((store) => store.allJobs);

  return (
    <Wrapper>
      <h4>Monthly Applications</h4>
      <button type="button" onClick={() => setBarChart(!barChart)}>
        {barChart ? "Area Chart" : "Bar Chart"}
      </button>
      {barChart ? (
        <BarChartComponent data={monthlyApplications} />
      ) : (
        <AreaChartComponent data={monthlyApplications} />
      )}
    </Wrapper>
  );
}
