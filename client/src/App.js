import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import MainPage from './components/MainPage';
import Sidebar from './components/Sidebar';


function App() {
  return (
    <Router>
      <h1>Crowd Capital</h1>
      <div className="app">
        <Sidebar />
        <Routes>
          <Route exact path="/" element={<MainPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;