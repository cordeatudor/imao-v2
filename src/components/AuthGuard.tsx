import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { isAuthenticated } from '../lib/auth';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const authed = await isAuthenticated();
      
      if (!authed) {
        navigate('/admin/login');
        return;
      }

      setAuthorized(true);
    } catch (error) {
      console.error('Auth check error:', error);
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Icons.Loader2 className="animate-spin" size={24} />
          <span>Se verifică autentificarea...</span>
        </div>
      </div>
    );
  }

  return authorized ? <>{children}</> : null;
};