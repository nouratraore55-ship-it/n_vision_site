import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Services from './pages/Services';
import Realisations from './pages/Realisations';
import FAQ from './pages/FAQ';
import Questionnaire from './pages/Questionnaire';
import Admin from './pages/Admin';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/realisations" element={<Realisations />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/devis" element={<Questionnaire />} />
        </Route>
        {/* Pas de navbar/footer public sur l'admin */}
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
