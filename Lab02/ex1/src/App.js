import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';

import Navbar from './components/Navbar';
import Carousel from './components/Carousel';
import MenuCards from './components/MenuCards';
import BookingForm from './components/BookingForm';


function App() {
  return (
    <>
      <Navbar />
      <Carousel />
      <MenuCards />
      <BookingForm />
      
    </>
  );
}

export default App;
