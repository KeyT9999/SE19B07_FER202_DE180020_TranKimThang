//Yêu cầu đề bài: Tính toán tổng, min, max và đếm số lượng người trong các nhóm tuổi
export function Exercise8() {
  // Mảng ages
  const ages = [33, 12, 20, 16, 5, 54, 21, 44, 61, 13, 15, 45, 25, 64, 32];

  // Dùng reduce để tính tổng, min, max và đếm số lượng teen/adult
  const stats = ages.reduce(
    (acc, age) => {
      acc.total += age;
      acc.min = Math.min(acc.min, age);
      acc.max = Math.max(acc.max, age);
      if (age >= 13 && age <= 19) acc.buckets.teen++;
      if (age >= 20) acc.buckets.adult++;
      return acc;
    },
    { total: 0, min: Infinity, max: -Infinity, buckets: { teen: 0, adult: 0 } }
  );

  return (
    <div>
      <h1>Exercise 8</h1>
      <p>Total: {stats.total}, Min: {stats.min}, Max: {stats.max}</p>
      <p>Buckets: teen: {stats.buckets.teen}, adult: {stats.buckets.adult}</p>
    </div>
  );
}
export default Exercise8;