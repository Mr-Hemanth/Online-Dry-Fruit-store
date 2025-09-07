import React, { useState, useEffect } from 'react';
import {
  Box,
  Center,
  useColorModeValue,
  Heading,
  Text,
  Stack,
  Image,
  Button,
  Badge,
  HStack,
  useToast,
  Flex,
  IconButton,
  Tooltip,
  Select,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { ShoppingCart, Heart, HeartOff } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useAuth } from '../hooks/useAuth';
import { formatCurrency } from '../utils/constants';

const ProductCard = ({ product, onRemoveFromWishlist, showRemoveFromWishlist = false }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const toast = useToast();
  
  // Initialize with 1kg if available, otherwise 500g
  const [selectedWeight, setSelectedWeight] = useState('1kg');
  const [quantity, setQuantity] = useState(1);
  const isInWish = isInWishlist(product.id);

  // Set the default weight based on product availability
  useEffect(() => {
    // For this implementation, we're keeping it simple and always defaulting to 1kg
    // In a more complex implementation, we would check what weights are available for the product
    setSelectedWeight('1kg');
  }, [product]);

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    e.stopPropagation();
    
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
      // Adjust price based on weight (assuming price is for 1kg)
      price: calculatePriceForWeight(product.price, selectedWeight, product.weight)
    };

    addToCart(productWithWeight, quantity);
    toast({
      title: 'Added to Cart',
      description: `${product.name} (${selectedWeight}, Qty: ${quantity}) has been added to your cart.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    
    // Reset quantity to 1 after adding to cart
    setQuantity(1);
  };

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

  const handleToggleWishlist = async (e) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    e.stopPropagation();
    
    if (showRemoveFromWishlist && onRemoveFromWishlist) {
      // If showing in wishlist page, remove from wishlist
      onRemoveFromWishlist();
      return;
    }
    
    if (isInWish) {
      // Remove from wishlist
      await removeFromWishlist(product.id, user);
      toast({
        title: 'Removed from Wishlist',
        description: `${product.name} has been removed from your wishlist.`,
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    } else {
      // Add to wishlist
      const added = await addToWishlist(product, user);
      if (added) {
        toast({
          title: 'Added to Wishlist',
          description: `${product.name} has been added to your wishlist.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Already in Wishlist',
          description: `${product.name} is already in your wishlist.`,
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  // Weight options for selection
  const weightOptions = ['250g', '500g', '1kg'];

  return (
    <Center py={{ base: 4, md: 6 }}>
      <Box
        as={RouterLink}
        to={`/product/${product.id}`}
        role={'group'}
        p={{ base: 4, md: 6 }}
        maxW={'330px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'2xl'}
        rounded={'lg'}
        pos={'relative'}
        zIndex={1}
        _hover={{
          transform: { base: 'none', md: 'translateY(-5px)' },
          transition: 'all 0.3s ease',
          textDecoration: 'none',
        }}
        transition={'all 0.3s ease'}
        cursor={'pointer'}
      >
        <Box
          rounded={'lg'}
          mt={-12}
          pos={'relative'}
          height={{ base: '180px', sm: '200px', md: '230px' }}
          _after={{
            transition: 'all .3s ease',
            content: '""',
            w: 'full',
            h: 'full',
            pos: 'absolute',
            top: 5,
            left: 0,
            backgroundImage: `url(${product.imageUrl})`,
            filter: 'blur(15px)',
            zIndex: -1,
          }}
          _groupHover={{
            _after: {
              filter: { base: 'blur(15px)', md: 'blur(20px)' },
            },
          }}
        >
          <Image
            rounded={'lg'}
            height={{ base: '180px', sm: '200px', md: '230px' }}
            width={'100%'}
            objectFit={'cover'}
            src={product.imageUrl}
            alt={product.name}
            fallbackSrc={'https://placehold.co/300x230?text=Product+Image&font=montserrat'}
          />
          
          {/* Out of Stock badge */}
          {product.stock === 0 && (
            <Badge
              position={'absolute'}
              top={2}
              left={2}
              colorScheme={'red'}
              fontSize={{ base: '2xs', sm: 'xs' }}
            >
              Out of Stock
            </Badge>
          )}
          
          {/* Quantity badge */}
          <Badge
            position={'absolute'}
            bottom={2}
            left={2}
            colorScheme={'primary'}
            fontSize={{ base: '2xs', sm: 'xs' }}
          >
            {product.weight}
          </Badge>
          
          {/* Wishlist button with improved visual feedback */}
          <Tooltip 
            label={isInWish ? "Remove from wishlist" : "Add to wishlist"} 
            aria-label={isInWish ? "Remove from wishlist" : "Add to wishlist"}
            placement="top"
            hasArrow
          >
            <IconButton
              icon={showRemoveFromWishlist ? <HeartOff size={16} /> : <Heart size={16} />}
              colorScheme={isInWish ? 'red' : 'gray'}
              variant={isInWish ? 'solid' : 'outline'}
              aria-label={showRemoveFromWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              size="sm"
              position="absolute"
              top={2}
              left={showRemoveFromWishlist ? 'auto' : 2}
              right={showRemoveFromWishlist ? 2 : 'auto'}
              onClick={handleToggleWishlist}
              zIndex={2}
              _hover={{
                transform: 'scale(1.1)',
                transition: 'transform 0.2s ease',
              }}
            />
          </Tooltip>
        </Box>

        <Stack pt={10} align={'center'}>
          <Heading fontSize={'lg'} fontFamily={'body'} fontWeight={500}>
            {product.name}
          </Heading>

          <Text color={'gray.500'} fontSize={'sm'} textTransform={'uppercase'}>
            {product.category}
          </Text>

          <Text fontWeight={800} fontSize={'xl'} color={'primary.500'}>
            {formatCurrency(product.price)} <Text as="span" fontSize="sm">/ {product.weight}</Text>
          </Text>

          {/* Weight selector and Quantity selector */}
          <Stack direction={'row'} align={'center'} spacing={2} width="100%">
            <FormControl width="35%">
              <Select 
                size="sm" 
                value={selectedWeight}
                onChange={(e) => setSelectedWeight(e.target.value)}
              >
                {weightOptions.map(weight => (
                  <option key={weight} value={weight}>{weight}</option>
                ))}
              </Select>
            </FormControl>
            
            <FormControl width="25%">
              <Select 
                size="sm" 
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </Select>
            </FormControl>
            
            <Button
              size="sm"
              flex={1}
              colorScheme="primary"
              leftIcon={<ShoppingCart size={16} />}
              onClick={handleAddToCart}
              isDisabled={product.stock === 0}
            >
              Add
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Center>
  );
};

export default ProductCard;