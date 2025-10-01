import React from 'react';

export default function MenuCards() {
  return (
    <section className="container py-4" id="menu">
      <h2 className="text-light mb-3">Our Menu</h2>
      <div className="menu__grid">
        <article className="card">
          <span className="badge badge--sale">SALE</span>
          <img src="/pizza/picture2.jpg" alt="Margherita Pizza" />

          <div className="card__body">
            <h3>Margherita Pizza</h3>
            <div className="price">
              <span className="price--old">$40.00</span>
              <span className="price--new">$21.00</span>
            </div>
            <button className="btn">Buy</button>
          </div>
        </article>

        <article className="card">
          <img src="/pizza/picture3.jpg" alt="Mushroom Pizza" />
          <div className="card__body">
            <h3>Mushroom Pizza</h3>
            <div className="price"><span>$25.00</span></div>
            <button className="btn">Buy</button>
          </div>
        </article>

        <article className="card">
          <span className="badge badge--new">NEW</span>
          <img src="/pizza/picture4.jpg" alt="Hawaiian Pizza" />
          <div className="card__body">
            <h3>Hawaiian Pizza</h3>
            <div className="price"><span>$30.00</span></div>
            <button className="btn">Buy</button>
          </div>
        </article>

        <article className="card">
          <span className="badge badge--sale">SALE</span>
          <img src="/pizza/picture5.jpg" alt="Pesto Pizza" />
          <div className="card__body">
            <h3>Pesto Pizza</h3>
            <div className="price">
              <span className="price--old">$49.00</span>
              <span className="price--new">$36.00</span>
            </div>
            <button className="btn">Buy</button>
          </div>
        </article>
      </div>
    </section>
  );
}
  