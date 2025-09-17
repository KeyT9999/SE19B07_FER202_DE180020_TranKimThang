const companies = [
  { name: "Company One", category: "Finance", start: 1981, end: 2004 },
];

// Tạo một bản sao company0New từ companies[0] và tăng start lên 1
// Dùng spread (...) để sao chép thuộc tính, đảm bảo không làm thay đổi companies[0]
const company0New = { ...companies[0], start: companies[0].start + 1 };

console.log("companies[0]:", companies[0]); // In ra bản gốc
console.log("company0New:", company0New);   // In ra bản mới đã thay đổi start

// Hàm concatAll sử dụng rest parameter (...arrays) để nhận nhiều mảng
// Dùng [].concat(...arrays) để gộp tất cả các mảng thành một mảng mới
function concatAll(...arrays) {
  return [].concat(...arrays);
}

console.log(concatAll([1, 2], [3], [4, 5])); // In ra mảng đã gộp: [1, 2, 3, 4, 5]