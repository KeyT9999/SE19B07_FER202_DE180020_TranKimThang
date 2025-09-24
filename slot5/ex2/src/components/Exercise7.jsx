export function Exercise7() {
  // Mảng companies
  const companies = [
    { name: "Company One", category: "Finance", start: 1981, end: 2004 }
  ];

  // Tạo company0New với start += 1 mà không làm đổi companies[0] (dùng spread)
  const company0New = { ...companies[0], start: companies[0].start + 1 };

  // Hàm concatAll dùng rest parameter để nhận nhiều mảng, dùng spread để gộp
  function concatAll(...arrays) {
    return [].concat(...arrays);
  }

  return (
    <div>
      <h1>Exercise 7</h1>
      <p>companies[0]: {JSON.stringify(companies[0])}</p>
      <p>company0New: {JSON.stringify(company0New)}</p>
      <p>concatAll([1,2],[3],[4,5]): {JSON.stringify(concatAll([1,2],[3],[4,5]))}</p>
    </div>
  );
}
export default Exercise7;