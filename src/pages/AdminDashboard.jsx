import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
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
  Icon,
  useToast,
  Center,
  InputGroup,
  InputLeftElement,
  Input,
  Select,
  Image
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, Package, Users, TrendingUp, ArrowUpRight, ArrowDownRight, Search, DollarSign } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { mongoProductService as productService } from '../services/mongoProductService';
import { mongoOrderService as orderService } from '../services/mongoOrderService';
import { formatCurrency } from '../utils/constants';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Fetch recent orders from MongoDB
        const orderData = await orderService.getAllOrders();
        setOrders(orderData);
        
        // Fetch products from MongoDB
        const productData = await productService.getAllProducts();
        setProducts(productData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error fetching data',
          description: 'Could not load dashboard data. Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, toast]);

  const getStatusColor = (status) => {
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

  // Calculate stats
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingOrders = orders.filter(order => order.orderStatus === 'processing').length;
  const deliveredOrders = orders.filter(order => order.orderStatus === 'delivered').length;

  // Filter orders based on status and search term
  const filteredOrders = orders.filter(order => {
    const matchesStatus = filter === 'all' || order.orderStatus === filter;
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerInfo.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (!user) {
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

  if (loading) {
    return (
      <Box py={8}>
        <Container maxW={'8xl'}>
          <Center minH={'50vh'}>
            <Spinner size={'xl'} color={'primary.500'} />
          </Center>
        </Container>
      </Box>
    );
  }

  if (!user.isAdmin) {
    return (
      <Box py={8}>
        <Container maxW={'4xl'}>
          <Center minH={'50vh'}>
            <VStack spacing={4}>
              <Heading size={'lg'}>Access Denied</Heading>
              <Text color={'gray.600'}>
                You don't have permission to access the admin dashboard.
              </Text>
            </VStack>
          </Center>
        </Container>
      </Box>
    );
  }

  return (
    <Box py={8}>
      <Container maxW={'8xl'}>
        <VStack spacing={8} align={'stretch'}>
          <Heading>Admin Dashboard</Heading>
          
          <Text color={'gray.600'}>
            Welcome, {user.displayName || 'Admin'}! Here you can manage your store.
          </Text>
          
          {/* Stats Cards */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            <Box p={6} borderWidth={1} borderRadius={'lg'} bg={'white'} boxShadow={'sm'}>
              <Stat>
                <StatLabel>Total Revenue</StatLabel>
                <StatNumber>{formatCurrency(totalRevenue)}</StatNumber>
                <StatHelpText>
                  <StatArrow type='increase' />
                  23.36%
                </StatHelpText>
              </Stat>
            </Box>
            
            <Box p={6} borderWidth={1} borderRadius={'lg'} bg={'white'} boxShadow={'sm'}>
              <Stat>
                <StatLabel>Total Orders</StatLabel>
                <StatNumber>{totalOrders}</StatNumber>
                <StatHelpText>
                  <StatArrow type='increase' />
                  5.2%
                </StatHelpText>
              </Stat>
            </Box>
            
            <Box p={6} borderWidth={1} borderRadius={'lg'} bg={'white'} boxShadow={'sm'}>
              <Stat>
                <StatLabel>Pending Orders</StatLabel>
                <StatNumber>{pendingOrders}</StatNumber>
                <StatHelpText>
                  <StatArrow type='decrease' />
                  2.1%
                </StatHelpText>
              </Stat>
            </Box>
            
            <Box p={6} borderWidth={1} borderRadius={'lg'} bg={'white'} boxShadow={'sm'}>
              <Stat>
                <StatLabel>Delivered Orders</StatLabel>
                <StatNumber>{deliveredOrders}</StatNumber>
                <StatHelpText>
                  <StatArrow type='increase' />
                  12.8%
                </StatHelpText>
              </Stat>
            </Box>
          </SimpleGrid>
          
          {/* Recent Orders */}
          <Box p={6} borderWidth={1} borderRadius={'lg'} bg={'white'} boxShadow={'sm'}>
            <VStack spacing={4} align={'stretch'}>
              <HStack justify={'space-between'} flexWrap={'wrap'}>
                <Heading size={'md'}>Recent Orders</Heading>
                <HStack>
                  <Select 
                    value={filter} 
                    onChange={(e) => setFilter(e.target.value)}
                    maxW={'150px'}
                  >
                    <option value="all">All Status</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </Select>
                  <InputGroup maxW={'250px'}>
                    <InputLeftElement pointerEvents={'none'}>
                      <Icon as={Search} color={'gray.300'} />
                    </InputLeftElement>
                    <Input
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </HStack>
              </HStack>
              
              {loading ? (
                <Center py={8}>
                  <Spinner size={'lg'} />
                </Center>
              ) : (
                <TableContainer>
                  <Table variant={'simple'}>
                    <Thead>
                      <Tr>
                        <Th>Order ID</Th>
                        <Th>Customer</Th>
                        <Th>Items</Th>
                        <Th isNumeric>Total</Th>
                        <Th>Status</Th>
                        <Th>Payment</Th>
                        <Th>Date</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredOrders.map(order => (
                        <Tr key={order.id}>
                          <Td fontWeight={'medium'}>{order.id}</Td>
                          <Td>
                            <VStack align={'start'} spacing={0}>
                              <Text>{order.customerInfo.name}</Text>
                              <Text fontSize={'sm'} color={'gray.500'}>
                                {order.customerInfo.email}
                              </Text>
                            </VStack>
                          </Td>
                          <Td>{order.items.length}</Td>
                          <Td isNumeric>{formatCurrency(order.totalAmount)}</Td>
                          <Td>
                            <Badge colorScheme={getStatusColor(order.orderStatus)}>
                              {order.orderStatus}
                            </Badge>
                          </Td>
                          <Td>
                            <Badge colorScheme={getPaymentStatusColor(order.paymentStatus)}>
                              {order.paymentStatus}
                            </Badge>
                          </Td>
                          <Td>
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              )}
            </VStack>
          </Box>
          
          {/* Product Inventory */}
          <Box p={6} borderWidth={1} borderRadius={'lg'} bg={'white'} boxShadow={'sm'}>
            <VStack spacing={4} align={'stretch'}>
              <Heading size={'md'}>Product Inventory</Heading>
              <TableContainer>
                <Table variant={'simple'}>
                  <Thead>
                    <Tr>
                      <Th>Product</Th>
                      <Th>Category</Th>
                      <Th>Weight</Th>
                      <Th isNumeric>Price</Th>
                      <Th isNumeric>Stock</Th>
                      <Th>Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {products.map(product => (
                      <Tr key={product.id}>
                        <Td>
                          <HStack>
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              boxSize={'40px'}
                              objectFit={'cover'}
                              borderRadius={'md'}
                              fallbackSrc={'https://placehold.co/40x40?text=Img&font=montserrat'}
                            />
                            <VStack align={'start'} spacing={0}>
                              <Text fontWeight={'medium'}>{product.name}</Text>
                              {product.featured && (
                                <Badge colorScheme="primary" fontSize={'xs'}>
                                  Featured
                                </Badge>
                              )}
                            </VStack>
                          </HStack>
                        </Td>
                        <Td>{product.category}</Td>
                        <Td>{product.weight}</Td>
                        <Td isNumeric>{formatCurrency(product.price)}</Td>
                        <Td isNumeric>
                          <Text color={product.stock > 10 ? 'green.500' : product.stock > 0 ? 'orange.500' : 'red.500'}>
                            {product.stock}
                          </Text>
                        </Td>
                        <Td>
                          {product.stock > 0 ? (
                            <Badge colorScheme="green">In Stock</Badge>
                          ) : (
                            <Badge colorScheme="red">Out of Stock</Badge>
                          )}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </VStack>
          </Box>
          
          {/* Quick Actions */}
          <Box p={6} borderWidth={1} borderRadius={'lg'} bg={'white'} boxShadow={'sm'}>
            <VStack spacing={4} align={'stretch'}>
              <Heading size={'md'}>Quick Actions</Heading>
              <HStack spacing={4} flexWrap={'wrap'}>
                <Button 
                  leftIcon={<Package size={16} />} 
                  onClick={() => navigate('/admin/products')}
                >
                  Add New Product
                </Button>
                <Button 
                  leftIcon={<ShoppingCart size={16} />} 
                  variant={'outline'}
                  onClick={() => navigate('/admin/orders')}
                >
                  View All Orders
                </Button>
                <Button 
                  leftIcon={<DollarSign size={16} />} 
                  variant={'outline'}
                  onClick={() => navigate('/admin/orders')}
                >
                  Manage Payments
                </Button>
                <Button 
                  leftIcon={<Users size={16} />} 
                  variant={'outline'}
                  onClick={() => navigate('/admin/orders')}
                >
                  Manage Customers
                </Button>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default AdminDashboard;