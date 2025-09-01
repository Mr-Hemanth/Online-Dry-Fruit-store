import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  Image,
  useToast,
  Spinner,
  Center,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Divider,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { formatCurrency } from '../utils/constants';
import { mongoOrderService as orderService } from '../services/mongoOrderService';

const AdminOrders = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Fetch orders from MongoDB
        const ordersData = await orderService.getAllOrders();
        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: 'Error fetching orders',
          description: 'Could not load orders. Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [toast]);

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

  // Filter orders based on status and search term
  const filteredOrders = orders.filter(order => {
    const matchesStatus = filter === 'all' || order.orderStatus === filter;
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (order.customerInfo?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (order.customerInfo?.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    onOpen();
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const updatedOrder = await orderService.updateOrderStatus(orderId, newStatus);
      
      if (updatedOrder) {
        setOrders(prev => prev.map(order => 
          order.id === orderId ? updatedOrder : order
        ));
        
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(updatedOrder);
        }
        
        toast({
          title: 'Order updated',
          description: `Order status has been updated to ${newStatus}.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error updating order',
          description: 'Could not update order status. Order not found.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: 'Error updating order',
        description: error.message || 'Could not update order status. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleUpdatePaymentStatus = async (orderId, newStatus) => {
    try {
      const updatedOrder = await orderService.updatePaymentStatus(orderId, newStatus);
      
      if (updatedOrder) {
        setOrders(prev => prev.map(order => 
          order.id === orderId ? updatedOrder : order
        ));
        
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(updatedOrder);
        }
        
        toast({
          title: 'Payment status updated',
          description: `Payment status has been updated to ${newStatus}.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error updating payment',
          description: 'Could not update payment status. Order not found.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast({
        title: 'Error updating payment',
        description: error.message || 'Could not update payment status. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

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

  return (
    <Box py={8}>
      <Container maxW={'8xl'}>
        <Button 
          leftIcon={<ArrowLeft size={16} />} 
          onClick={() => navigate('/admin')}
          mb={6}
          variant="ghost"
        >
          Back to Dashboard
        </Button>

        <VStack spacing={8} align={'stretch'}>
          <HStack justify={'space-between'} flexWrap={'wrap'}>
            <Heading>Order Management</Heading>
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
              <InputGroup maxW={'300px'}>
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

          <TableContainer>
            <Table variant={'simple'}>
              <Thead>
                <Tr>
                  <Th>Order ID</Th>
                  <Th>Customer</Th>
                  <Th>Items</Th>
                  <Th isNumeric>Total</Th>
                  <Th>Order Status</Th>
                  <Th>Payment Status</Th>
                  <Th>Date</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredOrders.map(order => (
                  <Tr key={order.id}>
                    <Td fontWeight={'medium'}>{order.id}</Td>
                    <Td>
                      <VStack align={'start'} spacing={0}>
                        <Text>{order.customerInfo?.name || 'N/A'}</Text>
                        <Text fontSize={'sm'} color={'gray.500'}>
                          {order.customerInfo?.email || 'N/A'}
                        </Text>
                      </VStack>
                    </Td>
                    <Td>{order.items?.length || 0}</Td>
                    <Td isNumeric>{formatCurrency(order.totalAmount || 0)}</Td>
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
                    <Td>
                      <Button 
                        size={'sm'} 
                        onClick={() => handleViewOrder(order)}
                      >
                        View
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </VStack>
      </Container>

      {/* Order Detail Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Order Details - {selectedOrder?.id}</ModalHeader>
          <ModalCloseButton />
          {selectedOrder && (
            <>
              <ModalBody>
                <VStack spacing={6} align={'stretch'}>
                  {/* Customer Information */}
                  <Box>
                    <Heading size={'md'} mb={4}>Customer Information</Heading>
                    <VStack align={'stretch'} spacing={2}>
                      <HStack justify={'space-between'}>
                        <Text fontWeight={'medium'}>Name:</Text>
                        <Text>{selectedOrder.customerInfo?.name || 'N/A'}</Text>
                      </HStack>
                      <HStack justify={'space-between'}>
                        <Text fontWeight={'medium'}>Email:</Text>
                        <Text>{selectedOrder.customerInfo?.email || 'N/A'}</Text>
                      </HStack>
                      <HStack justify={'space-between'}>
                        <Text fontWeight={'medium'}>Phone:</Text>
                        <Text>{selectedOrder.customerInfo?.phone || 'N/A'}</Text>
                      </HStack>
                      <HStack justify={'space-between'}>
                        <Text fontWeight={'medium'}>Address:</Text>
                        <Text textAlign={'right'}>
                          {selectedOrder.customerInfo?.address || ''} 
                          {selectedOrder.customerInfo?.city ? `, ${selectedOrder.customerInfo.city}` : ''}
                          {selectedOrder.customerInfo?.state ? `, ${selectedOrder.customerInfo.state}` : ''}
                          {selectedOrder.customerInfo?.zipCode ? ` ${selectedOrder.customerInfo.zipCode}` : ''}
                        </Text>
                      </HStack>
                    </VStack>
                  </Box>

                  <Divider />

                  {/* Order Items */}
                  <Box>
                    <Heading size={'md'} mb={4}>Order Items</Heading>
                    <VStack spacing={4} align={'stretch'}>
                      {selectedOrder.items?.map(item => (
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
                  </Box>

                  <Divider />

                  {/* Payment Information */}
                  <Box>
                    <Heading size={'md'} mb={4}>Payment Information</Heading>
                    <VStack align={'stretch'} spacing={2}>
                      <HStack justify={'space-between'}>
                        <Text fontWeight={'medium'}>Payment Method:</Text>
                        <Text>{selectedOrder.paymentMethod || 'N/A'}</Text>
                      </HStack>
                      <HStack justify={'space-between'}>
                        <Text fontWeight={'medium'}>Payment Status:</Text>
                        <Badge colorScheme={getPaymentStatusColor(selectedOrder.paymentStatus)}>
                          {selectedOrder.paymentStatus}
                        </Badge>
                      </HStack>
                      {selectedOrder.utrNumber && (
                        <HStack justify={'space-between'}>
                          <Text fontWeight={'medium'}>UTR Number:</Text>
                          <Text>{selectedOrder.utrNumber}</Text>
                        </HStack>
                      )}
                      <HStack justify={'space-between'}>
                        <Text fontWeight={'medium'}>Total Amount:</Text>
                        <Text fontWeight={'bold'}>{formatCurrency(selectedOrder.totalAmount || 0)}</Text>
                      </HStack>
                    </VStack>
                  </Box>

                  <Divider />

                  {/* Order Status */}
                  <Box>
                    <Heading size={'md'} mb={4}>Order Status</Heading>
                    <VStack align={'stretch'} spacing={2}>
                      <HStack justify={'space-between'}>
                        <Text fontWeight={'medium'}>Current Status:</Text>
                        <Badge colorScheme={getStatusColor(selectedOrder.orderStatus)}>
                          {selectedOrder.orderStatus}
                        </Badge>
                      </HStack>
                      <HStack justify={'space-between'}>
                        <Text fontWeight={'medium'}>Order Date:</Text>
                        <Text>
                          {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : 'N/A'}
                        </Text>
                      </HStack>
                      <HStack justify={'space-between'}>
                        <Text fontWeight={'medium'}>Last Updated:</Text>
                        <Text>
                          {selectedOrder.updatedAt ? new Date(selectedOrder.updatedAt).toLocaleString() : 'N/A'}
                        </Text>
                      </HStack>
                    </VStack>
                  </Box>
                </VStack>
              </ModalBody>

              <ModalFooter>
                <HStack spacing={3}>
                  <Select
                    value={selectedOrder.orderStatus}
                    onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value)}
                    maxW={'150px'}
                  >
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </Select>
                  <Select
                    value={selectedOrder.paymentStatus}
                    onChange={(e) => handleUpdatePaymentStatus(selectedOrder.id, e.target.value)}
                    maxW={'150px'}
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </Select>
                  <Button variant="ghost" mr={3} onClick={onClose}>
                    Close
                  </Button>
                </HStack>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AdminOrders;