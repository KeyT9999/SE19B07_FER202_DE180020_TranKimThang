import React from "react";

const students = [
  {
    id: 'DE170842',
    name: 'Nguyễn Hồng Phúc',
    clazz: 'GCH2202',
    status: 'Present',
    img: 'https://fap.fpt.edu.vn/temp/ImageRollNumber/DN/78e68f66-2a7d-4329-a114-a4ba6dd2e081.jpg'
  },
  {
    id: 'DE170857',
    name: 'Ông Vinh Tuấn',
    clazz: 'GCH2201',
    status: 'Present',
    img: 'https://fap.fpt.edu.vn/temp/ImageRollNumber/DN/78e68f66-2a7d-4329-a114-a4ba6dd2e081.jpg'
  },
  {
    id: 'DE190501',
    name: 'Đỗ Ngọc Phúc',
    clazz: 'GCH2205',
    status: 'Present',
    img: 'https://fap.fpt.edu.vn/temp/ImageRollNumber/DN/78e68f66-2a7d-4329-a114-a4ba6dd2e081.jpg'
  },
  {
    id: 'DE170640',
    name: 'Lê Hồng Minh',
    clazz: 'GCH2204',
    status: 'Present',
    img: 'https://fap.fpt.edu.vn/temp/ImageRollNumber/DN/78e68f66-2a7d-4329-a114-a4ba6dd2e081.jpg'
  }
];

export default function StudentsGrid() {
  return (
    <div className="container my-5">
      <h4 className="text-center fw-bold text-primary mb-4">
        👩‍🎓 Students Detail
      </h4>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {students.map((s) => (
          <div className="col" key={s.id}>
            <div className="card h-100 text-center shadow-sm border-0 rounded-4 p-3 hover-card">
              {/* Avatar rõ nét */}
              <img
                src={s.img}
                alt={s.name}
                className="rounded-circle mx-auto d-block border border-2 border-primary"
                style={{ width: 120, height: 120, objectFit: "cover" }}
              />

              {/* Thông tin sinh viên */}
              <div className="card-body">
                <h6 className="fw-bold text-dark">{s.name}</h6>
                <p className="mb-1 small text-muted">
                  🎓 ID: <span className="fw-semibold">{s.id}</span>
                </p>
                <p className="mb-1 small text-muted">
                  🏫 Class: <span className="fw-semibold">{s.clazz}</span>
                </p>
                <span
                  className={`badge ${
                    s.status === "Present" ? "bg-success" : "bg-secondary"
                  } px-3 py-2`}
                >
                  {s.status}
                </span>
              </div>

              {/* Nút chọn */}
              <div className="mb-3">
                <button className="btn btn-sm btn-outline-primary px-4">
                  Select
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .hover-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hover-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 10px 22px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
}
