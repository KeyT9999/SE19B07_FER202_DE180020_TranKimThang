function Exercise1() {
  // Hàm Double
  const double = n => n * 2;
  // Hàm kiểm tra số chẵn
  const isEven = n => n % 2 === 0;


  return (
    <div>
      <h1>Exercise 1</h1>
      <p>Kết quả hàm double(5): {double(5)}</p>
      <p>Kết quả isEven(4): {isEven(4) ? "Số chẵn" : "Số lẻ"}</p>
    </div>
  );
}
export default Exercise1;