// Hàm double nhận một số x và trả về x nhân 2 (dùng arrow function)
const double = (x) => x * 2;
console.log(double(5)); // 10

// Hàm isEven nhận một số x và trả về true nếu x là số chẵn, false nếu lẻ
const isEven = (x) => {return x % 2 === 0}
console.log(isEven(7)); // false

// Cách khác: viết arrow function ngắn gọn hơn
const double2 = n => n * 2;
console.log(double2(6)); // 12

const isEven2 = n => n % 2 === 0;
console.log(isEven2(8)); // true