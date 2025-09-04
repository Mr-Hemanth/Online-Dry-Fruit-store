import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Button,
  Input,
  Select,
  Textarea,
  FormControl,
  FormLabel,
  Switch,
  Badge,
  Image,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Divider,
  IconButton,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Plus } from 'lucide-react';
import { formatCurrency } from '../utils/constants';
import { mongoProductService as productService } from '../services/mongoProductService';

const AdminProducts = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    weight: '',
    stock: '',
    category: '',
    featured: false,
    imageUrl: ''
  });

  // Fetch products from MongoDB
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await productService.getAllProducts();
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: 'Error fetching products',
          description: 'Could not load products. Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Product name must be at least 2 characters long';
    }
    
    // Description validation
    if (!formData.description || formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
    }
    
    // Price validation
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      newErrors.price = 'Please enter a valid price greater than 0';
    }
    
    // Weight validation
    if (!formData.weight || formData.weight.trim().length < 2) {
      newErrors.weight = 'Please enter a valid weight (e.g., 100g, 250g)';
    }
    
    // Stock validation
    const stock = parseInt(formData.stock);
    if (isNaN(stock) || stock < 0) {
      newErrors.stock = 'Please enter a valid stock quantity (0 or more)';
    }
    
    // Category validation
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    
    // Image URL validation
    if (!formData.imageUrl || !isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'Please enter a valid image URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper function to validate URL
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      weight: '',
      stock: '',
      category: '',
      featured: false,
      imageUrl: ''
    });
    setErrors({}); // Clear errors when opening modal
    onOpen();
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      weight: product.weight,
      stock: product.stock,
      category: product.category,
      featured: product.featured,
      imageUrl: product.imageUrl
    });
    setErrors({}); // Clear errors when opening modal
    onOpen();
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await productService.deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast({
        title: 'Product deleted',
        description: 'The product has been successfully deleted.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error deleting product',
        description: 'Could not delete the product. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = async () => {
    // Validate form before submission
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the validation errors below.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      if (editingProduct) {
        // Update existing product
        const updatedData = {
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock)
        };
        
        const updatedProduct = await productService.updateProduct(editingProduct.id, updatedData);
        
        if (updatedProduct) {
          setProducts(prev => prev.map(p => 
            p.id === editingProduct.id ? updatedProduct : p
          ));
          
          toast({
            title: 'Product updated',
            description: 'The product has been successfully updated.',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          onClose();
        } else {
          toast({
            title: 'Error updating product',
            description: 'Could not update the product. Please try again.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      } else {
        // Create new product
        // Generate a unique ID for the new product
        const newProductId = `product-${Date.now()}`;
        
        const newProductData = {
          id: newProductId, // Add the required ID field
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock)
        };
        
        const newProduct = await productService.createProduct(newProductData);
        
        if (newProduct) {
          setProducts(prev => [...prev, newProduct]);
          
          toast({
            title: 'Product created',
            description: 'The new product has been successfully created.',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          onClose();
        } else {
          toast({
            title: 'Error creating product',
            description: 'Could not create the product. Please try again.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: 'Error saving product',
        description: error.message || 'Could not save the product. Please try again.',
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
            <Heading>Product Management</Heading>
            <Button 
              leftIcon={<Plus size={16} />} 
              colorScheme="primary"
              onClick={handleCreateProduct}
            >
              Add New Product
            </Button>
          </HStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
            {products.map(product => (
              <Box 
                key={product.id} 
                borderWidth={1} 
                borderRadius={'lg'} 
                overflow={'hidden'}
                bg={'white'}
                boxShadow={'sm'}
              >
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  h={'200px'}
                  w={'100%'}
                  objectFit={'cover'}
                  fallbackSrc={'https://placehold.co/300x200?text=Product+Image&font=montserrat'}
                />
                <VStack p={4} align={'stretch'} spacing={3}>
                  <HStack justify={'space-between'}>
                    <Text fontWeight={'bold'} noOfLines={1}>{product.name}</Text>
                    <HStack spacing={1}>
                      <Badge colorScheme="blue" fontSize="xs">
                        {product.weight}
                      </Badge>
                    </HStack>
                  </HStack>
                  <Text fontSize={'sm'} color={'gray.500'}>{product.category}</Text>
                  <Text fontWeight={'medium'}>{formatCurrency(product.price)}</Text>
                  <HStack justify="space-between">
                    <Text fontSize={'sm'}>
                      Stock: <Text as="span" color={product.stock > 0 ? 'green.500' : 'red.500'}>
                        {product.stock}
                      </Text>
                    </Text>
                    {product.stock > 0 && product.stock < 10 && (
                      <Badge colorScheme="orange" fontSize="xs">
                        Low
                      </Badge>
                    )}
                  </HStack>
                  <HStack spacing={2}>
                    <IconButton
                      size={'sm'}
                      icon={<Edit size={16} />}
                      onClick={() => handleEditProduct(product)}
                      aria-label="Edit product"
                    />
                    <IconButton
                      size={'sm'}
                      icon={<Trash2 size={16} />}
                      colorScheme="red"
                      variant="outline"
                      onClick={() => handleDeleteProduct(product.id)}
                      aria-label="Delete product"
                    />
                  </HStack>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>

      {/* Product Form Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align={'stretch'}>
              <HStack spacing={4}>
                <FormControl isRequired isInvalid={!!errors.name}>
                  <FormLabel>Product Name</FormLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                  />
                  {errors.name && (
                    <Text color="red.500" fontSize="sm" mt={1}>{errors.name}</Text>
                  )}
                </FormControl>
                <FormControl isRequired isInvalid={!!errors.category}>
                  <FormLabel>Category</FormLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="">Select category</option>
                    <option value="Nuts">Nuts</option>
                    <option value="Dried Fruits">Dried Fruits</option>
                    <option value="Seeds">Seeds</option>
                    <option value="Gift Packs">Gift Packs</option>
                  </Select>
                  {errors.category && (
                    <Text color="red.500" fontSize="sm" mt={1}>{errors.category}</Text>
                  )}
                </FormControl>
              </HStack>

              <FormControl isRequired isInvalid={!!errors.description}>
                <FormLabel>Description</FormLabel>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                  rows={3}
                />
                {errors.description && (
                  <Text color="red.500" fontSize="sm" mt={1}>{errors.description}</Text>
                )}
              </FormControl>

              <HStack spacing={4}>
                <FormControl isRequired isInvalid={!!errors.price}>
                  <FormLabel>Price (₹)</FormLabel>
                  <Input
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Enter price"
                  />
                  {errors.price && (
                    <Text color="red.500" fontSize="sm" mt={1}>{errors.price}</Text>
                  )}
                </FormControl>
                <FormControl isRequired isInvalid={!!errors.weight}>
                  <FormLabel>Quantity/Weight</FormLabel>
                  <Input
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="e.g., 250g, 500g, 1kg"
                  />
                  {errors.weight && (
                    <Text color="red.500" fontSize="sm" mt={1}>{errors.weight}</Text>
                  )}
                </FormControl>
                <FormControl isRequired isInvalid={!!errors.stock}>
                  <FormLabel>Stock Quantity</FormLabel>
                  <Input
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="Enter stock quantity"
                  />
                  {errors.stock && (
                    <Text color="red.500" fontSize="sm" mt={1}>{errors.stock}</Text>
                  )}
                </FormControl>
              </HStack>

              <HStack spacing={4}>
                <FormControl isInvalid={!!errors.imageUrl}>
                  <FormLabel>Image URL</FormLabel>
                  <Input
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    placeholder="Enter image URL"
                  />
                  {errors.imageUrl && (
                    <Text color="red.500" fontSize="sm" mt={1}>{errors.imageUrl}</Text>
                  )}
                </FormControl>
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">Premium Quality</FormLabel>
                  <Switch
                    name="featured"
                    isChecked={formData.featured}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </HStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="primary" 
              onClick={handleSubmit}
            >
              {editingProduct ? 'Update Product' : 'Create Product'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AdminProducts;