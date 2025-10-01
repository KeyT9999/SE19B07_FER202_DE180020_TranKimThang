import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import HeaderBrand from './components/HeaderBrand';
import TopBar from './components/TopBar';
import Hero from './components/Hero';
import Crumbs from './components/Crumbs';
import StudentsGrid from './components/StudentsGrid';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <HeaderBrand />
      <TopBar />
      <Hero />
      <div className="container my-3">
        <Crumbs />
      </div>
      <StudentsGrid />
      <Footer />
    </>
  );
}
export default App;
