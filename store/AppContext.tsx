import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Lesson } from '../types';
import { API_URL } from '../constants';

interface AppContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  lessons: Lesson[];
  addLesson: (lessonData: { title: string; content: string }) => Promise<void>;
  deleteLesson: (lessonId: string) => Promise<void>;
  completeLesson: (lessonId: string, xpEarned: number, masteryScore: number) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize theme
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Load User Data on Mount if Token exists
  useEffect(() => {
    const loadData = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      try {
        // 1. Get Profile
        const res = await fetch(`${API_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
          const userData = await res.json();
          // Map backend _id to frontend id
          setUser({ ...userData, id: userData._id });
          
          // 2. Get Lessons
          const lessonsRes = await fetch(`${API_URL}/lessons`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (lessonsRes.ok) {
            const lessonsData = await lessonsRes.json();
             // Map _id to id
            setLessons(lessonsData.map((l: any) => ({ ...l, id: l._id })));
          }
        } else {
          // Token invalid
          logout();
        }
      } catch (err) {
        console.error("Failed to load user data", err);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [token]);

  const login = async (email: string, password = 'password') => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) throw new Error('Login failed');

      const data = await res.json();
      localStorage.setItem('token', data.token);
      setToken(data.token);
      // User data will be fetched by the useEffect
    } catch (error) {
      console.error(error);
      alert('Login Failed. Ensure Backend is running.');
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setLessons([]);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const addLesson = async ({ title, content }: { title: string; content: string }) => {
    if (!token) return;
    
    try {
      const res = await fetch(`${API_URL}/lessons`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, content })
      });

      if (res.ok) {
        const newLesson = await res.json();
        setLessons(prev => [{ ...newLesson, id: newLesson._id }, ...prev]);
      } else {
        throw new Error('Failed to generate lesson');
      }
    } catch (error) {
      console.error("Lesson generation failed", error);
      throw error;
    }
  };

  const deleteLesson = async (lessonId: string) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/lessons/${lessonId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setLessons(prev => prev.filter(l => l.id !== lessonId));
      }
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const completeLesson = async (lessonId: string, xpEarned: number, masteryScore: number) => {
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/lessons/${lessonId}/complete`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ xpEarned, masteryScore })
      });

      if (res.ok) {
        const data = await res.json();
        
        // Update Local State with new XP and Weighted XP logic
        setUser(prev => prev ? { 
          ...prev, 
          xp: data.xp, 
          weightedXp: data.weightedXp, 
          level: data.level, 
          streak: data.streak 
        } : null);
        
        setLessons(prev => prev.map(l => l.id === lessonId ? { ...l, isCompleted: true } : l));
      }
    } catch (error) {
      console.error("Completion failed", error);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/users/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(prev => prev ? { ...prev, ...updatedUser } : null);
      }
    } catch (error) {
      console.error("Update profile failed", error);
    }
  };

  return (
    <AppContext.Provider value={{ 
      user, token, login, logout, 
      theme, toggleTheme,
      lessons, addLesson, deleteLesson, completeLesson, updateProfile,
      isLoading
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};