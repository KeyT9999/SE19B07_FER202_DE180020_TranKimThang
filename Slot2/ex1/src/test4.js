let person = {
    name: "John",
    age: 30,
    greet: function() {
        console.log(`Hello KeyT, my name is ${this.name} and I am ${this.age} years old.`);
    }
};

person.greet();