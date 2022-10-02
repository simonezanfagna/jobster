import Wrapper from "../assets/wrappers/StatItem";

export default function StatItem({
  title,
  color,
  count,
  icon,
  backgroundColor,
}) {
  return (
    <Wrapper color={color} backgroundColor={backgroundColor}>
      <header>
        <span className="count">{count}</span>
        <span className="icon">{icon}</span>
      </header>
      <h5 className="title">{title}</h5>
    </Wrapper>
  );
}
