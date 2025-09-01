import React, { useState, useEffect, useCallback } from 'react';
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
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  Switch,
  FormHelperText,
} from '@chakra-ui/react';
import { useAuth } from '../hooks/useAuth';
import { Edit, Trash2, Plus, Check } from 'lucide-react';
import { API_BASE_URL } from '../config/apiConfig';

const Account = () => {
  const { user, loading: authLoading } = useAuth();
  const toast = useToast();
  const { isOpen: isAddressOpen, onOpen: onAddressOpen, onClose: onAddressClose } = useDisclosure();

  // User info state
  const [userInfo, setUserInfo] = useState({
    displayName: '',
    email: '',
    phone: '',
  });

  // Address state
  const [addresses, setAddresses] = useState([]);
  const [currentAddress, setCurrentAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    isDefault: false,
  });
  const [editingAddressId, setEditingAddressId] = useState(null);

  // Validation errors state
  const [errors, setErrors] = useState({});
  const [addressErrors, setAddressErrors] = useState({});

  // Loading states
  const [loading, setLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch user addresses
  const fetchUserAddresses = useCallback(async () => {
    if (!user) return;
    
    setAddressLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/${user.uid}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const userData = await response.json();
      setAddresses(userData.addresses || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch addresses',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setAddressLoading(false);
    }
  }, [user, toast]);

  // Initialize user info
  useEffect(() => {
    if (user) {
      setUserInfo({
        displayName: user.displayName || '',
        email: user.email || '',
        phone: user.phone || '',
      });
      
      fetchUserAddresses();
    }
  }, [user, fetchUserAddresses]);

  // Validate user info
  const validateUserInfo = () => {
    const newErrors = {};
    
    // Name validation
    if (!userInfo.displayName || userInfo.displayName.trim().length < 2) {
      newErrors.displayName = 'Name must be at least 2 characters long';
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userInfo.email || !emailRegex.test(userInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (userInfo.phone && !phoneRegex.test(userInfo.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate address
  const validateAddress = () => {
    const newErrors = {};
    
    // Full name validation
    if (!currentAddress.fullName || currentAddress.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters long';
    }
    
    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!currentAddress.phone || !phoneRegex.test(currentAddress.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    // Address line 1 validation
    if (!currentAddress.addressLine1 || currentAddress.addressLine1.trim().length < 5) {
      newErrors.addressLine1 = 'Please enter a valid address (at least 5 characters)';
    }
    
    // City validation
    if (!currentAddress.city || currentAddress.city.trim().length < 2) {
      newErrors.city = 'Please enter a valid city name';
    }
    
    // State validation
    if (!currentAddress.state || currentAddress.state.trim().length < 2) {
      newErrors.state = 'Please enter a valid state name';
    }
    
    // ZIP code validation (6 digits for India)
    const zipRegex = /^[0-9]{6}$/;
    if (!currentAddress.zipCode || !zipRegex.test(currentAddress.zipCode)) {
      newErrors.zipCode = 'Please enter a valid 6-digit ZIP code';
    }
    
    setAddressErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle user info input changes
  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
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

  // Handle address input changes
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setCurrentAddress(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (addressErrors[name]) {
      setAddressErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle switch change for default address
  const handleSwitchChange = (isChecked) => {
    setCurrentAddress(prev => ({
      ...prev,
      isDefault: isChecked
    }));
  };

  // Open address modal for adding new address
  const openAddAddressModal = () => {
    setCurrentAddress({
      fullName: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zipCode: '',
      isDefault: addresses.length === 0, // First address is default by default
    });
    setEditingAddressId(null);
    setAddressErrors({});
    onAddressOpen();
  };

  // Open address modal for editing existing address
  const openEditAddressModal = (address) => {
    setCurrentAddress({
      fullName: address.fullName,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      isDefault: address.isDefault || false,
    });
    setEditingAddressId(address._id);
    setAddressErrors({});
    onAddressOpen();
  };

  // Save address (add or update)
  const saveAddress = async () => {
    if (!validateAddress()) {
      return;
    }
    
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to save addresses',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // Check address limit when adding a new address
    if (!editingAddressId && addresses.length >= 4) {
      toast({
        title: 'Error',
        description: 'You can only save up to 4 addresses',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setSubmitting(true);
    try {
      let response;
      
      if (editingAddressId) {
        // Update existing address
        response = await fetch(`${API_BASE_URL}/users/${user.uid}/addresses/${editingAddressId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(currentAddress),
        });
      } else {
        // Add new address
        response = await fetch(`${API_BASE_URL}/users/${user.uid}/addresses`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(currentAddress),
        });
      }
      
      if (!response.ok) {
        throw new Error('Failed to save address');
      }
      
      await fetchUserAddresses();
      
      toast({
        title: 'Success',
        description: editingAddressId ? 'Address updated successfully' : 'Address added successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      onAddressClose();
    } catch (error) {
      console.error('Error saving address:', error);
      toast({
        title: 'Error',
        description: 'Failed to save address',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete address
  const deleteAddress = async (addressId) => {
    if (!user || !addressId) return;
    
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/users/${user.uid}/addresses/${addressId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete address');
      }
      
      await fetchUserAddresses();
      
      toast({
        title: 'Success',
        description: 'Address deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting address:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete address',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Set address as default
  const setDefaultAddress = async (addressId) => {
    if (!user || !addressId) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/users/${user.uid}/addresses/${addressId}/default`, {
        method: 'PUT',
      });
      
      if (!response.ok) {
        throw new Error('Failed to set default address');
      }
      
      await fetchUserAddresses();
      
      toast({
        title: 'Success',
        description: 'Default address updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error setting default address:', error);
      toast({
        title: 'Error',
        description: 'Failed to set default address',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Update user info
  const updateUserInfo = async () => {
    if (!validateUserInfo()) {
      return;
    }
    
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to update profile',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setLoading(true);
    try {
      // In a real app, you would update the user info in the database here
      // For now, we'll just show a success message
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating user info:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
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
              <AlertTitle>Please log in to view your account!</AlertTitle>
              <AlertDescription display="block">
                You need to be logged in to access your account settings.
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
        <Heading mb={6} textAlign="center">Account Settings</Heading>
        
        <VStack spacing={8} align="stretch">
          {/* Profile Information */}
          <Box borderWidth={1} borderRadius="lg" p={6}>
            <Heading size="md" mb={4}>Profile Information</Heading>
            <VStack spacing={4} align="stretch">
              <HStack spacing={4}>
                <FormControl isInvalid={!!errors.displayName}>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    name="displayName"
                    value={userInfo.displayName}
                    onChange={handleUserInfoChange}
                    placeholder="Enter your full name"
                  />
                  {errors.displayName && (
                    <Text color="red.500" fontSize="sm" mt={1}>{errors.displayName}</Text>
                  )}
                </FormControl>
                
                <FormControl isInvalid={!!errors.phone}>
                  <FormLabel>Phone Number</FormLabel>
                  <Input
                    name="phone"
                    value={userInfo.phone}
                    onChange={handleUserInfoChange}
                    placeholder="Enter your phone number"
                    type="tel"
                    maxLength={10}
                  />
                  {errors.phone && (
                    <Text color="red.500" fontSize="sm" mt={1}>{errors.phone}</Text>
                  )}
                </FormControl>
              </HStack>
              
              <FormControl isRequired isInvalid={!!errors.email}>
                <FormLabel>Email Address</FormLabel>
                <Input
                  name="email"
                  value={userInfo.email}
                  onChange={handleUserInfoChange}
                  placeholder="Enter your email address"
                  type="email"
                  isReadOnly
                />
                <FormHelperText>Email cannot be changed</FormHelperText>
                {errors.email && (
                  <Text color="red.500" fontSize="sm" mt={1}>{errors.email}</Text>
                )}
              </FormControl>
              
              <Button
                colorScheme="primary"
                onClick={updateUserInfo}
                isLoading={loading}
                width="fit-content"
              >
                Update Profile
              </Button>
            </VStack>
          </Box>
          
          <Divider />
          
          {/* Address Management */}
          <Box borderWidth={1} borderRadius="lg" p={6}>
            <HStack justify="space-between" mb={4}>
              <Heading size="md">Address Book</Heading>
              <VStack align="flex-end">
                <Button 
                  leftIcon={<Plus size={16} />} 
                  colorScheme="primary" 
                  size="sm"
                  onClick={openAddAddressModal}
                  isDisabled={addresses.length >= 4}
                >
                  Add Address
                </Button>
                {addresses.length >= 4 && (
                  <Text fontSize="xs" color="gray.500">
                    Maximum 4 addresses allowed
                  </Text>
                )}
              </VStack>
            </HStack>
            
            {addressLoading ? (
              <Flex justify="center" py={8}>
                <Spinner />
              </Flex>
            ) : addresses.length === 0 ? (
              <Text textAlign="center" py={4} color="gray.500">
                You haven't added any addresses yet.
              </Text>
            ) : (
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Address</Th>
                      <Th>Phone</Th>
                      <Th>Default</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {addresses.map((address) => (
                      <Tr key={address._id}>
                        <Td>
                          <Text fontWeight="bold">{address.fullName}</Text>
                          <Text fontSize="sm">{address.addressLine1}</Text>
                          {address.addressLine2 && <Text fontSize="sm">{address.addressLine2}</Text>}
                          <Text fontSize="sm">{address.city}, {address.state} - {address.zipCode}</Text>
                        </Td>
                        <Td>{address.phone}</Td>
                        <Td>
                          {address.isDefault ? (
                            <Badge colorScheme="green" display="flex" alignItems="center">
                              <Check size={12} />
                              <Text ml={1}>Default</Text>
                            </Badge>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => setDefaultAddress(address._id)}
                            >
                              Set Default
                            </Button>
                          )}
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <IconButton
                              size="sm"
                              icon={<Edit size={16} />}
                              onClick={() => openEditAddressModal(address)}
                              aria-label="Edit address"
                            />
                            <IconButton
                              size="sm"
                              icon={<Trash2 size={16} />}
                              colorScheme="red"
                              onClick={() => deleteAddress(address._id)}
                              aria-label="Delete address"
                            />
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </VStack>
        
        {/* Address Modal */}
        <Modal isOpen={isAddressOpen} onClose={onAddressClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {editingAddressId ? 'Edit Address' : 'Add New Address'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4} align="stretch">
                <HStack spacing={4}>
                  <FormControl isRequired isInvalid={!!addressErrors.fullName}>
                    <FormLabel>Full Name</FormLabel>
                    <Input
                      name="fullName"
                      value={currentAddress.fullName}
                      onChange={handleAddressChange}
                      placeholder="Enter full name"
                    />
                    {addressErrors.fullName && (
                      <Text color="red.500" fontSize="sm" mt={1}>{addressErrors.fullName}</Text>
                    )}
                  </FormControl>
                  
                  <FormControl isRequired isInvalid={!!addressErrors.phone}>
                    <FormLabel>Phone Number</FormLabel>
                    <Input
                      name="phone"
                      value={currentAddress.phone}
                      onChange={handleAddressChange}
                      placeholder="Enter phone number"
                      type="tel"
                      maxLength={10}
                    />
                    {addressErrors.phone && (
                      <Text color="red.500" fontSize="sm" mt={1}>{addressErrors.phone}</Text>
                    )}
                  </FormControl>
                </HStack>
                
                <FormControl isRequired isInvalid={!!addressErrors.addressLine1}>
                  <FormLabel>Address Line 1</FormLabel>
                  <Input
                    name="addressLine1"
                    value={currentAddress.addressLine1}
                    onChange={handleAddressChange}
                    placeholder="Street address, P.O. box, company name, c/o"
                  />
                  {addressErrors.addressLine1 && (
                    <Text color="red.500" fontSize="sm" mt={1}>{addressErrors.addressLine1}</Text>
                  )}
                </FormControl>
                
                <FormControl isInvalid={!!addressErrors.addressLine2}>
                  <FormLabel>Address Line 2 (Optional)</FormLabel>
                  <Input
                    name="addressLine2"
                    value={currentAddress.addressLine2}
                    onChange={handleAddressChange}
                    placeholder="Apartment, suite, unit, building, floor, etc."
                  />
                  {addressErrors.addressLine2 && (
                    <Text color="red.500" fontSize="sm" mt={1}>{addressErrors.addressLine2}</Text>
                  )}
                </FormControl>
                
                <HStack spacing={4}>
                  <FormControl isRequired isInvalid={!!addressErrors.city}>
                    <FormLabel>City</FormLabel>
                    <Input
                      name="city"
                      value={currentAddress.city}
                      onChange={handleAddressChange}
                      placeholder="Enter city"
                    />
                    {addressErrors.city && (
                      <Text color="red.500" fontSize="sm" mt={1}>{addressErrors.city}</Text>
                    )}
                  </FormControl>
                  
                  <FormControl isRequired isInvalid={!!addressErrors.state}>
                    <FormLabel>State</FormLabel>
                    <Input
                      name="state"
                      value={currentAddress.state}
                      onChange={handleAddressChange}
                      placeholder="Enter state"
                    />
                    {addressErrors.state && (
                      <Text color="red.500" fontSize="sm" mt={1}>{addressErrors.state}</Text>
                    )}
                  </FormControl>
                  
                  <FormControl isRequired isInvalid={!!addressErrors.zipCode}>
                    <FormLabel>ZIP Code</FormLabel>
                    <Input
                      name="zipCode"
                      value={currentAddress.zipCode}
                      onChange={handleAddressChange}
                      placeholder="Enter ZIP code"
                      maxLength={6}
                    />
                    {addressErrors.zipCode && (
                      <Text color="red.500" fontSize="sm" mt={1}>{addressErrors.zipCode}</Text>
                    )}
                  </FormControl>
                </HStack>
                
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">Set as default address</FormLabel>
                  <Switch 
                    isChecked={currentAddress.isDefault} 
                    onChange={(e) => handleSwitchChange(e.target.checked)} 
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onAddressClose}>
                Cancel
              </Button>
              <Button 
                colorScheme="primary" 
                onClick={saveAddress} 
                isLoading={submitting}
              >
                {editingAddressId ? 'Update Address' : 'Add Address'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
};

export default Account;