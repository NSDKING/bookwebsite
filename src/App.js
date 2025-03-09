import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import config from './amplifyconfiguration.json';
import Home from './screens/Home';
import Discovery from './screens/Discovery';
import Dashboard from './screens/Dashboard/page';
  
Amplify.configure(config);

function App() {
  return (
    <div className="App">
        <Router>
          <Routes>

            <Route path="/" element={<Home />} />
            <Route path="/discovery" element={<Discovery />} />
            <Route path="/dashboard" element={<Dashboard />} />
 
          </Routes>
        </Router>
    </div>
  );
}

export default App;
