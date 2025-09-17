function sum(...nums) {
  // nums là mảng các tham số truyền vào hàm
  // Lọc ra các giá trị là số hợp lệ (typeof === "number" và không phải NaN)
  const validNums = nums.filter(n => typeof n === "number" && !isNaN(n));
  // Tính tổng các số hợp lệ bằng reduce
  const total = validNums.reduce((acc, cur) => acc + cur, 0);

  return total; // trả về tổng
}

console.log(sum(1, 2, 3));      // 6
console.log(sum(1, "x", 4));    // 5

function avg(...nums) {
  // Lọc ra các giá trị là số hợp lệ
  const validNums = nums.filter(n => typeof n === "number" && !isNaN(n));

  // Nếu không có số hợp lệ thì trả về 0
  if (validNums.length === 0) return 0;
  // Tính tổng các số hợp lệ
  const total = validNums.reduce((acc, cur) => acc + cur, 0);
  // Tính trung bình cộng
  const average = total / validNums.length;
  // Trả về kết quả làm tròn 2 chữ số thập phân (dạng chuỗi)
  return average.toFixed(2);
}

console.log(avg(1, 2, 3, 4));   // "2.50"
console.log(avg());             // 0



