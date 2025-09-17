const people = [
  { name: "Ann", age: 19 },
  { name: "Bob", age: 12 },
  { name: "Jane", age: 15 },
  { name: "Tom", age: 22 },
  { name: "Sue", age: 13 }
];

// Dùng reduce để lọc người tuổi teen (13-19) và chuyển sang chuỗi "Tên (Tuổi)"
// arr là mảng kết quả, person là từng phần tử trong people
const teens = people.reduce((arr, person) => {
  // Nếu tuổi nằm trong khoảng 13-19 thì thêm vào mảng kết quả
  if (person.age >= 13 && person.age <= 19) {
    arr.push(`${person.name} (${person.age})`);
  }
  return arr; // trả về mảng cho lần lặp tiếp theo
}, []); // giá trị khởi tạo là mảng rỗng

// In từng chuỗi ra màn hình
teens.forEach(str => console.log(str));

// Cách khác: dùng filter để lọc, map để chuyển sang chuỗi
const teens2 = people
  .filter(person => person.age >= 13 && person.age <= 19) // lọc tuổi teen
  .map(person => `${person.name} (${person.age})`);       // chuyển sang chuỗi

// In từng chuỗi ra màn hình (teens2)
teens2.forEach(str => console.log(str));

