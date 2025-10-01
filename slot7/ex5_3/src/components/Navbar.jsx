// src/components/Navbar.jsx
export default function Navbar() {
  return (
    <div className="container mb-4">
      <ul className="nav">
        <li className="nav-item">
          <a className="nav-link active" href="#">Active</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Link</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Link</a>
        </li>
        <li className="nav-item">
          <a className="nav-link disabled" href="#" aria-disabled="true">Disabled</a>
        </li>
      </ul>
    </div>
  );
}
