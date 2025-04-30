import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginRegister from './pages/LoginRegister';
import Categories from './pages/Categories';
import UserDashboard from './pages/UserDashboard';
import EbookDetail from './pages/EbookDetail';
import Ebooks from './pages/Ebooks';
import CategoryEbooks from './pages/CategoryEbooks';
import SubscriptionOverview from './pages/SubscriptionOverview';
import PrePayment from './pages/PrePayment';
import SubscriptionSuccess from './pages/SubscriptionSuccess';

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login-register" element={<LoginRegister />} />
        <Route path="/Categories" element={<Categories />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/ebook-detail" element={<EbookDetail />} />
        <Route path="/ebooks" element={<Ebooks />} />
        <Route path="/category-ebooks" element={<CategoryEbooks />} />
        <Route path="/subscribe" element={<SubscriptionOverview />} />
        <Route path="/pre-payment" element={<PrePayment />} />
        <Route path="/subscription-success" element={<SubscriptionSuccess />} />
      </Routes>
    </Router>
  );
}

export default App;
