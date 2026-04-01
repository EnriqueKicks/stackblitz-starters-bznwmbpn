export default function Stars({ count = 0 }) {
  return (
    <div style={{ fontSize: "40px", marginTop: "10px" }}>
      {count === 3 && "⭐⭐⭐"}
      {count === 2 && "⭐⭐"}
      {count === 1 && "⭐"}
    </div>
  );
}
