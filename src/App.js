import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import config from './amplifyconfiguration.json';
import Home from './screens/Home';
import Discovery from './screens/Discovery';
import Dashboard from './screens/Dashboard/page';
import LoginPage from './screens/Login/page';
import ProtectedRoute from './components/ProctectdRoute';
import { Authenticator } from '@aws-amplify/ui-react';
import { useEffect, useState } from 'react';
import { createUser } from './graphql/mutations';
import { listUsers } from './graphql/queries';
import { getCurrentUser } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import ArticlePage from './screens/ArticlePage/page';
import ContactPage from './screens/Contact';

Amplify.configure(config);

function App() {
  const [userID, setUserID] = useState(null);
  const [loading, setLoading] = useState(true);
  const client = generateClient();

  const isUserAuth = async () => {
    try {
      const { userId } = await getCurrentUser();
      if (userId) {
        setUserID(userId);

        const listUsersResponse = await client.graphql({
          query: listUsers,
        });

        const existingUser = listUsersResponse.data.listUsers.items.find(user => user.logid === userId);
        if (!existingUser) {
          await client.graphql({
            query: createUser,
            variables: {
              input: { logid: userId },
            },
          });
        }
      }
    } catch (error) {
      console.error("Error fetching or creating user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    isUserAuth();
  }, []);
  
  return (
    <div className="App">
      <Authenticator.Provider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/discovery" element={<Discovery />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/article/:id" element={<ArticlePage />} /> {/* New dynamic article route */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </Authenticator.Provider>
    </div>
  );
}

export default App;