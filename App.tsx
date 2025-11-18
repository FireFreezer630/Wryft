import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import LandingPage from './components/LandingPage';
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
        <Router>
            <Switch>
                {/* Public Landing Page */}
                <Route exact path="/" component={LandingPage} />
                
                {/* Protected Dashboard Routes */}
                <Route path="/dashboard" component={DashboardLayout} />

                {/* Fallback */}
                <Route path="*">
                    <Redirect to="/" />
                </Route>
            </Switch>
        </Router>
    </AuthProvider>
  );
};

export default App;