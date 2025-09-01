import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  Flex,
  useToast,
  Center,
  Divider,
  Image,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { mongoOrderService as orderService } from '../services/mongoOrderService';
import { formatCurrency } from '../utils/constants';

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      try {
        const userOrders = await orderService.getOrdersByUserId(user.uid);
        setOrders(userOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch orders. Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, toast]);

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'processing': return 'yellow';
      case 'shipped': return 'blue';
      case 'delivered': return 'green';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'yellow';
      case 'completed': return 'green';
      case 'failed': return 'red';
      default: return 'gray';
    }
  };

  if (loading) {
    return (
      <Box py={8}>
        <Container maxW={'4xl'}>
          <Center minH={'50vh'}>
            <Spinner size={'xl'} color={'primary.500'} />
          </Center>
        </Container>
      </Box>
    );
  }

  return (
    <Box py={8}>
      <Container maxW={'6xl'}>
        <Button 
          leftIcon={<ArrowLeft size={16} />} 
          onClick={() => navigate(-1)}
          mb={6}
          variant="ghost"
        >
          Back
        </Button>

        <VStack spacing={8} align={'stretch'}>
          <Heading>My Orders</Heading>

          {orders.length === 0 ? (
            <Center minH={'50vh'}>
              <VStack spacing={4}>
                <Text fontSize={'lg'} color={'gray.600'}>
                  You haven't placed any orders yet.
                </Text>
                <Button 
                  colorScheme="primary" 
                  onClick={() => navigate('/products')}
                >
                  Start Shopping
                </Button>
              </VStack>
            </Center>
          ) : (
            <VStack spacing={6} align={'stretch'}>
              {orders.map(order => (
                <Box 
                  key={order.id} 
                  borderWidth={1} 
                  borderRadius={'lg'} 
                  p={6}
                  bg={'white'}
                  boxShadow={'sm'}
                >
                  <VStack spacing={4} align={'stretch'}>
                    <HStack justify={'space-between'} flexWrap={'wrap'}>
                      <VStack align={'stretch'} spacing={1}>
                        <HStack>
                          <Text fontWeight={'bold'}>Order ID:</Text>
                          <Text>{order.id}</Text>
                        </HStack>
                        <Text fontSize={'sm'} color={'gray.500'}>
                          Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                        </Text>
                      </VStack>
                      <HStack spacing={3}>
                        <Badge colorScheme={getOrderStatusColor(order.orderStatus)}>
                          {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1)}
                        </Badge>
                        <Badge colorScheme={getPaymentStatusColor(order.paymentStatus)}>
                          {order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1)}
                        </Badge>
                      </HStack>
                    </HStack>

                    <Divider />

                    <VStack spacing={4} align={'stretch'}>
                      {order.items?.map(item => (
                        <HStack key={item.productId} spacing={4}>
                          <Image
                            src={item.productImage || '/images/default-product.jpg'}
                            alt={item.productName || 'Product'}
                            boxSize={'60px'}
                            objectFit={'cover'}
                            borderRadius={'md'}
                            fallbackSrc={'https://placehold.co/60x60?text=Img&font=montserrat'}
                          />
                          <VStack flex={1} align={'stretch'} spacing={0}>
                            <Text fontWeight={'medium'}>{item.productName || 'Unknown Product'}</Text>
                            <Text fontSize={'sm'} color={'gray.500'}>
                              {item.productWeight || 'N/A'}
                            </Text>
                          </VStack>
                          <Text>
                            {item.quantity} × {formatCurrency(item.productPrice || 0)}
                          </Text>
                          <Text fontWeight={'medium'}>
                            {formatCurrency((item.quantity || 0) * (item.productPrice || 0))}
                          </Text>
                        </HStack>
                      ))}
                    </VStack>

                    <Divider />

                    <HStack justify={'space-between'}>
                      <Text fontWeight={'bold'}>Total:</Text>
                      <Text fontWeight={'bold'} fontSize={'lg'}>
                        {formatCurrency(order.totalAmount || 0)}
                      </Text>
                    </HStack>
                  </VStack>
                </Box>
              ))}
            </VStack>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default Orders;