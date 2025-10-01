// src/App.js
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Banner from './components/Banner';
import GridDemo from './components/GridDemo';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Banner />
      <GridDemo />
      <Footer />
    </>
  );
}
export default App;
