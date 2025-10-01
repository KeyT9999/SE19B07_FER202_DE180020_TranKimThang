// src/components/Header.jsx
export default function Header() {
  return (
    <div className="py-4" style={{ backgroundColor: "#E89A3A" }}>
      <div className="container">
        {/* Khung trắng chứa logo */}
        <div className="mx-auto bg-white rounded-2 p-3" style={{ maxWidth: 520 }}>
          <img
            src="https://tse3.mm.bing.net/th/id/OIP.H7B2zQa6tyItU1JR6pPcngHaEE?rs=1&pid=ImgDetMain&o=7&rm=3"
            alt="Logo"
            className="img-fluid d-block mx-auto"
            style={{ maxHeight: 80 }}
          />
          <h3 className="text-center mt-2 mb-0 fw-bold">FPT UNIVERSITY</h3>
        </div>

        {/* Menu text trắng nằm dưới, căn giữa */}
        <ul className="nav justify-content-center mt-2">
          <li className="nav-item"><a className="nav-link px-2 link-light" href="#">Home</a></li>
          <li className="nav-item"><a className="nav-link px-2 link-light" href="#">About</a></li>
          <li className="nav-item"><a className="nav-link px-2 link-light" href="#">Contact</a></li>
        </ul>
      </div>
    </div>
  );
}
