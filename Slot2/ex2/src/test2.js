const arr = [1,2,3,4,5,6,7,8,9,10];

console.log("In ra tat ca cac phan tu trong mang: ");
arr.forEach(function(value){
    console.log(value);
});

console.log("Cac so chan la: ");
arr.forEach(function(value){
    if(value % 2 === 0){
        console.log(value);
    }       
});

const people = [
    {id: 1, name: "KeyT", age:18},
    {id: 2, name: "Alice", age:29},
    {id: 3, name: "Bob", age:17}
]

console.log("Danh sach: ");
people.forEach(function(person){
    console.log(`ID: ${person.id}, Name: ${person.name}, Age: ${person.age}`);

});

console.log("Danh sach nguoi tren 25 tuoi: ");
people.forEach(function(person){
    if(person.age > 25){
        console.log(`ID: ${person.id}, Name: ${person.name}, Age: ${person.age}`);
    }
});

console.log("Tinh tong tuoi: ");
let totalAge = 0;
people.forEach(function(person){
    totalAge += person.age;
});
console.log(`Tong tuoi: ${totalAge}`);