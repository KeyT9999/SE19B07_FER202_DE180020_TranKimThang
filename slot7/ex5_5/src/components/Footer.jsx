export default function Footer() {
  return (
    <div style={{ backgroundColor: '#E89A3A' }} className="py-3 mt-4">
      <div className="container">
        <div className="row text-white small">
          <div className="col-md-6">
            <div className="fw-semibold">Our Address</div>
            <div>FPT University, Hòa Lạc</div>
            <div>☎ 0999 999 999</div>
            <div>✉ support@fpt.edu.vn</div>
          </div>
          <div className="col-md-6 d-flex flex-column align-items-md-end align-items-start mt-3 mt-md-0">
            <div className="mb-2">© Copyright 2023</div>
            <div className="d-flex gap-3">
              <a className="text-white text-decoration-none" href="/">G+</a>
              <a className="text-white text-decoration-none" href="/">f</a>
              <a className="text-white text-decoration-none" href="/">in</a>
              <a className="text-white text-decoration-none" href="/">🐦</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
