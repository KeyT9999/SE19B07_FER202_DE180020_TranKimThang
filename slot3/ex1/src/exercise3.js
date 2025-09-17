const companies = [
  { name: "Company One", category: "Finance", start: 1981, end: 2004 },
  { name: "Company Two", category: "Retail", start: 1992, end: 2008 },
  { name: "Company Three", category: "Auto", start: 1999, end: 2007 },
  { name: "Company Four", category: "Retail", start: 1989, end: 2010 },
  { name: "Company Five", category: "Technology", start: 2009, end: 2014 },
  { name: "Company Six", category: "Finance", start: 1987, end: 2010 },
  { name: "Company Seven", category: "Auto", start: 1986, end: 1996 },
  { name: "Company Eight", category: "Technology", start: 2011, end: 2016 },
  { name: "Company Nine", category: "Retail", start: 1981, end: 1989 }
];

const ages = [33, 12, 20, 16, 5, 54, 21, 44, 61, 13, 15, 45, 25, 64, 32];

const person = {
  name: "Costas",
  address: {
    street: "Lalaland 12"
  }
};

// Dùng destructuring để lấy thuộc tính lồng nhau từ object person
// - street: lấy từ person.address.street
// - city: lấy từ person.address.city, nếu không có thì mặc định là "Unknown City"
const {
  address: {
    street,
    city = "Unknown City"
  }
} = person;

// In ra giá trị street và city
console.log("street:", street); // Kết quả: Lalaland 12
console.log("city:", city);     // Kết quả: Unknown City (vì không có city trong address)