import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {
    login
  } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/tasks');
      toast.success('Logged in successfully');
    } catch (error) {
      toast.error('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="max-w-md w-full mx-auto bg-white p-8 rounded-md shadow-md">
      <h1 className="text-center text-2xl font-medium text-primary mb-4">TaskMaster</h1>
      <h2 className="text-center text-xl font-medium mb-6">Sign in to your account</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">Email</label>
          <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="bg-slate-50" />
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block mb-2">Password</label>
          <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>
      
      <div className="text-center mt-4">
        Don't have an account? <Link to="/register" className="text-primary">Create an account</Link>
      </div>
    </div>;
};
export default LoginForm;