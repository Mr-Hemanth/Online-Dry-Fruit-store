import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Button,
  useToast,
  Spinner,
  Flex,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useWishlist } from '../hooks/useWishlist';
import { mongoProductService as productService } from '../services/mongoProductService';
import ProductCard from '../components/ProductCard';
import { Heart, HeartOff, ShoppingCart, ArrowLeft } from 'lucide-react';

const Wishlist = () => {
  const { user, loading: authLoading } = useAuth();
  const { wishlist, removeFromWishlist, loadWishlistFromDatabase } = useWishlist();
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  // Load wishlist products
  useEffect(() => {
    const loadWishlistProducts = async () => {
      if (wishlist.length === 0) {
        setLoading(false);
        return;
      }

      try {
        // Fetch product details for all wishlist items
        const productPromises = wishlist.map(item => 
          productService.getProductById(item.productId)
        );
        
        const products = await Promise.all(productPromises);
        setWishlistProducts(products.filter(product => product !== null));
      } catch (error) {
        console.error('Error loading wishlist products:', error);
        toast({
          title: 'Error',
          description: 'Failed to load wishlist products',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    loadWishlistProducts();
  }, [wishlist, toast]);

  // Load wishlist from database for logged-in users
  useEffect(() => {
    if (user) {
      loadWishlistFromDatabase(user.uid);
    }
  }, [user, loadWishlistFromDatabase]);

  const handleRemoveFromWishlist = async (productId, productName) => {
    try {
      await removeFromWishlist(productId, user);
      toast({
        title: 'Removed from wishlist',
        description: `${productName} removed from your wishlist`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove product from wishlist',
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
              <AlertTitle>Please log in to view your wishlist!</AlertTitle>
              <AlertDescription display="block">
                You need to be logged in to access your wishlist.
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
      <Container maxW={'6xl'}>
        <Flex justifyContent="space-between" alignItems="center" mb={6}>
          <Heading>My Wishlist</Heading>
          <Tooltip label="Back to products" aria-label="Back to products">
            <IconButton
              icon={<ArrowLeft size={20} />}
              onClick={() => navigate('/products')}
              variant="outline"
              colorScheme="primary"
            />
          </Tooltip>
        </Flex>
        
        {loading ? (
          <Flex justify="center" align="center" minH="50vh">
            <Spinner size="xl" />
          </Flex>
        ) : wishlistProducts.length === 0 ? (
          <Box textAlign="center" py={10}>
            <Heart size={48} style={{ margin: '0 auto 1rem', color: '#CBD5E0' }} />
            <Text fontSize="lg" mb={6}>
              Your wishlist is empty
            </Text>
            <Button 
              colorScheme="primary" 
              onClick={() => navigate('/products')}
              leftIcon={<ShoppingCart size={16} />}
            >
              Browse Products
            </Button>
          </Box>
        ) : (
          <VStack spacing={8} align="stretch">
            <Flex justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={4}>
              <Text>
                {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} in wishlist
              </Text>
              <Button 
                variant="outline" 
                colorScheme="red" 
                onClick={() => navigate('/products')}
                leftIcon={<ShoppingCart size={16} />}
              >
                Continue Shopping
              </Button>
            </Flex>
            
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
              {wishlistProducts.map((product) => (
                <Box key={product.id} position="relative">
                  <ProductCard 
                    product={product} 
                    showRemoveFromWishlist={true}
                    onRemoveFromWishlist={() => handleRemoveFromWishlist(product.id, product.name)}
                  />
                </Box>
              ))}
            </SimpleGrid>
          </VStack>
        )}
      </Container>
    </Box>
  );
};

export default Wishlist;