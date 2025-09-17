const ages = [33, 12, 20, 16, 5, 54, 21, 44, 61, 13, 15, 45, 25, 64, 32];

// Dùng reduce để tính tổng, min, max và đếm số lượng teen/adult
const stats = ages.reduce(
  (acc, age) => {
    acc.total += age; // cộng tuổi hiện tại vào tổng
    acc.min = Math.min(acc.min, age); // cập nhật giá trị nhỏ nhất
    acc.max = Math.max(acc.max, age); // cập nhật giá trị lớn nhất
    if (age >= 13 && age <= 19) acc.buckets.teen++; // nếu là teen thì tăng teen lên 1
    if (age >= 20) acc.buckets.adult++; // nếu là adult thì tăng adult lên 1
    return acc; // trả về accumulator cho lần lặp tiếp theo
  },
  { total: 0, min: Infinity, max: -Infinity, buckets: { teen: 0, adult: 0 } } // giá trị khởi tạo
);

// In kết quả ra màn hình
console.log(`Total: ${stats.total}, Min: ${stats.min}, Max: ${stats.max}`);
console.log("Buckets:", stats.buckets);