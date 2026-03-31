const Stars = ({ count }) => {
  return (
    <div style={{ fontSize: "30px", margin: "10px" }}>
      {"⭐".repeat(count)}
    </div>
  );
};

export default Stars;
