export function Exercise3() {
  // Tạo object person với thuộc tính lồng nhau
  const person = {
    name: "Costas",
    address: {
      street: "Lalaland 12"
      // city không có, sẽ dùng giá trị mặc định
    }
  };

  // Dùng destructuring để lấy street và city (city mặc định "Unknown City")
  const {
    address: {
      street,
      city = "Unknown City"
    }
  } = person;

  return (
    <div>
      <h1>Exercise 3</h1>
      <p>Địa chỉ: {street}</p>
      <p>Thành phố: {city}</p>
    </div>
  );
}
export default Exercise3;

