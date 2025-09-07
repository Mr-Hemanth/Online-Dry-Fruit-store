import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  Image, 
  Button, 
  HStack, 
  VStack, 
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Flex,
  Center,
  Badge,
  Divider,
  Select,
  FormControl,
  FormLabel
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../utils/constants';
import { mongoProductService as productService } from '../services/mongoProductService';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const toast = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState('1kg');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch product data from MongoDB
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError('');
        
        // Fetch the product from MongoDB
        const productData = await productService.getProductById(id);
        
        if (!productData) {
          setError('Product not found');
          return;
        }
        
        setProduct(productData);
        // Set default weight to 1kg
        setSelectedWeight('1kg');
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Calculate price based on weight
  const calculatePriceForWeight = (basePrice, selectedWeight, productBaseWeight) => {
    // Convert product base weight to grams for calculation
    const baseWeightInGrams = convertWeightToGrams(productBaseWeight);
    const selectedWeightInGrams = convertWeightToGrams(selectedWeight);
    
    // Calculate price per gram and then for selected weight
    const pricePerGram = basePrice / baseWeightInGrams;
    return Math.round(pricePerGram * selectedWeightInGrams);
  };

  // Convert weight string to grams
  const convertWeightToGrams = (weight) => {
    if (weight.includes('kg')) {
      return parseFloat(weight) * 1000;
    } else if (weight.includes('g')) {
      return parseFloat(weight);
    }
    return 1000; // default to 1kg
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    if (product.stock === 0) {
      toast({
        title: 'Out of Stock',
        description: 'This product is currently out of stock.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Create a product variant based on selected weight
    const productWithWeight = {
      ...product,
      weight: selectedWeight,
      // Adjust price based on weight
      price: calculatePriceForWeight(product.price, selectedWeight, product.weight)
    };

    addToCart(productWithWeight, quantity);
    toast({
      title: 'Added to Cart',
      description: `${product.name} (${selectedWeight}) has been added to your cart.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
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

  if (error) {
    return (
      <Box py={8}>
        <Container maxW={'4xl'}>
          <Alert status="error">
            <AlertIcon />
            <Box flex="1">
              <AlertTitle>Error!</AlertTitle>
              <AlertDescription display="block">
                {error}
              </AlertDescription>
            </Box>
          </Alert>
          <Center mt={6}>
            <Button 
              leftIcon={<ArrowLeft size={16} />} 
              onClick={() => navigate('/products')}
              colorScheme="primary"
            >
              Back to Products
            </Button>
          </Center>
        </Container>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box py={8}>
        <Container maxW={'4xl'}>
          <Center minH={'50vh'}>
            <VStack spacing={4}>
              <Heading size={'lg'}>Product Not Found</Heading>
              <Text color={'gray.600'}>
                The product you're looking for doesn't exist or has been removed.
              </Text>
              <Button 
                leftIcon={<ArrowLeft size={16} />} 
                onClick={() => navigate('/products')}
                colorScheme="primary"
              >
                Back to Products
              </Button>
            </VStack>
          </Center>
        </Container>
      </Box>
    );
  }

  // Calculate current price based on selected weight
  const currentPrice = calculatePriceForWeight(product.price, selectedWeight, product.weight);

  return (
    <Box py={8}>
      <Container maxW={'6xl'}>
        <Button 
          leftIcon={<ArrowLeft size={16} />} 
          onClick={() => navigate('/products')}
          mb={6}
          variant="ghost"
        >
          Back to Products
        </Button>

        <Box 
          borderWidth={1} 
          borderRadius={'lg'} 
          overflow={'hidden'}
          bg={'white'}
          boxShadow={'lg'}
        >
          <HStack 
            spacing={8} 
            align={'start'} 
            p={8}
            flexDirection={{ base: 'column', md: 'row' }}
          >
            <Box flex={1}>
              <Image
                src={product.imageUrl}
                alt={product.name}
                borderRadius={'lg'}
                w={'100%'}
                maxH={'400px'}
                objectFit={'cover'}
                fallbackSrc={'https://placehold.co/400x400?text=Product+Image&font=montserrat'}
              />
            </Box>

            <VStack 
              align={'stretch'} 
              flex={1} 
              spacing={6}
            >
              <VStack align={'stretch'} spacing={2}>
                <HStack justify={'space-between'}>
                  <Heading size={'lg'}>{product.name}</Heading>
                  <HStack spacing={2}>
                    <Badge colorScheme="blue" fontSize="sm">
                      {product.weight}
                    </Badge>
                  </HStack>
                </HStack>
                <Text color={'gray.500'}>{product.category}</Text>
              </VStack>

              <Text color={'gray.700'} fontSize={'lg'}>
                {product.description}
              </Text>

              <Divider />

              <VStack align={'stretch'} spacing={4}>
                <HStack align={'center'}>
                  <Text fontSize={'2xl'} fontWeight={'bold'}>
                    {formatCurrency(currentPrice)}
                  </Text>
                  <Text color={'gray.500'}>
                    / {selectedWeight}
                  </Text>
                </HStack>

                {product.stock > 0 ? (
                  <HStack>
                    <Text color={'green.500'} fontWeight={'medium'}>
                      In Stock ({product.stock} available)
                    </Text>
                    {product.stock < 10 && (
                      <Badge colorScheme="orange">
                        Only {product.stock} left
                      </Badge>
                    )}
                  </HStack>
                ) : (
                  <Text color={'red.500'} fontWeight={'medium'}>
                    Out of Stock
                  </Text>
                )}
              </VStack>

              <Divider />

              <VStack align={'stretch'} spacing={4}>
                {/* Weight Selection */}
                <HStack>
                  <Text fontWeight={'medium'}>Weight:</Text>
                  <Select 
                    value={selectedWeight} 
                    onChange={(e) => setSelectedWeight(e.target.value)}
                    maxW={'120px'}
                    isDisabled={product.stock === 0}
                  >
                    <option value="250g">250g</option>
                    <option value="500g">500g</option>
                    <option value="1kg">1kg</option>
                  </Select>
                </HStack>
                
                {/* Quantity Selection */}
                <HStack>
                  <Text fontWeight={'medium'}>Quantity:</Text>
                  <Select 
                    value={quantity} 
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    maxW={'80px'}
                    isDisabled={product.stock === 0}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </Select>
                </HStack>
              </VStack>

              <Button
                leftIcon={<ShoppingCart size={16} />}
                colorScheme={'primary'}
                size={'lg'}
                onClick={handleAddToCart}
                isDisabled={product.stock === 0}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </VStack>
          </HStack>
        </Box>
      </Container>
    </Box>
  );
};

export default ProductDetail;