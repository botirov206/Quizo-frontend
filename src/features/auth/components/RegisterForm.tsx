import { useState, useCallback } from 'react';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useRegister } from '../hooks/useRegister';
import { useLogin } from '../hooks/useLogin';
import { MAX_INPUT_LENGTH, MAX_NAME_LENGTH } from '../constants';
import { createPasteHandler } from '../utils';

export const RegisterForm = () => {
  const navigate = useNavigate();
  const { loading, error, handleRegister, clearError } = useRegister();
  const { handleGoogleLogin } = useLogin();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [googleError, setGoogleError] = useState('');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await handleRegister({
      firstName,
      lastName,
      email,
      password,
      confirmPassword: password,
      role: 'student',
    });
    if (result.success) {
      navigate('/dashboard');
    }
  }, [firstName, lastName, email, password, handleRegister, navigate]);

  const handleInputPaste = createPasteHandler(MAX_INPUT_LENGTH);
  const handleNamePaste = createPasteHandler(MAX_NAME_LENGTH);

  // Google OAuth success handler
  const onGoogleSuccess = useCallback(async (credentialResponse: CredentialResponse) => {
    const googleToken = credentialResponse.credential;
    
    if (!googleToken) {
      console.error('No credential received from Google');
      setGoogleError('Failed to get Google credentials');
      return;
    }

    const result = await handleGoogleLogin(googleToken);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setGoogleError('Google sign up failed');
    }
  }, [handleGoogleLogin, navigate]);

  // Google OAuth error handler
  const onGoogleError = useCallback(() => {
    console.error('Google Sign up Failed');
    setGoogleError('Google sign up failed');
  }, []);

  // Clear error on input change
  const handleInputChange = useCallback(() => {
    if (error) clearError();
    if (googleError) setGoogleError('');
  }, [error, googleError, clearError]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>Welcome! Please fill in the details to get started.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Google OAuth Button */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={onGoogleSuccess}
              onError={onGoogleError}
              theme="outline"
              size="large"
              text="signup_with"
              width="320"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or</span>
            </div>
          </div>

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

            {(error || googleError) && (
              <p className="text-sm text-destructive">{error || googleError}</p>
            )}
            
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
