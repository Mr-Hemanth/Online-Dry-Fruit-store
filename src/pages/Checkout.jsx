import React, { useState, useEffect } from 'react';
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
  Image,
  Link,
  Icon,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Checkbox,
  UnorderedList,
  ListItem,
  Select,
} from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { mongoOrderService as orderService } from '../services/mongoOrderService';
import { API_BASE_URL } from '../config/apiConfig';
import { Phone, Mail, MapPin, Copy, CheckCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const Checkout = () => {
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const toast = useToast();
  const selectedItems = location.state?.selectedItems || [];

  // Customer info state
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  // User addresses state
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');

  // Validation errors state
  const [errors, setErrors] = useState({});

  // UPI payment state
  const [utrNumber, setUtrNumber] = useState('');
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Filter cart items based on selected items
  const filteredCartItems = selectedItems.length > 0 
    ? cart.items.filter(item => selectedItems.includes(item.productId))
    : cart.items;

  // Calculate total for selected items
  const selectedItemsTotal = filteredCartItems.reduce(
    (total, item) => total + (item.product.price * item.quantity), 
    0
  );

  // Initialize customer info with user data if available
  useEffect(() => {
    if (user) {
      setCustomerInfo(prev => ({
        ...prev,
        name: user.displayName || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  // Fetch user addresses
  useEffect(() => {
    const fetchUserAddresses = async () => {
      if (!user) return;
      
      try {
        const response = await fetch(`${API_BASE_URL}/users/${user.uid}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const userData = await response.json();
        setUserAddresses(userData.addresses || []);
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    };

    fetchUserAddresses();
  }, [user]);

  // Check if cart is empty or no items selected
  useEffect(() => {
    if ((filteredCartItems.length === 0 || cart.items.length === 0) && !orderPlaced) {
      navigate('/cart');
    }
  }, [filteredCartItems, cart.items, navigate, orderPlaced]);

  // Validate customer info
  const validateCustomerInfo = () => {
    const newErrors = {};
    
    // Name validation
    if (!customerInfo.name || customerInfo.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customerInfo.email || !emailRegex.test(customerInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!customerInfo.phone || !phoneRegex.test(customerInfo.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    // Address validation
    if (!customerInfo.address || customerInfo.address.trim().length < 5) {
      newErrors.address = 'Please enter a valid address (at least 5 characters)';
    }
    
    // City validation
    if (!customerInfo.city || customerInfo.city.trim().length < 2) {
      newErrors.city = 'Please enter a valid city name';
    }
    
    // State validation
    if (!customerInfo.state || customerInfo.state.trim().length < 2) {
      newErrors.state = 'Please enter a valid state name';
    }
    
    // ZIP code validation (6 digits for India)
    const zipRegex = /^[0-9]{6}$/;
    if (!customerInfo.zipCode || !zipRegex.test(customerInfo.zipCode)) {
      newErrors.zipCode = 'Please enter a valid 6-digit ZIP code';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
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

  // Handle address selection
  const handleAddressSelect = (e) => {
    const addressId = e.target.value;
    setSelectedAddressId(addressId);
    
    if (addressId) {
      const selectedAddress = userAddresses.find(addr => addr._id === addressId);
      if (selectedAddress) {
        setCustomerInfo(prev => ({
          ...prev,
          name: selectedAddress.fullName,
          phone: selectedAddress.phone,
          address: selectedAddress.addressLine1 + (selectedAddress.addressLine2 ? ', ' + selectedAddress.addressLine2 : ''),
          city: selectedAddress.city,
          state: selectedAddress.state,
          zipCode: selectedAddress.zipCode,
        }));
      }
    }
  };

  // Handle UTR input change
  const handleUtrChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 12); // Only allow digits, max 12
    setUtrNumber(value);
    
    // Clear error when user starts typing
    if (errors.utrNumber) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.utrNumber;
        return newErrors;
      });
    }
  };

  // Validate UTR number
  const validateUtrNumber = () => {
    // UTR numbers are typically 12 digits
    if (!utrNumber || utrNumber.length !== 12 || !/^\d+$/.test(utrNumber)) {
      setErrors(prev => ({
        ...prev,
        utrNumber: 'Please enter a valid 12-digit UTR number'
      }));
      return false;
    }
    return true;
  };

  // Check if address already exists in user's address book
  const isAddressNew = () => {
    // If no saved addresses, it's definitely new
    if (!userAddresses || userAddresses.length === 0) {
      return true;
    }
    
    // Parse the address components from customerInfo
    const { name, address, city, state, zipCode, phone } = customerInfo;
    
    // Parse current address into line1 and line2
    let currentAddressLine1 = address;
    let currentAddressLine2 = '';
    
    // Simple parsing - if there's a comma, split it
    if (address.includes(',')) {
      const parts = address.split(',');
      currentAddressLine1 = parts[0].trim();
      currentAddressLine2 = parts.slice(1).join(',').trim();
    }
    
    // Normalize the current address data
    const normalizedCurrentAddress = {
      fullName: name?.trim().toLowerCase() || '',
      phone: phone?.trim() || '',
      addressLine1: currentAddressLine1?.trim().toLowerCase() || '',
      addressLine2: currentAddressLine2?.trim().toLowerCase() || '',
      city: city?.trim().toLowerCase() || '',
      state: state?.trim().toLowerCase() || '',
      zipCode: zipCode?.trim() || ''
    };
    
    // Check if any saved address matches all components
    return !userAddresses.some(savedAddress => {
      // Normalize saved address data
      const normalizedSavedAddress = {
        fullName: savedAddress.fullName?.trim().toLowerCase() || '',
        phone: savedAddress.phone?.trim() || '',
        addressLine1: savedAddress.addressLine1?.trim().toLowerCase() || '',
        addressLine2: (savedAddress.addressLine2 || '')?.trim().toLowerCase() || '',
        city: savedAddress.city?.trim().toLowerCase() || '',
        state: savedAddress.state?.trim().toLowerCase() || '',
        zipCode: savedAddress.zipCode?.trim() || ''
      };
      
      // Compare all fields
      return (
        normalizedSavedAddress.fullName === normalizedCurrentAddress.fullName &&
        normalizedSavedAddress.phone === normalizedCurrentAddress.phone &&
        normalizedSavedAddress.addressLine1 === normalizedCurrentAddress.addressLine1 &&
        normalizedSavedAddress.addressLine2 === normalizedCurrentAddress.addressLine2 &&
        normalizedSavedAddress.city === normalizedCurrentAddress.city &&
        normalizedSavedAddress.state === normalizedCurrentAddress.state &&
        normalizedSavedAddress.zipCode === normalizedCurrentAddress.zipCode
      );
    });
  };

  // Save address to user's address book if it's new
  const saveAddressIfNew = async () => {
    // Check if we should save the address (new address and within limit)
    if (isAddressNew()) {
      if (userAddresses.length >= 4) {
        // Inform user they've reached the limit
        toast({
          title: 'Address Limit Reached',
          description: 'You have reached the maximum of 4 saved addresses. Please manage your addresses in your account settings.',
          status: 'info',
          duration: 5000,
          isClosable: true,
        });
        return false; // Return false to indicate address was not saved
      }
      
      try {
        // Parse address lines (assume addressLine1 is everything before first comma, rest is addressLine2)
        let addressLine1 = customerInfo.address;
        let addressLine2 = '';
        
        // Simple parsing - if there's a comma, split it
        if (customerInfo.address.includes(',')) {
          const parts = customerInfo.address.split(',');
          addressLine1 = parts[0].trim();
          addressLine2 = parts.slice(1).join(',').trim();
        }
        
        const newAddress = {
          fullName: customerInfo.name,
          phone: customerInfo.phone,
          addressLine1,
          addressLine2,
          city: customerInfo.city,
          state: customerInfo.state,
          zipCode: customerInfo.zipCode,
          isDefault: userAddresses.length === 0 // Make it default if it's the first address
        };

        const response = await fetch(`${API_BASE_URL}/users/${user.uid}/addresses`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newAddress),
        });

        if (response.ok) {
          // Refresh the addresses list
          const updatedResponse = await fetch(`${API_BASE_URL}/users/${user.uid}`);
          if (updatedResponse.ok) {
            const userData = await updatedResponse.json();
            setUserAddresses(userData.addresses || []);
          }
          
          toast({
            title: 'Address Saved',
            description: 'This address has been added to your address book for future use.',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          
          return true; // Return true to indicate address was saved successfully
        } else {
          throw new Error('Failed to save address');
        }
      } catch (error) {
        console.error('Error saving address:', error);
        // Don't fail the order if address saving fails
        toast({
          title: 'Note',
          description: 'Order placed successfully. Address could not be saved to your address book.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return false; // Return false to indicate address was not saved
      }
    }
    
    return false; // Return false to indicate address was not new (so not saved)
  };

  // Copy UPI ID to clipboard
  const copyUpiId = () => {
    const upiId = import.meta.env.VITE_STORE_UPI_ID || 'sri.jewellery9999-1@okaxis'; // Fallback value
    navigator.clipboard.writeText(upiId);
    toast({
      title: 'UPI ID Copied',
      description: `Copied ${upiId} to clipboard`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  // Place order
  const handlePlaceOrder = async () => {
    if (!validateCustomerInfo()) {
      setError('Please fix the validation errors below');
      return;
    }

    if (!user) {
      setError('Please log in to place an order');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Check if this is a new address and save it to the user's address book
      const addressSaved = await saveAddressIfNew();
      if (addressSaved) {
        console.log('New address saved to user\'s address book');
      }
      
      // Transform filtered cart items to match Order model requirements
      const orderItems = filteredCartItems.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        productPrice: item.product.price,
        productWeight: item.product.weight,
        productImage: item.product.imageUrl,
        quantity: item.quantity
      }));

      // Create order data
      const orderData = {
        userId: user.uid,
        userEmail: user.email,
        items: orderItems,
        totalAmount: selectedItemsTotal,
        customerInfo,
        paymentMethod: 'UPI',
        paymentStatus: 'pending',
        orderStatus: 'processing',
        utrNumber: null,
      };

      // Debug: Log the order data being sent
      console.log('Order data being sent:', orderData);

      // Create order in database
      const order = await orderService.createOrder(orderData);
      
      setOrderId(order.id);
      setOrderPlaced(true);
      
      toast({
        title: 'Order Placed',
        description: 'Your order has been placed successfully. Please complete the payment.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Error placing order:', err);
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Verify payment
  const handleVerifyPayment = async () => {
    if (!validateUtrNumber()) {
      setError('Please enter a valid 12-digit UTR number');
      return;
    }

    if (!orderId) {
      setError('Order not found');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Update order with UTR number and payment status
      await orderService.updatePaymentStatus(orderId, 'completed', utrNumber);
      
      setPaymentVerified(true);
      clearCart(); // Clear cart after successful payment
      
      toast({
        title: 'Payment Verified',
        description: 'Your payment has been verified successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Error verifying payment:', err);
      setError('Failed to verify payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Navigate to orders page
  const handleViewOrders = () => {
    navigate('/orders');
  };

  // Get store UPI ID from environment variables or use fallback values
  const storeUpiId = import.meta.env.VITE_STORE_UPI_ID || 'sri.jewellery9999-1@okaxis'; // Fallback value

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
              <AlertTitle>Please log in to checkout!</AlertTitle>
              <AlertDescription display="block">
                You need to be logged in to place an order.
              </AlertDescription>
            </Box>
          </Alert>
          <Flex justify="center">
            <Button colorScheme="primary" onClick={() => navigate('/login')}>
              Go to Login
            </Button>
          </Flex>
        </Container>
      </Box>
    );
  }

  return (
    <Box py={8}>
      <Container maxW={'4xl'}>
        <Heading mb={6} textAlign="center">Checkout</Heading>
        
        {error && (
          <Alert status="error" mb={6}>
            <AlertIcon />
            <AlertTitle mr={2}>Error!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            <CloseButton position="absolute" right="8px" top="8px" onClick={() => setError('')} />
          </Alert>
        )}

        {orderPlaced && paymentVerified ? (
          // Payment successful screen
          <Box textAlign="center" py={10}>
            <Icon as={CheckCircle} color="green.500" boxSize={20} mb={4} />
            <Heading mb={4}>Order Confirmed!</Heading>
            <Text fontSize="lg" mb={6}>
              Thank you for your order. Your payment has been verified successfully.
            </Text>
            <Text mb={6}>
              Order ID: <strong>{orderId}</strong>
            </Text>
            <HStack spacing={4} justify="center">
              <Button colorScheme="primary" onClick={handleViewOrders}>
                View Orders
              </Button>
              <Button variant="outline" onClick={() => navigate('/products')}>
                Continue Shopping
              </Button>
            </HStack>
          </Box>
        ) : orderPlaced ? (
          // Payment verification screen
          <VStack spacing={6} align="stretch">
            <Alert status="info">
              <AlertIcon />
              <Box flex="1">
                <AlertTitle>Order Placed Successfully!</AlertTitle>
                <AlertDescription display="block">
                  Please complete the payment using UPI to confirm your order.
                </AlertDescription>
              </Box>
            </Alert>

            <Box borderWidth={1} borderRadius="lg" p={6}>
              <Heading size="md" mb={4}>Payment Instructions</Heading>
              <UnorderedList spacing={2} mb={4}>
                <ListItem>Scan the QR code or use the UPI ID to make payment</ListItem>
                <ListItem>Enter the exact amount: ₹{selectedItemsTotal.toFixed(2)}</ListItem>
                <ListItem>After payment, you'll receive a UTR number</ListItem>
                <ListItem>Enter the UTR number below to verify your payment</ListItem>
              </UnorderedList>
              
              <Flex direction={{ base: 'column', md: 'row' }} gap={6} align="center">
                <Box>
                  {/* Dynamic QR Code with UPI ID and amount */}
                  <QRCodeSVG
                    value={`upi://pay?pa=${storeUpiId}&pn=${encodeURIComponent(import.meta.env.VITE_STORE_MERCHANT_NAME || 'Herambha Dryfruits')}&am=${selectedItemsTotal}&cu=INR`}
                    size={200}
                    level={'H'}
                    includeMargin={true}
                  />
                </Box>
                
                <VStack align="stretch" spacing={4}>
                  <Box>
                    <Text fontWeight="bold" mb={2}>UPI ID:</Text>
                    <HStack>
                      <Text>{storeUpiId}</Text>
                      <Button 
                        size="sm" 
                        leftIcon={<Copy size={16} />} 
                        onClick={copyUpiId}
                      >
                        Copy
                      </Button>
                    </HStack>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold" mb={2}>Amount to Pay:</Text>
                    <Text fontSize="2xl" color="primary.500">₹{selectedItemsTotal.toFixed(2)}</Text>
                  </Box>
                </VStack>
              </Flex>

            </Box>

            <Box borderWidth={1} borderRadius="lg" p={6}>
              <Heading size="md" mb={4}>Verify Payment</Heading>
              <FormControl isRequired isInvalid={!!errors.utrNumber}>
                <FormLabel>UTR Number</FormLabel>
                <Input
                  placeholder="Enter 12-digit UTR number"
                  value={utrNumber}
                  onChange={handleUtrChange}
                  maxLength={12}
                />
                {errors.utrNumber && (
                  <Text color="red.500" fontSize="sm" mt={1}>{errors.utrNumber}</Text>
                )}
                <Text fontSize="sm" color="gray.500" mt={2}>
                  The UTR number can be found in your UPI app transaction details
                </Text>
              </FormControl>
              
              <Button
                colorScheme="primary"
                onClick={handleVerifyPayment}
                isLoading={loading}
                mt={4}
                size="lg"
                width="full"
              >
                Verify Payment
              </Button>
            </Box>
          </VStack>
        ) : (
          // Customer info form
          <VStack spacing={6} align="stretch">
            <Box borderWidth={1} borderRadius="lg" p={6}>
              <Heading size="md" mb={4}>Customer Information</Heading>
              
              {/* Address Selection */}
              {userAddresses.length > 0 && (
                <FormControl mb={4}>
                  <FormLabel>Select Saved Address</FormLabel>
                  <Select 
                    placeholder="Select an address" 
                    value={selectedAddressId}
                    onChange={handleAddressSelect}
                  >
                    {userAddresses.map((address) => (
                      <option key={address._id} value={address._id}>
                        {address.fullName} - {address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ''}, {address.city}
                      </option>
                    ))}
                  </Select>
                  <Text fontSize="sm" color="gray.500" mt={2}>
                    Select a saved address or enter a new one below
                  </Text>
                </FormControl>
              )}
              
              <VStack spacing={4} align="stretch">
                <HStack spacing={4}>
                  <FormControl isRequired isInvalid={!!errors.name}>
                    <FormLabel>Full Name</FormLabel>
                    <Input
                      name="name"
                      value={customerInfo.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <Text color="red.500" fontSize="sm" mt={1}>{errors.name}</Text>
                    )}
                  </FormControl>
                  
                  <FormControl isRequired isInvalid={!!errors.phone}>
                    <FormLabel>Phone Number</FormLabel>
                    <Input
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleInputChange}
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
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    type="email"
                  />
                  {errors.email && (
                    <Text color="red.500" fontSize="sm" mt={1}>{errors.email}</Text>
                  )}
                </FormControl>
                
                <FormControl isRequired isInvalid={!!errors.address}>
                  <FormLabel>Address</FormLabel>
                  <Input
                    name="address"
                    value={customerInfo.address}
                    onChange={handleInputChange}
                    placeholder="Enter your full address"
                  />
                  {errors.address && (
                    <Text color="red.500" fontSize="sm" mt={1}>{errors.address}</Text>
                  )}
                </FormControl>
                
                <HStack spacing={4}>
                  <FormControl isRequired isInvalid={!!errors.city}>
                    <FormLabel>City</FormLabel>
                    <Input
                      name="city"
                      value={customerInfo.city}
                      onChange={handleInputChange}
                      placeholder="Enter your city"
                    />
                    {errors.city && (
                      <Text color="red.500" fontSize="sm" mt={1}>{errors.city}</Text>
                    )}
                  </FormControl>
                  
                  <FormControl isRequired isInvalid={!!errors.state}>
                    <FormLabel>State</FormLabel>
                    <Input
                      name="state"
                      value={customerInfo.state}
                      onChange={handleInputChange}
                      placeholder="Enter your state"
                    />
                    {errors.state && (
                      <Text color="red.500" fontSize="sm" mt={1}>{errors.state}</Text>
                    )}
                  </FormControl>
                  
                  <FormControl isRequired isInvalid={!!errors.zipCode}>
                    <FormLabel>ZIP Code</FormLabel>
                    <Input
                      name="zipCode"
                      value={customerInfo.zipCode}
                      onChange={handleInputChange}
                      placeholder="Enter ZIP code"
                      maxLength={6}
                    />
                    {errors.zipCode && (
                      <Text color="red.500" fontSize="sm" mt={1}>{errors.zipCode}</Text>
                    )}
                  </FormControl>
                </HStack>
              </VStack>
            </Box>

            <Box borderWidth={1} borderRadius="lg" p={6}>
              <Heading size="md" mb={4}>Order Summary</Heading>
              <VStack spacing={4} align="stretch">
                {filteredCartItems.map((item) => (
                  <HStack key={item.productId} justify="space-between">
                    <Text>{item.product.name} × {item.quantity}</Text>
                    <Text>₹{(item.product.price * item.quantity).toFixed(2)}</Text>
                  </HStack>
                ))}
                <Divider />
                <HStack justify="space-between" fontWeight="bold">
                  <Text>Total:</Text>
                  <Text>₹{selectedItemsTotal.toFixed(2)}</Text>
                </HStack>
              </VStack>
            </Box>

            <Accordion allowToggle>
              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <Text fontWeight="bold">UPI Payment Instructions</Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <UnorderedList spacing={2}>
                    <ListItem>After placing your order, you'll see a QR code and UPI ID</ListItem>
                    <ListItem>Scan the QR code or use the UPI ID ({storeUpiId}) to make payment</ListItem>
                    <ListItem>Enter the exact amount shown in your order</ListItem>
                    <ListItem>Save the transaction for the UTR number</ListItem>
                    <ListItem>Enter the UTR number to verify your payment</ListItem>
                  </UnorderedList>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>

            <Checkbox isRequired mb={4}>
              I agree to the terms and conditions and confirm that my shipping information is correct.
            </Checkbox>

            <Button
              colorScheme="primary"
              onClick={handlePlaceOrder}
              isLoading={loading}
              size="lg"
              width="full"
            >
              Place Order
            </Button>
          </VStack>
        )}
      </Container>
    </Box>
  );
};

export default Checkout;