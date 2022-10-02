import StatItem from "./StatItem";
import { FaSuitcaseRolling, FaCalendarCheck, FaBug } from "react-icons/fa";
import Wrapper from "../assets/wrappers/StatsContainer";
import { useSelector } from "react-redux";

export default function StatsContainer() {
  const { stats } = useSelector((store) => store.allJobs);

  const defaultStats = [
    {
      title: "pending applications",
      count: stats.pending || 0,
      icon: <FaSuitcaseRolling />,
      color: "#e9b949",
      backgroundColor: "#fcefc7",
    },
    {
      title: "interviews scheduled",
      count: stats.interview || 0,
      icon: <FaCalendarCheck />,
      color: "#647acb",
      backgroundColor: "#e0e8f9",
    },
    {
      title: "jobs declined",
      count: stats.declined || 0,
      icon: <FaBug />,
      color: "#d66a6a",
      backgroundColor: "#ffeeee",
    },
  ];

  return (
    <Wrapper>
      {defaultStats.map((stat, index) => {
        return <StatItem key={index} {...stat} />;
      })}
    </Wrapper>
  );
}
