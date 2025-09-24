export function Exercise6() {
  // Mảng companies
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

  // Tạo bản sao, sort theo end tăng dần (không mutate mảng gốc)
  const sortedCompanies = [...companies].sort((a, b) => a.end - b.end);

  // Lấy 3 công ty đầu
  const top3 = sortedCompanies.slice(0, 3);

  return (
    <div>
      <h1>Exercise 6</h1>
      <ul>
        {top3.map((company, idx) => (
          <li key={idx}>{company.name} - {company.end}</li>
        ))}
      </ul>
    </div>
  );
}
export default Exercise6;