
import React, { useState, useEffect, useMemo } from 'react';
import { db } from './db';
import { User, Transaction, UserRole, UserStatus } from './types';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import UserManagement from './components/UserManagement';
import Profile from './components/Profile';
import Reports from './components/Reports';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = sessionStorage.getItem('active_session');
    return saved ? JSON.parse(saved) : null;
  });
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    setUsers(db.getUsers());
    setTransactions(db.getTransactions());
  }, []);

  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem('active_session', JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem('active_session');
    }
  }, [currentUser]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  const refreshData = () => {
    setUsers(db.getUsers());
    setTransactions(db.getTransactions());
  };

  const renderContent = () => {
    if (!currentUser) return null;

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard 
          user={currentUser} 
          transactions={transactions} 
          users={users} 
        />;
      case 'transactions':
        return <Transactions 
          user={currentUser} 
          transactions={transactions} 
          onUpdate={refreshData} 
        />;
      case 'reports':
        return <Reports 
          user={currentUser} 
          transactions={transactions} 
          users={users} 
        />;
      case 'users':
        return currentUser.role === UserRole.ADMIN ? (
          <UserManagement users={users} onUpdate={refreshData} />
        ) : null;
      case 'profile':
        return <Profile 
          user={currentUser} 
          onUpdate={(updatedUser) => {
            setCurrentUser(updatedUser);
            refreshData();
          }} 
        />;
      default:
        return <Dashboard user={currentUser} transactions={transactions} users={users} />;
    }
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} users={users} />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        role={currentUser.role} 
        onLogout={handleLogout}
        userName={currentUser.name}
      />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
