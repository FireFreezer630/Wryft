import React from 'react';
import { Switch, Route, Redirect, RouteComponentProps } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import Dashboard from './Dashboard';
import Settings from './Settings';

// Placeholder for empty dashboard pages
const PlaceholderPage = ({ title }: { title: string }) => (
    <div className="p-8 text-gray-500 flex items-center justify-center h-full">
        <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
            <p>This feature is under construction.</p>
        </div>
    </div>
);

interface DashboardLayoutProps extends RouteComponentProps {}

const DashboardLayout = ({ match }: DashboardLayoutProps) => {
  const { user } = useAuth();

  // In a real app, redirect if not authenticated
  // if (!user) return <Redirect to="/" />;

  const path = match.path;

  return (
    <div className="flex min-h-screen bg-[#050505] font-sans text-white overflow-hidden">
      <Sidebar />
      <main className="flex-1 relative ml-72 overflow-y-auto h-screen custom-scrollbar">
        <Switch>
             <Route exact path={path}>
                <Redirect to={`${path}/overview`} />
             </Route>
             <Route path={`${path}/overview`} component={Dashboard} />
             <Route path={`${path}/settings`} component={Settings} />
             
             {/* Placeholders for other menu items */}
             <Route path={`${path}/ai`} render={() => <PlaceholderPage title="AI Assistant" />} />
             <Route path={`${path}/customize`} render={() => <PlaceholderPage title="Customization" />} />
             <Route path={`${path}/layout`} render={() => <PlaceholderPage title="Layout Editor" />} />
             <Route path={`${path}/decoration`} render={() => <PlaceholderPage title="Decorations" />} />
             <Route path={`${path}/premium`} render={() => <PlaceholderPage title="Premium Features" />} />
             <Route path={`${path}/socials`} render={() => <PlaceholderPage title="Social Links" />} />
             <Route path={`${path}/content`} render={() => <PlaceholderPage title="Content Manager" />} />
             <Route path={`${path}/apps`} render={() => <PlaceholderPage title="Applications" />} />
             <Route path={`${path}/uploads`} render={() => <PlaceholderPage title="Image Host" />} />
        </Switch>
      </main>
    </div>
  );
};

export default DashboardLayout;