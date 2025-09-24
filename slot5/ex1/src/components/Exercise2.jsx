export function  Exercise2() {
    //1 Tạo mảng số nguyên, in ra danh sách thẻ list
    const numbers = [1, 2, 3, 4, 5];
    //2 Tính Tổng
    const sum = numbers.reduce((acc, curr) => acc + curr, 0);
    //3  Tính giá trị trung bình
    const avg = sum / numbers.length;

    //4 Khai mảng chuỗi names, in ra danh sách các tên theo thứ tự tên tăng dần Alphabet
    const names = ["An", "Bình", "Cường", "Dũng", "Hà"];
    names.sort(); // Sắp xếp mảng names theo thứ tự tăng dần

       // 5. Khai báo 1 mảng people chứa 10 đối tượng students
    const students = [
        { id: 1, name: "An", age: 20, grade: 8.5},
        { id: 2, name: "Bình", age: 21, grade: 9.0},
        { id: 3, name: "Cường", age: 22, grade: 7.5},
        { id: 4, name: "Dũng", age: 23, grade: 8.0},
        { id: 5, name: "Hà", age: 24, grade: 9.5},
        { id: 6, name: "Hải", age: 25, grade: 8.2},
        { id: 7, name: "Nam", age: 26, grade: 7.8},
        { id: 8, name: "Phúc", age: 27, grade: 8.7},
        { id: 9, name: "Quân", age: 28, grade: 9.1},
        { id: 10, name: "Tài", age: 29, grade: 8.4}
    ];
    // In ra danh sách student có grade >= 7.5 và sắp xếp theo grade giảm dần
    const filteredAndSortedStudents = students
        .filter(student => student.grade >= 7.5)
        .sort((a, b) => b.grade - a.grade);
    return (
        <div>
            <h1>Exercise 2</h1>
            <ul>
                {numbers.map((number, index) => (
                    <li key={index}>Phần tử thứ: {number}</li>
                ))}
            </ul>
            <p>Tổng các phần tử của mảng: {sum}</p>
            <p>Giá trị trung bình: {avg.toFixed(2)}</p>
            <p>Danh sách sau khi sắp xếp Tên: {names.join(", ")}</p>
            <p>Danh sách sinh viên đạt yêu cầu trên 7.5 Grade: {filteredAndSortedStudents.map(student => student.name).join(", ")}</p>
            <ul>
                <p>Hiển thị danh sách top Students theo dạng bảng</p>
                <table border = "1">
                    <thead>
                        <tr>
                            <th>ID</th>     
                            <th>Name</th>
                            <th>Age</th>
                            <th>Grade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAndSortedStudents.map(student => (
                            <tr key={student.id}>
                                <td>{student.id}</td>
                                <td>{student.name}</td>
                                <td>{student.age}</td>
                                <td>{student.grade}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <p>Trung bình điểm của những bạn có điểm trên 7.5: {(filteredAndSortedStudents.reduce((acc, student) => acc + student.grade, 0) / filteredAndSortedStudents.length).toFixed(2)}</p>     
            </ul>

            
        </div>
    );
}
