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
  Flex
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
  const [selectedWeight, setSelectedWeight] = useState('');
  const [product, setProduct] = useState(null);
  const [productVariants, setProductVariants] = useState([]);
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
        
        // Set default weight selection
        setSelectedWeight(productData.id);
        
        // For variants, we'll set an empty array for now
        // In a real implementation, you might fetch variants from the database
        setProductVariants([]);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

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

    addToCart(product, quantity);
    toast({
      title: 'Added to Cart',
      description: `${product.name} (${product.weight}) has been added to your cart.`,
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
                    {formatCurrency(product.price)}
                  </Text>
                  <Text color={'gray.500'}>
                    / {product.weight}
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
                
                {/* Quality indicators */}
                <HStack spacing={2}>
                  <Badge colorScheme="blue">
                    Quantity: {product.weight}
                  </Badge>
                </HStack>
              </VStack>

              <Divider />

              <VStack align={'stretch'} spacing={4}>
                {productVariants.length > 0 && (
                  <VStack align={'stretch'}>
                    <Text fontWeight={'medium'}>Other Variants:</Text>
                    <Select 
                      value={selectedWeight} 
                      onChange={(e) => setSelectedWeight(e.target.value)}
                    >
                      <option value={product.id}>{product.weight} - {formatCurrency(product.price)}</option>
                      {productVariants.map(variant => (
                        <option key={variant.id} value={variant.id}>
                          {variant.weight} - {formatCurrency(variant.price)}
                        </option>
                      ))}
                    </Select>
                  </VStack>
                )}

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