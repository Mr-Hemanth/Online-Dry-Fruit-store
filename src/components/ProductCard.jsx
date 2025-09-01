import React from 'react';
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
  const isInWish = isInWishlist(product.id);

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

    addToCart(product, 1);
    toast({
      title: 'Added to Cart',
      description: `${product.name} (${product.weight}) has been added to your cart.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
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
        
        <Stack pt={{ base: 8, md: 10 }} align={'center'} spacing={{ base: 2, md: 3 }}>
          <Text color={'gray.500'} fontSize={{ base: 'xs', sm: 'sm' }} textTransform={'uppercase'}>
            {product.category}
          </Text>
          
          <Heading fontSize={{ base: 'lg', sm: 'xl', md: '2xl' }} fontFamily={'body'} fontWeight={500} textAlign="center">
            {product.name}
          </Heading>
          
          {/* Quantity information */}
          <HStack spacing={2} justify="center">
            <Badge colorScheme="blue" fontSize={{ base: '2xs', sm: 'xs' }}>
              {product.weight}
            </Badge>
          </HStack>
          
          <Text color={'gray.600'} fontSize={{ base: 'xs', sm: 'sm' }} textAlign={'center'} noOfLines={2}>
            {product.description}
          </Text>
          
          <HStack spacing={1}>
            <Text fontSize={{ base: 'md', sm: 'lg' }} fontWeight={600}>
              {formatCurrency(product.price)}
            </Text>
            {product.stock > 0 && product.stock < 10 && (
              <Badge colorScheme="orange" fontSize="xs">
                Only {product.stock} left
              </Badge>
            )}
          </HStack>
          
          {/* Add to Cart button */}
          {product.stock > 0 && (
            <Button
              leftIcon={<ShoppingCart size={16} />}
              colorScheme="primary"
              variant="solid"
              size="sm"
              width="full"
              mt={2}
              onClick={handleAddToCart}
              isDisabled={product.stock === 0}
            >
              Add to Cart
            </Button>
          )}
          
          {product.stock === 0 && (
            <Button
              leftIcon={<ShoppingCart size={16} />}
              colorScheme="gray"
              variant="outline"
              size="sm"
              width="full"
              mt={2}
              isDisabled
            >
              Out of Stock
            </Button>
          )}
        </Stack>
      </Box>
    </Center>
  );
};

export default ProductCard;