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
  Badge,
  Radio,
  RadioGroup,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { mongoOrderService as orderService } from '../services/mongoOrderService';
import { API_BASE_URL } from '../config/apiConfig';
import { Phone, Mail, MapPin, Copy, CheckCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { generateUPILink } from '../utils/constants';

// Add script for Cashfree
const loadCashfreeScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/ui/1.0.26/cashfree.sandbox.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

// Add script for Razorpay
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

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

  // Payment state
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // State for payment processing
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  
  // Payment method selection
  const [paymentMethod, setPaymentMethod] = useState('cashfree'); // 'cashfree', 'phonepe', 'googlepay', 'paytm'

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
      // Check if user exists and has a uid
      if (!user || !user.uid) {
        console.log('User not authenticated or missing uid');
        setUserAddresses([]);
        return;
      }
      
      try {
        const response = await fetch(`${API_BASE_URL}/users/${user.uid}`);
        if (!response.ok) {
          if (response.status === 404) {
            // User not found - this might happen for new users
            console.log('User not found in database, will create when saving address');
            setUserAddresses([]);
            return;
          }
          throw new Error('Failed to fetch user data');
        }
        
        const userData = await response.json();
        setUserAddresses(userData.addresses || []);
      } catch (error) {
        console.error('Error fetching addresses:', error);
        // Set empty addresses array to avoid breaking the UI
        setUserAddresses([]);
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
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
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

  // Check if address already exists in user's address book
  const isAddressNew = () => {
    // If no user or no saved addresses, it's definitely new
    if (!user || !user.uid || !userAddresses || userAddresses.length === 0) {
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

  // Save new address to user's address book
  const saveAddressIfNew = async () => {
    // Only save if user is authenticated and address is new
    if (!user || !user.uid) {
      console.log('User not authenticated, skipping address save');
      return false;
    }
    
    if (isAddressNew()) {
      console.log("Saving new address to user's address book");
      
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

  // Place order
  const handlePlaceOrder = async () => {
    if (!validateCustomerInfo()) {
      setError('Please fix the validation errors below');
      return;
    }

    // Check if user is authenticated
    if (!user || !user.uid) {
      setError('Please log in to place an order');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Check if this is a new address and save it to the user's address book
      const addressSaved = await saveAddressIfNew();
      if (addressSaved) {
        console.log("New address saved to user's address book");
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
        customerInfo: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
          address: customerInfo.address,
          city: customerInfo.city,
          state: customerInfo.state,
          zipCode: customerInfo.zipCode
        },
        paymentMethod: paymentMethod === 'cashfree' ? 'Cashfree' : 
                      paymentMethod === 'phonepe' ? 'PhonePe' :
                      paymentMethod === 'googlepay' ? 'Google Pay' :
                      paymentMethod === 'paytm' ? 'Paytm' : 'Unknown',
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
        description: 'Your order has been placed successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Error placing order:', err);
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Process UPI payment
  const processUPIPayment = () => {
    if (!orderId) {
      setError('Order not found');
      return;
    }

    setPaymentProcessing(true);
    setError('');

    try {
      // Get the appropriate UPI ID based on selected payment method
      let upiId;
      switch (paymentMethod) {
        case 'phonepe':
          upiId = import.meta.env.VITE_PHONEPE_UPI_ID || import.meta.env.VITE_STORE_UPI_ID;
          break;
        case 'googlepay':
          upiId = import.meta.env.VITE_GOOGLEPAY_UPI_ID || import.meta.env.VITE_STORE_UPI_ID;
          break;
        case 'paytm':
          upiId = import.meta.env.VITE_PAYTM_UPI_ID || import.meta.env.VITE_STORE_UPI_ID;
          break;
        default:
          upiId = import.meta.env.VITE_STORE_UPI_ID;
      }

      // Generate UPI payment link
      const upiLink = generateUPILink(
        upiId,
        import.meta.env.VITE_STORE_MERCHANT_NAME || 'Herambha Dryfruits',
        selectedItemsTotal,
        orderId
      );

      // Open the UPI app
      window.open(upiLink, '_blank');

      // Show instructions to user
      toast({
        title: 'Payment Initiated',
        description: `Please complete the payment in the ${paymentMethod === 'phonepe' ? 'PhonePe' : paymentMethod === 'googlepay' ? 'Google Pay' : 'Paytm'} app. You will be redirected automatically after payment.`,
        status: 'info',
        duration: null, // Keep it open until user acts
        isClosable: true,
      });

      // Start polling for payment verification
      startPaymentVerificationPolling();
    } catch (err) {
      console.error('Error processing UPI payment:', err);
      setError('Failed to initiate UPI payment. Please try again.');
      toast({
        title: 'Payment Failed',
        description: err.message || 'There was an issue initiating your payment. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setPaymentProcessing(false);
    }
  };

  // Poll for payment verification
  const startPaymentVerificationPolling = () => {
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes (5 seconds interval)
    const pollInterval = 5000; // 5 seconds

    const poll = async () => {
      if (attempts >= maxAttempts) {
        // Stop polling after max attempts
        toast.closeAll();
        toast({
          title: 'Payment Verification Timeout',
          description: "We couldn't automatically verify your payment. Please enter the UTR number manually.",
          status: 'warning',
          duration: null,
          isClosable: true,
        });
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
        if (response.ok) {
          const order = await response.json();
          if (order.paymentStatus === 'completed') {
            // Payment successful
            setPaymentVerified(true);
            clearCart();
            
            toast.closeAll();
            toast({
              title: 'Payment Successful',
              description: 'Your payment has been verified successfully!',
              status: 'success',
              duration: 5000,
              isClosable: true,
            });
            
            // Redirect to home page after 3 seconds
            setTimeout(() => {
              navigate('/');
            }, 3000);
            return;
          }
        }
      } catch (err) {
        console.error('Error checking payment status:', err);
      }

      attempts++;
      setTimeout(poll, pollInterval);
    };

    // Start polling
    poll();
  };

  // Process payment with Cashfree
  const processCashfreePayment = async () => {
    if (!orderId) {
      setError('Order not found');
      return;
    }

    setPaymentProcessing(true);
    setError('');

    try {
      // Load Cashfree script
      const isScriptLoaded = await loadCashfreeScript();
      if (!isScriptLoaded) {
        throw new Error('Failed to load Cashfree payment gateway');
      }

      // Create order on backend
      const orderResponse = await fetch(`${API_BASE_URL}/create-cashfree-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: selectedItemsTotal,
          orderId: orderId,
          customerInfo: customerInfo
        }),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create payment order');
      }

      const cashfreeOrder = await orderResponse.json();

      // Configure Cashfree options
      const paymentOptions = {
        orderID: cashfreeOrder.order_id,
        environment: import.meta.env.VITE_CASHFREE_ENVIRONMENT || 'SANDBOX',
      };

      // Open Cashfree payment modal
      const cashfree = new window.Cashfree(paymentOptions);
      cashfree.redirect();
      
      // For demonstration purposes, we'll simulate payment verification
      // In a real implementation, this would be handled by webhooks
      setTimeout(async () => {
        try {
          const verifyResponse = await fetch(`${API_BASE_URL}/verify-cashfree-payment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              orderId: orderId
            }),
          });

          if (verifyResponse.ok) {
            const result = await verifyResponse.json();
            if (result.success) {
              // Payment successful
              setPaymentVerified(true);
              clearCart();
              
              toast({
                title: 'Payment Successful',
                description: 'Your payment has been verified successfully!',
                status: 'success',
                duration: 5000,
                isClosable: true,
              });
              
              // Redirect to home page after 3 seconds
              setTimeout(() => {
                navigate('/');
              }, 3000);
            } else {
              throw new Error('Payment verification failed');
            }
          } else {
            throw new Error('Failed to verify payment');
          }
        } catch (err) {
          console.error('Error verifying payment:', err);
          toast({
            title: 'Payment Verification Failed',
            description: 'There was an issue verifying your payment. Please contact support.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      }, 3000);
    } catch (err) {
      console.error('Error processing payment:', err);
      setError('Failed to process payment. Please try again.');
      toast({
        title: 'Payment Failed',
        description: err.message || 'There was an issue processing your payment. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setPaymentProcessing(false);
    }
  };

  // Handle payment submission based on selected method
  const handlePaymentSubmit = () => {
    if (paymentMethod === 'cashfree') {
      processCashfreePayment();
    } else {
      processUPIPayment();
    }
  };

  // Navigate to orders page
  const handleViewOrders = () => {
    navigate('/orders');
  };

  // Navigate to home page
  const handleGoHome = () => {
    navigate('/');
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
            <Text mb={6} color="green.500" fontWeight="bold">
              You will be redirected to the home page shortly...
            </Text>
            <HStack spacing={4} justify="center">
              <Button colorScheme="primary" onClick={handleGoHome}>
                Go to Home Now
              </Button>
              <Button variant="outline" onClick={handleViewOrders}>
                View Orders
              </Button>
            </HStack>
          </Box>
        ) : orderPlaced ? (
          // Payment processing screen
          <VStack spacing={6} align="stretch">
            <Alert status="info">
              <AlertIcon />
              <Box flex="1">
                <AlertTitle>Order Placed Successfully!</AlertTitle>
                <AlertDescription display="block">
                  Please complete the payment using your selected payment method.
                </AlertDescription>
              </Box>
            </Alert>

            <Box borderWidth={1} borderRadius="lg" p={{ base: 4, md: 6 }}>
              <Heading size="md" mb={4}>Payment Summary</Heading>
              
              <VStack align="stretch" spacing={4}>
                <Box>
                  <Text fontWeight="bold" mb={2}>Order ID:</Text>
                  <Text>{orderId}</Text>
                </Box>
                
                <Box>
                  <Text fontWeight="bold" mb={2}>Amount to Pay:</Text>
                  <Text fontSize={{ base: 'xl', md: '2xl' }} color="primary.500">
                    ₹{selectedItemsTotal.toFixed(2)}
                  </Text>
                </Box>
                
                <Box>
                  <Text fontWeight="bold" mb={2}>Customer Information:</Text>
                  <Text>{customerInfo.name}</Text>
                  <Text>{customerInfo.email}</Text>
                  <Text>{customerInfo.phone}</Text>
                </Box>
                
                <Box>
                  <Text fontWeight="bold" mb={2}>Selected Payment Method:</Text>
                  <Badge colorScheme={
                    paymentMethod === 'phonepe' ? 'purple' :
                    paymentMethod === 'googlepay' ? 'blue' :
                    paymentMethod === 'paytm' ? 'orange' : 'green'
                  }>
                    {paymentMethod === 'phonepe' ? 'PhonePe' :
                     paymentMethod === 'googlepay' ? 'Google Pay' :
                     paymentMethod === 'paytm' ? 'Paytm' : 'Cashfree'}
                  </Badge>
                </Box>
              </VStack>
              
              <Button
                colorScheme={
                  paymentMethod === 'phonepe' ? 'purple' :
                  paymentMethod === 'googlepay' ? 'blue' :
                  paymentMethod === 'paytm' ? 'orange' : 'green'
                }
                size="lg"
                onClick={handlePaymentSubmit}
                isLoading={paymentProcessing}
                loadingText="Processing Payment"
                width="full"
                mt={6}
              >
                Pay with {paymentMethod === 'phonepe' ? 'PhonePe' :
                          paymentMethod === 'googlepay' ? 'Google Pay' :
                          paymentMethod === 'paytm' ? 'Paytm' : 'Cashfree'} ₹{selectedItemsTotal.toFixed(2)}
              </Button>
              
              <Text fontSize="sm" color="gray.500" mt={4} textAlign="center">
                {paymentMethod !== 'cashfree' 
                  ? 'You will be redirected to the UPI app to complete your payment' 
                  : 'Secured by Cashfree • PCI DSS Compliant'}
              </Text>
            </Box>
          </VStack>
        ) : (
          // Customer info form
          <VStack spacing={6} align="stretch">
            <Box borderWidth={1} borderRadius="lg" p={{ base: 4, md: 6 }}>
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
                <VStack spacing={4} align="stretch">
                  <FormControl isRequired isInvalid={!!errors.name}>
                    <FormLabel>Full Name</FormLabel>
                    <Input
                      name="name"
                      value={customerInfo.name}
                      onChange={handleInputChange}
                    />
                    {errors.name && (
                      <Text color="red.500" fontSize="sm" mt={1}>{errors.name}</Text>
                    )}
                  </FormControl>
                  
                  <FormControl isRequired isInvalid={!!errors.email}>
                    <FormLabel>Email</FormLabel>
                    <Input
                      name="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={handleInputChange}
                    />
                    {errors.email && (
                      <Text color="red.500" fontSize="sm" mt={1}>{errors.email}</Text>
                    )}
                  </FormControl>
                  
                  <FormControl isRequired isInvalid={!!errors.phone}>
                    <FormLabel>Phone Number</FormLabel>
                    <Input
                      name="phone"
                      type="tel"
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      maxLength={10}
                    />
                    {errors.phone && (
                      <Text color="red.500" fontSize="sm" mt={1}>{errors.phone}</Text>
                    )}
                  </FormControl>
                </VStack>
                
                <FormControl isRequired isInvalid={!!errors.address}>
                  <FormLabel>Address</FormLabel>
                  <Input
                    name="address"
                    value={customerInfo.address}
                    onChange={handleInputChange}
                  />
                  {errors.address && (
                    <Text color="red.500" fontSize="sm" mt={1}>{errors.address}</Text>
                  )}
                </FormControl>
                
                <HStack spacing={4} flexDirection={{ base: 'column', md: 'row' }} align="stretch">
                  <FormControl isRequired isInvalid={!!errors.city}>
                    <FormLabel>City</FormLabel>
                    <Input
                      name="city"
                      value={customerInfo.city}
                      onChange={handleInputChange}
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
                      maxLength={6}
                    />
                    {errors.zipCode && (
                      <Text color="red.500" fontSize="sm" mt={1}>{errors.zipCode}</Text>
                    )}
                  </FormControl>
                </HStack>
              </VStack>
              
              <Divider my={6} />
              
              <Heading size="md" mb={4}>Order Summary</Heading>
              <VStack align="stretch" spacing={3} mb={6}>
                {filteredCartItems.map((item) => (
                  <HStack key={item.product.id} justify="space-between">
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
              
              <Divider my={6} />
              
              <Heading size="md" mb={4}>Payment Method</Heading>
              <RadioGroup onChange={setPaymentMethod} value={paymentMethod} mb={6}>
                <VStack align="stretch" spacing={3}>
                  <Radio value="phonepe" colorScheme="purple">
                    <HStack>
                      <Text>PhonePe</Text>
                      <Badge colorScheme="purple">Recommended</Badge>
                    </HStack>
                  </Radio>
                  <Radio value="googlepay" colorScheme="blue">
                    <Text>Google Pay</Text>
                  </Radio>
                  <Radio value="paytm" colorScheme="orange">
                    <Text>Paytm</Text>
                  </Radio>
                  <Radio value="cashfree" colorScheme="green">
                    <Text>Credit/Debit Card & Net Banking (Cashfree)</Text>
                  </Radio>
                </VStack>
              </RadioGroup>
              
              <Button
                colorScheme="primary"
                size="lg"
                onClick={handlePlaceOrder}
                isLoading={loading}
                width="full"
              >
                Place Order
              </Button>
            </Box>
          </VStack>
        )}
      </Container>
    </Box>
  );
};

export default Checkout;