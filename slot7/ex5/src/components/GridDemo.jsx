// src/components/GridDemo.jsx
export default function GridDemo() {
  const box = (text) => (
    <div className="p-3 bg-secondary-subtle border"> {text} </div>
  );

  return (
    <div className="container mb-4">
      {/* Row 1: 2 cột bằng nhau */}
      <div className="row g-2 mb-2">
        <div className="col-md-6">{box("First col")}</div>
        <div className="col-md-6">{box("Second col")}</div>
      </div>

      {/* Row 2: 6 - 3 - 3 */}
      <div className="row g-2 mb-2">
        <div className="col-md-6">{box("col")}</div>
        <div className="col-md-3">{box("col")}</div>
        <div className="col-md-3">{box("col")}</div>
      </div>

      {/* Row 3: 4 - 4 - 4 */}
      <div className="row g-2">
        <div className="col-md-4">{box("col")}</div>
        <div className="col-md-4">{box("col")}</div>
        <div className="col-md-4">{box("col")}</div>
      </div>
    </div>
  );
}
