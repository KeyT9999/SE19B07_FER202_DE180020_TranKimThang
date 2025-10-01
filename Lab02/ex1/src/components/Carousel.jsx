import React from 'react';

export default function Carousel() {
  return (
    <header
      className="hero position-relative text-white d-flex align-items-center"
      style={{
        backgroundImage: "url('/pizza/picture1.jpg')", // ảnh nền từ public
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '400px'
      }}
    >
      <div className="hero__overlay position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>

      <div className="hero__content position-relative container text-center">
        <h1 className="fw-bold">Neapolitan Pizza</h1>
        <p>If you are looking for traditional Italian pizza, the Neapolitan is the best option!</p>
      </div>
    </header>
  );
}
