const ages = [33, 12, 20, 16];

// Hàm getAges sử dụng destructuring để lấy các giá trị từ mảng
// [first, , third = 0, ...restAges]:
// - first: phần tử đầu tiên
// - bỏ qua phần tử thứ 2 (dấu phẩy thứ 2)
// - third: phần tử thứ 3, mặc định là 0 nếu không tồn tại
// - restAges: mảng chứa các phần tử còn lại
function getAges([first, , third = 0, ...restAges]) {
  console.log("first:", first);
  console.log("third:", third);
  console.log("restAges:", restAges);
}

getAges(ages);

// Cách khác: destructuring trực tiếp ngoài hàm
const ages2 = [33, 12, 20, 16];

// Lấy first2 là phần tử đầu, bỏ qua phần tử thứ 2, third2 là phần tử thứ 3 (mặc định 0), restAges2 là mảng còn lại
const [first2, , third2 = 0, ...restAges2] = ages2;

console.log("first:", first2);
console.log("third:", third2);
console.log("restAges:", restAges2);