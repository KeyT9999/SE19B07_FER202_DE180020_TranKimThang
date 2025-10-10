import { useState } from 'react';
import { 
  Form, 
  FormGroup, 
  FormLabel, 
  FormControl, 
  FormSelect, 
  FormCheck, 
  Button, 
  InputGroup, 
  Row, 
  Col,
  Card,
  Container
} from 'react-bootstrap';
import './BookingTicket.css';

const cityOptions = [
  'Hà Nội',
  'Hồ Chí Minh',
  'Đà Nẵng',
  'Hải Phòng',
  'Nha Trang',
];

const defaultTicket = Object.freeze({
  fullName: '',
  address: '',
  from: cityOptions[0],
  to: cityOptions[1],
  includeDepart: true,
  includeReturn: false,
});

function BookingTicket() {
  const [ticket, setTicket] = useState(() => ({ ...defaultTicket }));

  const isRoundTrip = ticket.includeDepart && ticket.includeReturn;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTicket((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setTicket((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission
    console.log('Form submitted:', ticket);
  };

  return (
    <Container fluid className="booking-wrapper">
      <Card className="booking-card">
        <Card.Header>
          <h1 className="booking-title">Form đặt vé máy bay</h1>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <FormGroup className="mb-3">
              <FormLabel htmlFor="fullName">Họ tên</FormLabel>
              <InputGroup>
                <InputGroup.Text>👤</InputGroup.Text>
                <FormControl
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Họ tên"
                  minLength={5}
                  value={ticket.fullName}
                  onChange={handleInputChange}
                  required
                />
                <InputGroup.Text>vnd</InputGroup.Text>
              </InputGroup>
              <Form.Text className="text-muted">Phải nhập 5 ký tự, in hoa...</Form.Text>
            </FormGroup>

            <FormGroup className="mb-3">
              <FormLabel htmlFor="address">Địa chỉ</FormLabel>
              <FormControl
                id="address"
                name="address"
                type="text"
                placeholder="Nhập địa chỉ..."
                minLength={5}
                value={ticket.address}
                onChange={handleInputChange}
                required
              />
              <Form.Text className="text-muted">Phải nhập 5 ký tự, in hoa...</Form.Text>
            </FormGroup>

            <Row className="mb-3">
              <Col md={6}>
                <FormGroup>
                  <FormLabel htmlFor="from">Đi từ</FormLabel>
                  <FormSelect
                    id="from"
                    name="from"
                    value={ticket.from}
                    onChange={handleInputChange}
                  >
                    {cityOptions.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </FormSelect>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <FormLabel htmlFor="to">Đến</FormLabel>
                  <FormSelect
                    id="to"
                    name="to"
                    value={ticket.to}
                    onChange={handleInputChange}
                  >
                    {cityOptions.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </FormSelect>
                </FormGroup>
              </Col>
            </Row>

            <fieldset className="mb-3">
              <legend className="form-label mb-1">Chọn chiều đi (Khứ hồi)</legend>
              <FormCheck
                type="checkbox"
                id="includeDepart"
                name="includeDepart"
                label="Đi"
                checked={ticket.includeDepart}
                onChange={handleCheckboxChange}
                className="mb-2"
              />
              <FormCheck
                type="checkbox"
                id="includeReturn"
                name="includeReturn"
                label="Về"
                checked={ticket.includeReturn}
                onChange={handleCheckboxChange}
                className="mb-2"
              />
              {isRoundTrip ? (
                <Form.Text className="text-success">Bạn đang đặt vé khứ hồi.</Form.Text>
              ) : (
                <Form.Text className="text-muted">Chọn cả hai chiều để đặt vé khứ hồi.</Form.Text>
              )}
            </fieldset>

            <div className="booking-actions">
              <Button variant="primary" type="submit">
                Đặt vé
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default BookingTicket;
