import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  useToast,
  Spinner,
  HStack,
  Divider,
  Icon,
  Flex,
  Link
} from '@chakra-ui/react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Chrome, User, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!password || password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    
    // Name validation (only for signup)
    if (!isLogin) {
      if (!displayName || displayName.trim().length < 2) {
        newErrors.displayName = 'Name must be at least 2 characters long';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        toast({
          title: 'Signed in successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/');
      } else {
        await signUp(email, password, displayName);
        toast({
          title: 'Account created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to authenticate',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast({
        title: 'Signed in with Google',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to sign in with Google',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes and clear errors
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.email;
        return newErrors;
      });
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.password;
        return newErrors;
      });
    }
  };

  const handleNameChange = (e) => {
    setDisplayName(e.target.value);
    if (errors.displayName) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.displayName;
        return newErrors;
      });
    }
  };

  return (
    <Box py={8}>
      <Container maxW={'md'}>
        <VStack spacing={8}>
          <Heading textAlign={'center'}>
            {isLogin ? 'Sign In' : 'Create Account'}
          </Heading>
          
          <Button
            onClick={handleGoogleSignIn}
            isLoading={loading}
            leftIcon={<Chrome />}
            w={'full'}
            variant={'outline'}
          >
            Continue with Google
          </Button>
          
          <HStack w={'full'}>
            <Divider />
            <Text fontSize={'sm'} color={'gray.500'} px={2}>
              or
            </Text>
            <Divider />
          </HStack>
          
          <Box w={'full'} p={6} borderWidth={1} borderRadius={'lg'}>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                {!isLogin && (
                  <FormControl isRequired isInvalid={!!errors.displayName}>
                    <FormLabel>Full Name</FormLabel>
                    <Input
                      type={'text'}
                      value={displayName}
                      onChange={handleNameChange}
                      placeholder={'Enter your full name'}
                    />
                    {errors.displayName && (
                      <FormErrorMessage>{errors.displayName}</FormErrorMessage>
                    )}
                  </FormControl>
                )}
                
                <FormControl isRequired isInvalid={!!errors.email}>
                  <FormLabel>Email Address</FormLabel>
                  <Input
                    type={'email'}
                    value={email}
                    onChange={handleEmailChange}
                    placeholder={'Enter your email'}
                  />
                  {errors.email && (
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  )}
                </FormControl>
                
                <FormControl isRequired isInvalid={!!errors.password}>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type={'password'}
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder={'Enter your password'}
                  />
                  {errors.password && (
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  )}
                </FormControl>
                
                <Button
                  type={'submit'}
                  isLoading={loading}
                  colorScheme={'primary'}
                  w={'full'}
                >
                  {isLogin ? 'Sign In' : 'Create Account'}
                </Button>
              </VStack>
            </form>
          </Box>
          
          <Text>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Link
              color={'primary.500'}
              onClick={() => {
                setIsLogin(!isLogin);
                // Clear errors when switching between login/signup
                setErrors({});
              }}
              fontWeight={'semibold'}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </Link>
          </Text>
          
          <Text fontSize={'sm'} color={'gray.500'} textAlign={'center'}>
            By continuing, you agree to our{' '}
            <Link as={RouterLink} to={'/policies'} color={'primary.500'}>
              Terms and Conditions
            </Link>
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default Login;