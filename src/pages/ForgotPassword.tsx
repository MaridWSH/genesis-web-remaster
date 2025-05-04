
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real app, this would call an API to send a password reset email
      // For now, we'll just simulate a success after a short delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitted(true);
      toast.success("Password reset instructions sent to your email");
    } catch (error) {
      toast.error("Failed to send password reset email");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center">
            <Link to="/login" className="mr-auto inline-flex items-center justify-center text-sm font-medium">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you instructions to reset your password.
          </CardDescription>
        </CardHeader>
        {!submitted ? (
          <>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      placeholder="Enter your email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || !email}
                >
                  {isSubmitting ? "Sending..." : "Send Reset Instructions"}
                </Button>
              </CardFooter>
            </form>
          </>
        ) : (
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-primary/10 p-4 text-center">
              <p className="text-sm text-primary">
                If an account exists for <strong>{email}</strong>, you will receive password reset instructions.
              </p>
            </div>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/login">Return to Login</Link>
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;
