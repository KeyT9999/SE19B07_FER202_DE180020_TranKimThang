// src/components/Logos.jsx
export default function Logos() {
  return (
    <div className="container text-center my-4">
      <div className="row">
        <div className="col">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg"
            alt="HTML5"
            width="150"
          />
        </div>
        <div className="col">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg"
            alt="CSS3"
            width="150"
          />
        </div>
        <div className="col">
          <img
            src="https://getbootstrap.com/docs/5.3/assets/brand/bootstrap-logo-shadow.png"
            alt="Bootstrap"
            width="150"
          />
        </div>
      </div>
    </div>
  );
}
