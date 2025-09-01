import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Stack,
  useColorModeValue,
  Divider,
} from '@chakra-ui/react';

const Policies = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  return (
    <Box py={8}>
      <Container maxW={'4xl'}>
        <VStack spacing={8} align={'stretch'}>
          <Heading textAlign={'center'}>Store Policies</Heading>
          
          <Stack spacing={8}>
            <Box bg={bgColor} p={6} rounded={'lg'} shadow={'sm'}>
              <Heading size={'md'} mb={4} color={'primary.500'}>
                Return Policy
              </Heading>
              <Text color={textColor} lineHeight={1.8}>
                We do not accept returns on any products. All sales are final. We encourage customers to review 
                product details carefully before purchasing. If you have any questions about a product, please 
                contact us before placing your order.
              </Text>
            </Box>
            
            <Divider />
            
            <Box bg={bgColor} p={6} rounded={'lg'} shadow={'sm'}>
              <Heading size={'md'} mb={4} color={'primary.500'}>
                Exchange Policy
              </Heading>
              <Text color={textColor} lineHeight={1.8}>
                We offer exchanges for products that are damaged, expired, or incorrectly shipped.
                Video proof is required for all exchange requests to verify the condition of the product.
                Please contact us within 48 hours of delivery with a video showing the damaged or incorrect items.
                We will arrange for a replacement at no additional cost. Exchanges due to customer preference
                are not accepted.
              </Text>
            </Box>
            
            <Divider />
            
            <Box bg={bgColor} p={6} rounded={'lg'} shadow={'sm'}>
              <Heading size={'md'} mb={4} color={'primary.500'}>
                Shipping Policy
              </Heading>
              <Text color={textColor} lineHeight={1.8}>
                We offer shipping across India. Orders are processed within 1-2 business days.
                Delivery typically takes 3-7 business days depending on your location.
                Free shipping is available on orders above ₹1,000. Express delivery options are available
                for select cities. We use secure packaging to ensure your products arrive fresh and intact.
              </Text>
            </Box>
            
            <Divider />
            
            <Box bg={bgColor} p={6} rounded={'lg'} shadow={'sm'}>
              <Heading size={'md'} mb={4} color={'primary.500'}>
                Privacy Policy
              </Heading>
              <Text color={textColor} lineHeight={1.8}>
                We respect your privacy and are committed to protecting your personal information.
                We collect only necessary information to process your orders and improve our services.
                Your data is securely stored and never shared with third parties without your consent.
                We use industry-standard security measures to protect your information.
              </Text>
            </Box>
            
            <Divider />
            
            <Box bg={bgColor} p={6} rounded={'lg'} shadow={'sm'}>
              <Heading size={'md'} mb={4} color={'primary.500'}>
                Contact Information
              </Heading>
              <Text color={textColor} lineHeight={1.8}>
                For any questions about these policies or your orders, please contact us:
                <br />Email: herambhadryfruits@gmail.com
                <br />Phone: +91 91776 96666
                <br />WhatsApp: +91 91776 96666
                <br />Address: Amalapuram, Andhra Pradesh, India
              </Text>
            </Box>
          </Stack>
        </VStack>
      </Container>
    </Box>
  );
};

export default Policies;