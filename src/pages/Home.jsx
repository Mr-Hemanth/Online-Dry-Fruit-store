import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Heading, 
  SimpleGrid, 
  Spinner, 
  Text,
  Stack,
  Button,
  Flex,
  Image,
  VStack,
  Icon,
  useColorModeValue,
  Center
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Award, Leaf, Truck, Shield } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { mongoProductService as productService } from '../services/mongoProductService';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch featured products from MongoDB
    const fetchFeaturedProducts = async () => {
      try {
        const products = await productService.getFeaturedProducts(6);
        setFeaturedProducts(products);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <Box>
      {/* Hero Section */}
      <Box
        bg={bgColor}
        py={{ base: 12, sm: 16, md: 20, lg: 28 }}
        position={'relative'}
        overflow={'hidden'}
      >
        <Container maxW={'6xl'}>
          <Stack
            align={'center'}
            spacing={{ base: 6, md: 8, lg: 10 }}
            direction={{ base: 'column', md: 'row' }}
          >
            <Stack flex={1} spacing={{ base: 4, sm: 5, md: 8 }}>
              <Heading
                lineHeight={1.1}
                fontWeight={600}
                fontSize={{ base: '2xl', sm: '3xl', md: '4xl', lg: '5xl', xl: '6xl' }}
              >
                <Text
                  as={'span'}
                  position={'relative'}
                  _after={{
                    content: "''",
                    width: 'full',
                    height: useColorModeValue('20%', '30%'),
                    position: 'absolute',
                    bottom: 1,
                    left: 0,
                    bg: 'primary.400',
                    zIndex: -1,
                  }}
                >
                  Premium
                </Text>
                <br />
                <Text as={'span'} color={'primary.400'}>
                  Dry Fruits & Nuts
                </Text>
              </Heading>
              <Text color={'gray.500'} fontSize={{ base: 'sm', sm: 'md', lg: 'lg', xl: 'xl' }}>
                Experience the finest quality dry fruits and nuts, carefully sourced and
                delivered fresh to your doorstep. Packed with nutrition and flavor for
                your healthy lifestyle.
              </Text>
              <Stack
                spacing={{ base: 3, sm: 4, md: 6 }}
                direction={{ base: 'column', sm: 'row' }}
              >
                <Button
                  as={RouterLink}
                  to={'/products'}
                  rounded={'full'}
                  size={{ base: 'md', sm: 'lg' }}
                  fontWeight={'normal'}
                  px={{ base: 4, sm: 6 }}
                  colorScheme={'primary'}
                  bg={'primary.400'}
                  _hover={{ bg: 'primary.500' }}
                >
                  Shop Now
                </Button>
                <Button
                  as={RouterLink}
                  to={'/products?category=Featured'}
                  rounded={'full'}
                  size={{ base: 'md', sm: 'lg' }}
                  fontWeight={'normal'}
                  px={{ base: 4, sm: 6 }}
                  variant={'outline'}
                  colorScheme={'primary'}
                >
                  View Featured
                </Button>
              </Stack>
            </Stack>
            <Flex
              flex={1}
              justify={'center'}
              align={'center'}
              position={'relative'}
              w={'full'}
            >
              <Box
                position={'relative'}
                height={{ base: '250px', sm: '300px', md: '350px', lg: '400px' }}
                rounded={'2xl'}
                width={'full'}
                overflow={'hidden'}
              >
                <Image
                  alt={'Hero Image'}
                  fit={'cover'}
                  align={'center'}
                  w={'100%'}
                  h={'100%'}
                  src={
                    'https://images.unsplash.com/photo-1559181567-c3190ca9959b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
                  }
                />
              </Box>
            </Flex>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={{ base: 8, sm: 12, md: 16 }}>
        <Container maxW={'6xl'}>
          <VStack spacing={{ base: 6, md: 8 }}>
            <Heading
              fontSize={{ base: 'xl', sm: '2xl', md: '3xl', lg: '4xl' }}
              fontWeight={'bold'}
              textAlign={'center'}
              mb={{ base: 4, md: 8 }}
            >
              Why Choose Herambha Dryfruits?
            </Heading>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 2, lg: 4 }} spacing={{ base: 6, md: 10 }}>
              <Feature
                icon={<Icon as={Award} w={{ base: 8, sm: 10 }} h={{ base: 8, sm: 10 }} />}
                title={'Premium Quality'}
                text={'Hand-picked premium quality products sourced from the best farms.'}
              />
              <Feature
                icon={<Icon as={Leaf} w={{ base: 8, sm: 10 }} h={{ base: 8, sm: 10 }} />}
                title={'100% Natural'}
                text={'No artificial preservatives or chemicals. Pure and natural products.'}
              />
              <Feature
                icon={<Icon as={Truck} w={{ base: 8, sm: 10 }} h={{ base: 8, sm: 10 }} />}
                title={'Fast Delivery'}
                text={'Quick and secure delivery to your doorstep across India.'}
              />
              <Feature
                icon={<Icon as={Shield} w={{ base: 8, sm: 10 }} h={{ base: 8, sm: 10 }} />}
                title={'Quality Assured'}
                text={'Rigorous quality checks ensure you get the best products every time.'}
              />
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Featured Products Section */}
      <Box py={{ base: 8, sm: 12, md: 16 }} bg={bgColor}>
        <Container maxW={'6xl'}>
          <VStack spacing={{ base: 6, md: 8 }}>
            <Heading
              fontSize={{ base: 'xl', sm: '2xl', md: '3xl', lg: '4xl' }}
              fontWeight={'bold'}
              textAlign={'center'}
            >
              Featured Products
            </Heading>
            <Text
              fontSize={{ base: 'sm', sm: 'md', lg: 'lg' }}
              color={'gray.500'}
              textAlign={'center'}
              maxW={'3xl'}
            >
              Discover our handpicked selection of premium dry fruits and nuts,
              carefully chosen for their exceptional quality and taste.
            </Text>
            
            {loading ? (
              <Center py={{ base: 8, md: 10 }}>
                <Spinner size={{ base: 'lg', md: 'xl' }} color={'primary.500'} />
              </Center>
            ) : (
              <SimpleGrid columns={{ base: 1, sm: 2, md: 2, lg: 3 }} spacing={{ base: 6, md: 10 }}>
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </SimpleGrid>
            )}
            
            <Button
              as={RouterLink}
              to={'/products'}
              size={{ base: 'md', sm: 'lg' }}
              colorScheme={'primary'}
              variant={'outline'}
            >
              View All Products
            </Button>
          </VStack>
        </Container>
      </Box>

      {/* Store Policies Section */}
      <Box py={{ base: 8, sm: 12, md: 16 }}>
        <Container maxW={'4xl'}>
          <VStack spacing={{ base: 6, md: 8 }} textAlign={'center'}>
            <Heading fontSize={{ base: 'xl', sm: '2xl', md: '3xl', lg: '4xl' }} fontWeight={'bold'}>
              Our Promise to You
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 6, md: 8 }}>
              <Box bg={cardBg} p={{ base: 4, md: 6 }} rounded={'lg'} shadow={'md'}>
                <Heading size={{ base: 'sm', sm: 'md' }} mb={{ base: 2, md: 4 }} color={'primary.500'}>
                  Easy Returns
                </Heading>
                <Text color={'gray.600'} fontSize={{ base: 'sm', sm: 'md' }}>
                  Not satisfied? Return products within 7 days for a full refund.
                  Your satisfaction is our priority.
                </Text>
              </Box>
              <Box bg={cardBg} p={{ base: 4, md: 6 }} rounded={'lg'} shadow={'md'}>
                <Heading size={{ base: 'sm', sm: 'md' }} mb={{ base: 2, md: 4 }} color={'primary.500'}>
                  Secure Payments
                </Heading>
                <Text color={'gray.600'} fontSize={{ base: 'sm', sm: 'md' }}>
                  Multiple payment options including UPI, cards, and net banking.
                  Your transactions are safe and secure.
                </Text>
              </Box>
              <Box bg={cardBg} p={{ base: 4, md: 6 }} rounded={'lg'} shadow={'md'}>
                <Heading size={{ base: 'sm', sm: 'md' }} mb={{ base: 2, md: 4 }} color={'primary.500'}>
                  Customer Support
                </Heading>
                <Text color={'gray.600'} fontSize={{ base: 'sm', sm: 'md' }}>
                  24/7 customer support via WhatsApp and email. We're here to help
                  whenever you need us.
                </Text>
              </Box>
            </SimpleGrid>
            <Button
              as={RouterLink}
              to={'/policies'}
              size={{ base: 'md', sm: 'lg' }}
              variant={'outline'}
              colorScheme={'primary'}
            >
              Read Our Policies
            </Button>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

const Feature = ({ title, text, icon }) => {
  return (
    <Stack align={'center'} textAlign={'center'}>
      <Flex
        w={{ base: 12, sm: 16 }}
        h={{ base: 12, sm: 16 }}
        align={'center'}
        justify={'center'}
        color={'white'}
        rounded={'full'}
        bg={'primary.100'}
        mb={1}
      >
        {icon}
      </Flex>
      <Text fontWeight={600} color={'primary.500'} fontSize={{ base: 'sm', sm: 'md' }}>
        {title}
      </Text>
      <Text color={'gray.600'} textAlign={'center'} fontSize={{ base: 'xs', sm: 'sm' }}>
        {text}
      </Text>
    </Stack>
  );
};

export default Home;