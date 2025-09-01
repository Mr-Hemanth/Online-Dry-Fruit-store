import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
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
  Divider,
  Flex,
  Switch,
  Select,
  FormHelperText,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import { useAuth } from '../hooks/useAuth';
import { Edit, Lock, Bell, CreditCard, Shield, LogOut } from 'lucide-react';

const Settings = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailOrders: true,
    emailPromotions: false,
    smsOrders: true,
    smsPromotions: false,
  });

  // Security settings
  const [security, setSecurity] = useState({
    twoFactorAuth: false,
  });

  // Change password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  // Loading states
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [savingSecurity, setSavingSecurity] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Handle notification changes
  const handleNotificationChange = (name, value) => {
    setNotifications(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle security changes
  const handleSecurityChange = (name, value) => {
    setSecurity(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle password input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validate password change form
  const validatePasswordChange = () => {
    const newErrors = {};
    
    // Current password validation
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    // New password validation
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters long';
    }
    
    // Confirm password validation
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save notification settings
  const saveNotificationSettings = async () => {
    setSavingNotifications(true);
    try {
      // In a real app, you would save these settings to the database
      // For now, we'll just show a success message
      toast({
        title: 'Success',
        description: 'Notification settings saved successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error saving notification settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save notification settings',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSavingNotifications(false);
    }
  };

  // Save security settings
  const saveSecuritySettings = async () => {
    setSavingSecurity(true);
    try {
      // In a real app, you would save these settings to the database
      // For now, we'll just show a success message
      toast({
        title: 'Success',
        description: 'Security settings saved successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error saving security settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save security settings',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSavingSecurity(false);
    }
  };

  // Change password
  const changePassword = async () => {
    if (!validatePasswordChange()) {
      return;
    }
    
    setChangingPassword(true);
    try {
      // In a real app, you would call an API to change the password
      // For now, we'll just show a success message
      toast({
        title: 'Success',
        description: 'Password changed successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Reset form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        title: 'Error',
        description: 'Failed to change password',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setChangingPassword(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: 'Error',
        description: 'Failed to log out',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (authLoading) {
    return (
      <Box py={8}>
        <Container maxW={'4xl'}>
          <Flex justify="center" align="center" minH="50vh">
            <Spinner size="xl" />
          </Flex>
        </Container>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box py={8}>
        <Container maxW={'4xl'}>
          <Alert status="warning" mb={6}>
            <AlertIcon />
            <Box flex="1">
              <AlertTitle>Please log in to access settings!</AlertTitle>
              <AlertDescription display="block">
                You need to be logged in to view and modify your settings.
              </AlertDescription>
            </Box>
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box py={8}>
      <Container maxW={'4xl'}>
        <Heading mb={6} textAlign="center">Settings</Heading>
        
        <VStack spacing={8} align="stretch">
          {/* Account Information */}
          <Box borderWidth={1} borderRadius="lg" p={6}>
            <HStack spacing={4} mb={4}>
              <IconButton
                icon={<Edit size={20} />}
                aria-label="Edit profile"
                colorScheme="primary"
                onClick={() => window.location.href = '/account'}
              />
              <VStack align="start" spacing={0} flex={1}>
                <Heading size="md">{user.displayName || 'User'}</Heading>
                <Text color="gray.600">{user.email}</Text>
              </VStack>
            </HStack>
            
            <Button 
              leftIcon={<LogOut size={16} />} 
              colorScheme="red" 
              variant="outline"
              onClick={handleLogout}
            >
              Log Out
            </Button>
          </Box>
          
          <Divider />
          
          {/* Notification Settings */}
          <Box borderWidth={1} borderRadius="lg" p={6}>
            <HStack spacing={3} mb={4}>
              <Bell size={24} />
              <Heading size="md">Notifications</Heading>
            </HStack>
            
            <VStack spacing={4} align="stretch">
              <FormControl display="flex" alignItems="center" justifyContent="space-between">
                <FormLabel mb="0">
                  <Text fontWeight="bold">Order updates</Text>
                  <Text fontSize="sm" color="gray.600">Get notified about your orders</Text>
                </FormLabel>
                <Switch 
                  isChecked={notifications.emailOrders} 
                  onChange={(e) => handleNotificationChange('emailOrders', e.target.checked)} 
                />
              </FormControl>
              
              <FormControl display="flex" alignItems="center" justifyContent="space-between">
                <FormLabel mb="0">
                  <Text fontWeight="bold">Promotional emails</Text>
                  <Text fontSize="sm" color="gray.600">Receive promotional offers and updates</Text>
                </FormLabel>
                <Switch 
                  isChecked={notifications.emailPromotions} 
                  onChange={(e) => handleNotificationChange('emailPromotions', e.target.checked)} 
                />
              </FormControl>
              
              <FormControl display="flex" alignItems="center" justifyContent="space-between">
                <FormLabel mb="0">
                  <Text fontWeight="bold">SMS order updates</Text>
                  <Text fontSize="sm" color="gray.600">Receive order updates via SMS</Text>
                </FormLabel>
                <Switch 
                  isChecked={notifications.smsOrders} 
                  onChange={(e) => handleNotificationChange('smsOrders', e.target.checked)} 
                />
              </FormControl>
              
              <FormControl display="flex" alignItems="center" justifyContent="space-between">
                <FormLabel mb="0">
                  <Text fontWeight="bold">SMS promotions</Text>
                  <Text fontSize="sm" color="gray.600">Receive promotional offers via SMS</Text>
                </FormLabel>
                <Switch 
                  isChecked={notifications.smsPromotions} 
                  onChange={(e) => handleNotificationChange('smsPromotions', e.target.checked)} 
                />
              </FormControl>
              
              <Button
                colorScheme="primary"
                onClick={saveNotificationSettings}
                isLoading={savingNotifications}
                width="fit-content"
              >
                Save Notification Settings
              </Button>
            </VStack>
          </Box>
          
          <Divider />
          
          {/* Security Settings */}
          <Box borderWidth={1} borderRadius="lg" p={6}>
            <HStack spacing={3} mb={4}>
              <Lock size={24} />
              <Heading size="md">Security</Heading>
            </HStack>
            
            <VStack spacing={4} align="stretch">
              <FormControl display="flex" alignItems="center" justifyContent="space-between">
                <FormLabel mb="0">
                  <Text fontWeight="bold">Two-factor authentication</Text>
                  <Text fontSize="sm" color="gray.600">Add an extra layer of security</Text>
                </FormLabel>
                <Switch 
                  isChecked={security.twoFactorAuth} 
                  onChange={(e) => handleSecurityChange('twoFactorAuth', e.target.checked)} 
                />
              </FormControl>
              
              <Button
                colorScheme="primary"
                onClick={saveSecuritySettings}
                isLoading={savingSecurity}
                width="fit-content"
              >
                Save Security Settings
              </Button>
            </VStack>
          </Box>
          
          <Divider />
          
          {/* Change Password */}
          <Box borderWidth={1} borderRadius="lg" p={6}>
            <HStack spacing={3} mb={4}>
              <Shield size={24} />
              <Heading size="md">Change Password</Heading>
            </HStack>
            
            <VStack spacing={4} align="stretch">
              <FormControl isRequired isInvalid={!!errors.currentPassword}>
                <FormLabel>Current Password</FormLabel>
                <Input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                />
                {errors.currentPassword && (
                  <Text color="red.500" fontSize="sm" mt={1}>{errors.currentPassword}</Text>
                )}
              </FormControl>
              
              <FormControl isRequired isInvalid={!!errors.newPassword}>
                <FormLabel>New Password</FormLabel>
                <Input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                />
                {errors.newPassword && (
                  <Text color="red.500" fontSize="sm" mt={1}>{errors.newPassword}</Text>
                )}
              </FormControl>
              
              <FormControl isRequired isInvalid={!!errors.confirmPassword}>
                <FormLabel>Confirm New Password</FormLabel>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                />
                {errors.confirmPassword && (
                  <Text color="red.500" fontSize="sm" mt={1}>{errors.confirmPassword}</Text>
                )}
              </FormControl>
              
              <Button
                colorScheme="primary"
                onClick={changePassword}
                isLoading={changingPassword}
                width="fit-content"
              >
                Change Password
              </Button>
            </VStack>
          </Box>
          
          <Divider />
          
          {/* Privacy and Data */}
          <Box borderWidth={1} borderRadius="lg" p={6}>
            <Heading size="md" mb={4}>Privacy and Data</Heading>
            
            <Accordion allowToggle>
              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <Text fontWeight="bold">Download Your Data</Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <Text mb={4}>Download a copy of your personal data stored by Herambha Dryfruits.</Text>
                  <Button colorScheme="primary" variant="outline">
                    Request Data Download
                  </Button>
                </AccordionPanel>
              </AccordionItem>
              
              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <Text fontWeight="bold">Delete Account</Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <Text mb={4}>Permanently delete your account and all associated data.</Text>
                  <Button colorScheme="red" variant="outline" onClick={onOpen}>
                    Delete Account
                  </Button>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Box>
        </VStack>
        
        {/* Delete Account Confirmation Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Delete Account</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>
                Are you sure you want to delete your account? This action cannot be undone. 
                All your data, including orders, addresses, and preferences, will be permanently deleted.
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red">
                Delete Account
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
};

export default Settings;