
import { User, UserRole, UserStatus, Transaction } from './types';

const USERS_KEY = 'accutrack_users';
const TRANSACTIONS_KEY = 'accutrack_transactions';

const INITIAL_ADMIN: User = {
  id: 'admin-1',
  name: 'System Administrator',
  username: 'admin',
  password: 'password123',
  role: UserRole.ADMIN,
  status: UserStatus.ACTIVE,
  createdAt: new Date().toISOString()
};

export const db = {
  getUsers: (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    if (!data) {
      localStorage.setItem(USERS_KEY, JSON.stringify([INITIAL_ADMIN]));
      return [INITIAL_ADMIN];
    }
    return JSON.parse(data);
  },

  saveUsers: (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  getTransactions: (): Transaction[] => {
    const data = localStorage.getItem(TRANSACTIONS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveTransactions: (transactions: Transaction[]) => {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  }
};
