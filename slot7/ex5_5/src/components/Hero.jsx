export default function Hero() {
  return (
    <div style={{ backgroundColor: '#E89A3A' }} className="py-3">
      <div className="container">
        <div className="bg-white rounded-1 p-3">
          <img
            className="img-fluid d-block mx-auto"
            src="https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format&fit=crop"
            alt="Students"
            style={{ maxHeight: 360, objectFit: 'cover', width: '100%' }}
          />
        </div>
      </div>
    </div>
  );
}
