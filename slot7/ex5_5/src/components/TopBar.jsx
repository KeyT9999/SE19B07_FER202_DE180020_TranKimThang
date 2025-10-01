export default function TopBar() {
  return (
    <div style={{ backgroundColor: '#E89A3A' }} className="py-3">
      <div className="container">
        <div className="bg-white rounded-1 p-2 px-3">
          <div className="d-flex align-items-center justify-content-between">
            {/* left: small links */}
            <div className="small text-secondary d-flex gap-3">
              <span>🏠 Home</span>
              <span>📞 99 999 999</span>
              <span>✉️ support@fpt.edu.vn</span>
            </div>
            {/* right: search */}
            <form className="d-flex" role="search" onSubmit={(e)=>e.preventDefault()}>
              <input className="form-control form-control-sm" type="search" placeholder="Search" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
