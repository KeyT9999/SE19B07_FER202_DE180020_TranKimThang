import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


import Banner from './components/Banner';
import Navbar from './components/Navbar';
import GridDemo from './components/GridDemo';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Banner />
      <Navbar />
      <GridDemo />
      <Footer />
    </>
  );
}

export default App;
