import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Divider,
  Stack,
  Image,
  useToast,
  Flex,
  IconButton,
  Checkbox,
} from '@chakra-ui/react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../utils/constants';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const toast = useToast();
  const [selectedItems, setSelectedItems] = useState(
    cart.items.map(item => item.productId)
  );

  // Update selected items when cart changes
  React.useEffect(() => {
    setSelectedItems(cart.items.map(item => item.productId));
  }, [cart.items]);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      setSelectedItems(prev => prev.filter(id => id !== productId));
      toast({
        title: 'Item Removed',
        description: 'Item has been removed from your cart.',
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId, productName) => {
    removeFromCart(productId);
    setSelectedItems(prev => prev.filter(id => id !== productId));
    toast({
      title: 'Item Removed',
      description: `${productName} has been removed from your cart.`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const toggleItemSelection = (productId) => {
    setSelectedItems(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === cart.items.length) {
      // Deselect all
      setSelectedItems([]);
    } else {
      // Select all
      setSelectedItems(cart.items.map(item => item.productId));
    }
  };

  const getSelectedItemsTotal = () => {
    return cart.items
      .filter(item => selectedItems.includes(item.productId))
      .reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getSelectedItemsCount = () => {
    return cart.items
      .filter(item => selectedItems.includes(item.productId))
      .reduce((count, item) => count + item.quantity, 0);
  };

  if (cart.items.length === 0) {
    return (
      <Box py={{ base: 4, md: 8 }}>
        <Container maxW={'4xl'}>
          <VStack spacing={{ base: 6, md: 8 }} textAlign={'center'} py={{ base: 8, md: 16 }}>
            <Heading size={{ base: 'md', sm: 'lg' }}>Your Cart is Empty</Heading>
            <Text color={'gray.600'} fontSize={{ base: 'sm', sm: 'md' }}>
              Add some delicious dry fruits and nuts to your cart!
            </Text>
            <Button as={RouterLink} to={'/products'} colorScheme={'primary'} size={{ base: 'md', sm: 'lg' }}>
              Shop Now
            </Button>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box py={{ base: 4, md: 8 }}>
      <Container maxW={'6xl'}>
        <Heading mb={{ base: 4, md: 8 }} fontSize={{ base: 'xl', sm: '2xl', md: '3xl' }}>Shopping Cart</Heading>
        
        <Stack direction={{ base: 'column', lg: 'row' }} spacing={{ base: 4, md: 8 }}>
          {/* Cart Items */}
          <Box flex={2}>
            {/* Select All Checkbox */}
            <Box mb={4}>
              <Checkbox
                isChecked={selectedItems.length === cart.items.length && cart.items.length > 0}
                onChange={toggleSelectAll}
                colorScheme="primary"
              >
                Select All ({cart.items.length} items)
              </Checkbox>
            </Box>
            
            <VStack spacing={{ base: 3, md: 4 }} align={'stretch'}>
              {cart.items.map((item) => (
                <Box
                  key={item.productId}
                  p={{ base: 3, sm: 4, md: 6 }}
                  border={'1px'}
                  borderColor={'gray.200'}
                  rounded={'lg'}
                  bg={'white'}
                >
                  <HStack spacing={{ base: 3, sm: 4 }} align={'start'}>
                    <Checkbox
                      isChecked={selectedItems.includes(item.productId)}
                      onChange={() => toggleItemSelection(item.productId)}
                      colorScheme="primary"
                    />
                    
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      w={{ base: '60px', sm: '80px' }}
                      h={{ base: '60px', sm: '80px' }}
                      objectFit={'cover'}
                      rounded={'md'}
                      fallbackSrc={'https://placehold.co/80x80?text=Product&font=montserrat'}
                    />
                    
                    <VStack align={'start'} flex={1} spacing={1}>
                      <Heading size={{ base: 'sm', sm: 'md' }} noOfLines={1}>{item.product.name}</Heading>
                      <Text fontSize={{ base: 'xs', sm: 'sm' }} color={'gray.600'} noOfLines={2}>
                        {item.product.weight} • {item.product.category}
                      </Text>
                      <Text fontSize={{ base: 'sm', sm: 'lg' }} fontWeight={'bold'} color={'primary.500'}>
                        {formatCurrency(item.product.price)}
                      </Text>
                    </VStack>
                    
                    <VStack spacing={1}>
                      <HStack>
                        <IconButton
                          size={{ base: 'xs', sm: 'sm' }}
                          variant={'outline'}
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          icon={<Minus size={12} />}
                          aria-label="Decrease quantity"
                        />
                        <Text minW={'30px'} textAlign={'center'} fontWeight={'bold'} fontSize={{ base: 'sm', sm: 'md' }}>
                          {item.quantity}
                        </Text>
                        <IconButton
                          size={{ base: 'xs', sm: 'sm' }}
                          variant={'outline'}
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          icon={<Plus size={12} />}
                          aria-label="Increase quantity"
                        />
                      </HStack>
                      
                      <IconButton
                        size={{ base: 'xs', sm: 'sm' }}
                        variant={'ghost'}
                        colorScheme={'red'}
                        onClick={() => handleRemoveItem(item.productId, item.product.name)}
                        icon={<Trash2 size={14} />}
                        aria-label="Remove item"
                      />
                    </VStack>
                    
                    <Text fontSize={{ base: 'sm', sm: 'lg' }} fontWeight={'bold'} display={{ base: 'none', sm: 'block' }}>
                      {formatCurrency(item.product.price * item.quantity)}
                    </Text>
                  </HStack>
                  
                  {/* Show total price on mobile */}
                  <Flex justify={'flex-end'} mt={2} display={{ base: 'flex', sm: 'none' }}>
                    <Text fontSize={'sm'} fontWeight={'bold'}>
                      {formatCurrency(item.product.price * item.quantity)}
                    </Text>
                  </Flex>
                </Box>
              ))}
            </VStack>
          </Box>
          
          {/* Order Summary */}
          <Box flex={1}>
            <Box
              p={{ base: 4, sm: 6 }}
              border={'1px'}
              borderColor={'gray.200'}
              rounded={'lg'}
              bg={'white'}
              position={{ base: 'static', lg: 'sticky' }}
              top={4}
            >
              <Heading size={{ base: 'sm', sm: 'md' }} mb={{ base: 3, sm: 4 }}>Order Summary</Heading>
              
              <VStack spacing={{ base: 2, sm: 3 }} align={'stretch'}>
                <HStack justify={'space-between'}>
                  <Text fontSize={{ base: 'sm', sm: 'md' }}>Subtotal ({getSelectedItemsCount()} items)</Text>
                  <Text fontSize={{ base: 'sm', sm: 'md' }}>{formatCurrency(getSelectedItemsTotal())}</Text>
                </HStack>
                
                <HStack justify={'space-between'}>
                  <Text fontSize={{ base: 'sm', sm: 'md' }}>Shipping</Text>
                  <Text fontSize={{ base: 'sm', sm: 'md' }}>Calculated at checkout</Text>
                </HStack>
                
                <Divider />
                
                <HStack justify={'space-between'} fontSize={{ base: 'lg', sm: 'xl' }} fontWeight={'bold'}>
                  <Text>Total</Text>
                  <Text>{formatCurrency(getSelectedItemsTotal())}</Text>
                </HStack>
                
                <Button
                  as={RouterLink}
                  to={'/checkout'}
                  state={{ selectedItems }}
                  colorScheme={'primary'}
                  size={{ base: 'md', sm: 'lg' }}
                  w={'full'}
                  mt={{ base: 3, sm: 4 }}
                  isDisabled={selectedItems.length === 0}
                >
                  Proceed to Checkout
                </Button>
                
                <Button
                  as={RouterLink}
                  to={'/products'}
                  variant={'outline'}
                  size={{ base: 'md', sm: 'lg' }}
                  w={'full'}
                >
                  Continue Shopping
                </Button>
              </VStack>
            </Box>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default Cart;