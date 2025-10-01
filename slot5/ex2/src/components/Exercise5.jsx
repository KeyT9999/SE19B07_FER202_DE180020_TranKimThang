//Yêu cầu đề bài: Lọc và hiển thị danh sách người tuổi teen

export function Exercise5() {
  // Mảng people
  const people = [
    { name: "Ann", age: 19 },
    { name: "Bob", age: 12 },
    { name: "Jane", age: 15 },
    { name: "Tom", age: 22 },
    { name: "Sue", age: 13 }
  ];

  //in ra người có tuổi cao nhất
  const maxAge = Math.max(...people.map(p => p.age)); 

  //kiem tra xem mot nguoi co phai tuoi teen(13-19) khong
  const isTeen = person => person.age >= 13 && person.age <= 19;
  // Lọc những người tuổi teen (13-19) và map sang chuỗi "Tên (Tuổi)"


  const teens = people
    .filter(isTeen)
    .map(person => `${person.name} (${person.age})`);

    //Sắp xếp những người tuổi teen thro số tuổi giảm dần
    teens.sort((a, b) => {
      const ageA = parseInt(a.match(/\((\d+)\)/)[1], 10);
      const ageB = parseInt(b.match(/\((\d+)\)/)[1], 10);
      return ageB - ageA;
    });

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