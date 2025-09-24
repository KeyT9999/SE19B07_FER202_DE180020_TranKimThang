export function Exercise4() {
  // Mảng ages
  const ages = [33, 12, 20, 16];

  // Dùng destructuring để lấy các giá trị theo yêu cầu
  // first: phần tử đầu, bỏ qua phần tử thứ 2, third: phần tử thứ 3 (mặc định 0), restAges: phần còn lại
  const [first, , third = 0, ...restAges] = ages;

  return (
    <div>
      <h1>Exercise 4</h1>
      <p>first: {first}</p>
      <p>third: {third}</p>
      <p>restAges: {restAges.join(", ")}</p>
    </div>
  );
}
export default Exercise4;