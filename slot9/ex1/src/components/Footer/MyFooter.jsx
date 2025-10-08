// import Button from "react-bootstrap/Button";
// import "./Footer.css";

// function MyFooter() {
//   return (
//     <footer className="text-center p-3 bg-dark text-light">
//       <p>Author: ThangTK</p>
//       <p>Created by: Thangtkde180020@fpt.edu.vn</p>
//       <p>&copy; {new Date().getFullYear()} ThangTK. All rights reserved</p>
//       <Button
//         variant="link"
//         href="https://github.com/KeyT9999/SE19B07_FER202_DE180020_TranKimThang"
//         className="text-light"
//       >
//         My Link Github's project: SE19B07_FER202_DE180020_TranKimThang
//       </Button>
//     </footer>
//   );
// }

// export default MyFooter;

import  Button from "react-bootstrap/Button";
import "./Footer.css";

function MyFooter({author, email, linkGithub}) {
  return (
    <footer>
      <p>Author: ThangTK  {author}</p>
      <p>Created by: Thangtkde180020@fpt.edu.vn {email} </p>
      <p>&copy; {new Date().getFullYear()} Thang. All rights reserved </p>
      <Button variant="link" href="https://github.com/KeyT9999/SE19B07_FER202_DE180020_TranKimThang" >My Link Github:  {linkGithub}</Button>
    </footer>
  )
}
export default MyFooter;