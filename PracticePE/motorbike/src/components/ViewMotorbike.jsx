import React, { useState, useEffect } from "react";
import { Card, Spinner, Alert, Button, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import MotorbikeAPI from "../api/MotorbikeAPI";

function ViewMotorbike() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [motorbike, setMotorbike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchMotorbike = async () => {
      try {
        setLoading(true);
        setError(null);
        setImageError(false);
        console.log("Fetching motorbike with ID:", id);
        console.log("API URL:", `http://localhost:3001/motobikes/${id}`);
        
        const response = await MotorbikeAPI.get(`/motobikes/${id}`);
        console.log("Response status:", response.status);
        console.log("Fetched motorbike:", response.data);
        
        if (response.data) {
          setMotorbike(response.data);
        } else {
          setError("Motorbike data is empty");
        }
      } catch (err) {
        console.error("Error fetching motorbike:", err);
        console.error("Error response:", err.response);
        
        if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
          setError(`Không thể kết nối tới JSON Server. Vui lòng đảm bảo JSON Server đang chạy trên port 3001. 
          Chạy lệnh: json-server --watch db.json --port 3001`);
        } else if (err.response && err.response.status === 404) {
          setError(`404 - Motorbike với ID ${id} không tìm thấy trong database.`);
        } else if (err.response) {
          setError(`Lỗi từ server: ${err.response.status} - ${err.response.statusText}. 
          Dữ liệu: ${JSON.stringify(err.response.data)}`);
        } else {
          setError(`Lỗi: ${err.message}. Vui lòng kiểm tra JSON Server có đang chạy không.`);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMotorbike();
    } else {
      setError("No ID provided");
      setLoading(false);
    }
  }, [id]);

  // Fix image path for React public folder
  const getImageSrc = (imagePath) => {
    if (!imagePath) return null;
    // If path starts with 'img/', prepend '/' to access public folder
    if (imagePath.startsWith('img/')) {
      return `/${imagePath}`;
    }
    // If it's already a full URL, use it as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // Otherwise, assume it's in public folder
    return `/${imagePath}`;
  };

  const handleImageError = (e) => {
    console.error("Image failed to load:", e.target.src);
    setImageError(true);
    e.target.src = "https://via.placeholder.com/600x400?text=No+Image";
  };

  if (loading) {
    return (
      <div className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Đang tải thông tin xe máy...</p>
      </div>
    );
  }

  if (error && !motorbike) {
    return (
      <div className="mt-4">
        <Alert variant="danger">
          <Alert.Heading>Lỗi!</Alert.Heading>
          <p style={{ whiteSpace: "pre-line" }}>{error}</p>
          <hr />
          <p>
            <small>
              <strong>Để sửa lỗi này:</strong><br />
              1. Mở terminal mới<br />
              2. Chạy lệnh: <code>json-server --watch db.json --port 3001</code><br />
              3. Kiểm tra: <a href={`http://localhost:3001/motobikes/${id}`} target="_blank" rel="noopener noreferrer">http://localhost:3001/motobikes/{id}</a>
            </small>
          </p>
          <Button variant="primary" onClick={() => navigate("/motorbikes")}>
            Back to Motorbikes List
          </Button>
        </Alert>
      </div>
    );
  }

  if (!motorbike) {
    return (
      <div className="mt-4">
        <Alert variant="warning">
          <Alert.Heading>Warning</Alert.Heading>
          <p>No motorbike data available.</p>
          <Button variant="primary" onClick={() => navigate("/motorbikes")}>
            Back to Motorbikes List
          </Button>
        </Alert>
      </div>
    );
  }

  const imageSrc = getImageSrc(motorbike.image);

  return (
    <div className="mt-4">
      <Button variant="secondary" className="mb-3" onClick={() => navigate("/motorbikes")}>
        ← Back to List
      </Button>
      
      <Row>
        <Col md={6} className="mb-4">
          <Card>
            {imageSrc && !imageError ? (
              <Card.Img
                variant="top"
                src={imageSrc}
                alt={motorbike.name || "Motorbike"}
                style={{ height: "400px", objectFit: "cover" }}
                onError={handleImageError}
              />
            ) : (
              <div style={{ 
                width: "100%", 
                height: "400px", 
                backgroundColor: "#f0f0f0", 
                display: "flex", 
                flexDirection: "column",
                alignItems: "center", 
                justifyContent: "center",
                border: "1px solid #ddd",
                borderRadius: "4px"
              }}>
                <p className="mb-2">No Image Available</p>
                <small className="text-muted">Path: {motorbike.image || "Not provided"}</small>
              </div>
            )}
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title className="h2 mb-4">{motorbike.name || "Unknown Motorbike"}</Card.Title>
              <Card.Text className="fs-5">
                <div className="mb-3">
                  <strong>Brand:</strong> {motorbike.brand || "N/A"}
                </div>
                <div className="mb-3">
                  <strong>Model:</strong> {motorbike.model || "N/A"}
                </div>
                {motorbike.year && (
                  <div className="mb-3">
                    <strong>Year:</strong> {motorbike.year}
                  </div>
                )}
                <div className="mb-3">
                  <strong>Price:</strong> {motorbike.price || "N/A"}
                </div>
                <div className="mb-3">
                  <strong>Quantity in Stock:</strong> {motorbike.quantity !== undefined ? motorbike.quantity : "N/A"}
                </div>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default ViewMotorbike;
