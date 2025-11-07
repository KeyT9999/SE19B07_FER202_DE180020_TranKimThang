// Trang Cars: lấy danh sách xe từ JSON Server, lọc theo giá, hiển thị bằng Bootstrap
import React, { useEffect, useMemo, useState } from 'react';
import carAPI from '../api/CarAPI';
import { CarProvider, useCarDispatch, useCarState } from '../context/CarContext';

function CarListContent() {
  const { cars, price } = useCarState();
  const dispatch = useCarDispatch();
  const [searchInput, setSearchInput] = useState(price);
  const [loading, setLoading] = useState(false);

  // Tải danh sách xe một lần khi component mount
  useEffect(() => {
    async function fetchCars() {
      try {
        setLoading(true);
        const res = await carAPI.get('/Cars');
        dispatch({ type: 'SET_CARS', payload: res.data || [] });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCars();
  }, [dispatch]);

  // Bộ lọc đã memo hóa: price là giá tối đa
  const filteredCars = useMemo(() => {
    if (!price) return cars;
    const p = Number(price);
    if (Number.isNaN(p)) return cars;
    return cars.filter((c) => Number(c.price) <= p);
  }, [cars, price]);

  // Hỗ trợ vừa lọc khi gõ, vừa lọc khi bấm nút Search
  const handleSearchClick = () => {
    dispatch({ type: 'SET_PRICE', payload: searchInput });
  };

  return (
    <div className="row">
      <div className="col-12 col-lg-4 mb-3">
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title">Filter by Price</h5>
            <div className="input-group">
              <input
                type="number"
                className="form-control"
                placeholder="Enter max price"
                value={searchInput}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchInput(val);
                  dispatch({ type: 'SET_PRICE', payload: val });
                }}
              />
              <button className="btn btn-outline-primary" onClick={handleSearchClick}>Search</button>
            </div>
            <div className="form-text">List updates as you type or when you click Search.</div>
          </div>
        </div>
      </div>

      <div className="col-12 col-lg-8">
        {loading && (
          <div className="d-flex align-items-center mb-3">
            <div className="spinner-border text-primary me-2" role="status" aria-hidden="true"></div>
            <span>Loading cars...</span>
          </div>
        )}
        <div className="row g-3">
          {filteredCars.map((car) => (
            <div key={car.id} className="col-12 col-md-6">
              <div className="card h-100 shadow-sm">
                {car.image ? (
                  <img src={car.image} className="card-img-top" alt={`${car.make} ${car.model}`} style={{ objectFit: 'cover', height: 160 }} />
                ) : (
                  <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: 160 }}>
                    <span className="text-muted">No image</span>
                  </div>
                )}
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0">{car.make} {car.model}</h5>
                    <span className="badge bg-success">${Number(car.price).toLocaleString()}</span>
                  </div>
                  <span className="badge bg-secondary">{car.year}</span>
                </div>
              </div>
            </div>
          ))}
          {filteredCars.length === 0 && (
            <div className="col-12">
              <div className="alert alert-info">No cars found.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CarManagement() {
  return (
    <CarProvider>
      <h3 className="mb-3">Car Management</h3>
      <CarListContent />
    </CarProvider>
  );
}


