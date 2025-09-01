import React from 'react';
import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Text,
  Link,
  useColorModeValue,
  Divider,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

const Footer = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const linkColor = useColorModeValue('primary.500', 'primary.300');

  // Use direct fallback values instead of import.meta.env to avoid issues
  const whatsappNumber = '+91 91776 96666';
  const contactEmail = 'herambhadryfruits@gmail.com';
  const contactPhone = '+91 91776 96666';

  return (
    <Box bg={bgColor} color={textColor}>
      <Container as={Stack} maxW={'6xl'} py={10}>
        <SimpleGrid
          templateColumns={{ sm: '1fr 1fr', md: '2fr 1fr 1fr 1fr' }}
          spacing={8}
        >
          <Stack spacing={6}>
            <Box>
              <Text fontSize={'lg'} fontWeight={'bold'} color={linkColor}>
                Herambha Dryfruits
              </Text>
              <Text fontSize={'sm'} mt={2}>
                Premium quality dry fruits and nuts delivered fresh to your doorstep.
                Experience the taste of health and nutrition with our carefully selected products.
              </Text>
            </Box>
            <Stack direction={'row'} spacing={6}>
              <HStack
                as={'a'}
                href={`https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent('Hi! I\'m interested in your dry fruits products.')}`}
                target="_blank"
                rel="noopener noreferrer"
                cursor="pointer"
                _hover={{ color: linkColor }}
              >
                <Icon as={MessageCircle} />
                <Text fontSize={'sm'}>WhatsApp</Text>
              </HStack>
            </Stack>
          </Stack>
          <Stack align={'flex-start'}>
            <Text fontWeight={'500'} fontSize={'lg'} mb={2}>
              Quick Links
            </Text>
            <Link as={RouterLink} to={'/'} _hover={{ color: linkColor }}>
              Home
            </Link>
            <Link as={RouterLink} to={'/products'} _hover={{ color: linkColor }}>
              Products
            </Link>
            <Link as={RouterLink} to={'/cart'} _hover={{ color: linkColor }}>
              Cart
            </Link>
            <Link as={RouterLink} to={'/orders'} _hover={{ color: linkColor }}>
              My Orders
            </Link>
          </Stack>
          <Stack align={'flex-start'}>
            <Text fontWeight={'500'} fontSize={'lg'} mb={2}>
              Policies
            </Text>
            <Link as={RouterLink} to={'/policies'} _hover={{ color: linkColor }}>
              Return Policy
            </Link>
            <Link as={RouterLink} to={'/policies'} _hover={{ color: linkColor }}>
              Exchange Policy
            </Link>
            <Link as={RouterLink} to={'/policies'} _hover={{ color: linkColor }}>
              Shipping Policy
            </Link>
            <Link as={RouterLink} to={'/policies'} _hover={{ color: linkColor }}>
              Privacy Policy
            </Link>
          </Stack>
          <Stack align={'flex-start'}>
            <Text fontWeight={'500'} fontSize={'lg'} mb={2}>
              Contact Us
            </Text>
            <HStack>
              <Icon as={Phone} />
              <Text fontSize={'sm'}>{contactPhone}</Text>
            </HStack>
            <HStack>
              <Icon as={Mail} />
              <Link href={`mailto:${contactEmail}`} fontSize={'sm'} _hover={{ color: linkColor }}>
                {contactEmail}
              </Link>
            </HStack>
            <HStack align={'start'}>
              <Icon as={MapPin} mt={1} />
              <Text fontSize={'sm'}>
                Amalapuram, Andhra Pradesh.
                <br />
                India
              </Text>
            </HStack>
          </Stack>
        </SimpleGrid>
      </Container>
      <Divider />
      <Container maxW={'6xl'} py={4}>
        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={4}
          justify={{ base: 'center', md: 'space-between' }}
          align={{ base: 'center', md: 'center' }}
        >
          <Text fontSize={'sm'}>
            © {new Date().getFullYear()} Herambha Dryfruits. All rights reserved.
          </Text>
          <Stack direction={'row'} spacing={6}>
            <Text fontSize={'sm'}>Made with ❤️ for healthy living</Text>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;