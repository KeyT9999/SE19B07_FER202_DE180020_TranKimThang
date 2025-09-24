export function Exercise5() {
  // Mảng people
  const people = [
    { name: "Ann", age: 19 },
    { name: "Bob", age: 12 },
    { name: "Jane", age: 15 },
    { name: "Tom", age: 22 },
    { name: "Sue", age: 13 }
  ];

  // Lọc những người tuổi teen (13-19) và map sang chuỗi "Tên (Tuổi)"
  const teens = people
    .filter(person => person.age >= 13 && person.age <= 19)
    .map(person => `${person.name} (${person.age})`);

  return (
    <div>
      <h1>Exercise 5</h1>
      {teens.map((str, idx) => (
        <p key={idx}>{str}</p>
      ))}
    </div>
  );
}
export default Exercise5;