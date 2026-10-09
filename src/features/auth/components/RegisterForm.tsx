/**
 * Register Form
 * New-account form with optional teacher role and Google sign-in
 */

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useRegister } from '../hooks/useRegister';
import { MAX_INPUT_LENGTH, MAX_NAME_LENGTH } from '../constants';
import { createPasteHandler } from '../utils';
import { SocialAuthButtons } from './SocialAuthButtons';

export const RegisterForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, handleRegister, clearError } = useRegister();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Determine role from URL path - if path includes '/teacher', set role to 'teacher'
  const isTeacherRegistration = location.pathname.includes('/teacher');
  const defaultRole: 'student' | 'teacher' = isTeacherRegistration ? 'teacher' : 'student';

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await handleRegister({
      firstName,
      lastName,
      email,
      password,
      confirmPassword: password,
      role: defaultRole,
    });
    if (result.success) {
      navigate('/dashboard');
    }
  }, [firstName, lastName, email, password, handleRegister, navigate, defaultRole]);

  const handleInputPaste = createPasteHandler(MAX_INPUT_LENGTH);
  const handleNamePaste = createPasteHandler(MAX_NAME_LENGTH);

  const handleInputChange = useCallback(() => {
    if (error) clearError();
  }, [error, clearError]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">
            {isTeacherRegistration ? 'Register as Teacher' : 'Create your account'}
          </CardTitle>
          <CardDescription>
            {isTeacherRegistration 
              ? 'Join as an educator and start creating engaging quizzes for your students.'
              : 'Welcome! Please fill in the details to get started.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SocialAuthButtons role={defaultRole} googleText="signup_with" />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  First name 
                </Label>
                <Input 
                  id="firstName" 
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    handleInputChange();
                  }}
                  onPaste={handleNamePaste}
                  maxLength={MAX_NAME_LENGTH}
                  autoComplete="given-name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Last name 
                </Label>
                <Input 
                  id="lastName" 
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    handleInputChange();
                  }}
                  onPaste={handleNamePaste}
                  maxLength={MAX_NAME_LENGTH}
                  autoComplete="family-name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="m@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  handleInputChange();
                }}
                onPaste={handleInputPaste}
                maxLength={MAX_INPUT_LENGTH}
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    handleInputChange();
                  }}
                  onPaste={handleInputPaste}
                  maxLength={MAX_INPUT_LENGTH}
                  required
                  autoComplete="new-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={0}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline" tabIndex={0}>
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
