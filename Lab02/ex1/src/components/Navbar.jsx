import React from 'react';

export default function Navbar() {
  return (
    <>
      {/* Logo phía trên navbar */}
      <div className="bg-light text-center py-2">
        <img src="/pizza/FPT.webp" alt="FPT Logo" style={{ height: '50px' }} />
      </div>

      {/* Navbar chính */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand fw-bold" href="#home">Pizza House</a>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#mainNavbar" 
            aria-controls="mainNavbar" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="mainNavbar">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item"><a className="nav-link active" href="#home">Home</a></li>
              <li className="nav-item"><a className="nav-link" href="#about">About Us</a></li>
              <li className="nav-item"><a className="nav-link" href="#contact">Contact</a></li>
            </ul>

            <form className="d-flex" role="search" onSubmit={(e) => e.preventDefault()}>
              <input 
                className="form-control me-2" 
                type="search" 
                placeholder="Search" 
                aria-label="Search" 
              />
              <button className="btn btn-danger" type="submit">Search</button>
            </form>
          </div>
        </div>
      </nav>
    </>
  );
}
