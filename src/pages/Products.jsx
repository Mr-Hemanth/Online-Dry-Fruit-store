import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, 
  Container, 
  Heading, 
  SimpleGrid, 
  Spinner, 
  Text,
  Stack,
  InputGroup,
  InputLeftElement,
  Input,
  Select,
  Badge,
  HStack,
  Center,
  Button,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Checkbox,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Divider,
  IconButton
} from '@chakra-ui/react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, Filter } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import { mongoProductService as productService } from '../services/mongoProductService';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'name');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'asc');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(searchParams.get('featured') === 'true');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Get price range
  const priceRange = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 1000 };
    const prices = products.map(p => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }, [products]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesData = await productService.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      // Prepare filters object
      const filters = {};
      if (selectedCategory) filters.category = selectedCategory;
      if (searchTerm) filters.search = searchTerm;
      if (sortBy) filters.sortBy = sortBy;
      if (sortOrder) filters.sortOrder = sortOrder;
      if (minPrice) filters.minPrice = minPrice;
      if (maxPrice) filters.maxPrice = maxPrice;
      if (showFeaturedOnly) filters.featured = true;
      
      try {
        const productsData = await productService.getAllProducts(filters);
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchTerm, sortBy, sortOrder, minPrice, maxPrice, showFeaturedOnly]);

  useEffect(() => {
    // Update URL params
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (selectedCategory) params.category = selectedCategory;
    if (sortBy) params.sortBy = sortBy;
    if (sortOrder) params.sortOrder = sortOrder;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (showFeaturedOnly) params.featured = 'true';
    
    setSearchParams(params);
  }, [searchTerm, selectedCategory, sortBy, sortOrder, minPrice, maxPrice, showFeaturedOnly, setSearchParams]);

  useEffect(() => {
    let filtered = [...products];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by price range
    if (minPrice) {
      filtered = filtered.filter(product => product.price >= Number(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(product => product.price <= Number(maxPrice));
    }

    // Filter by featured
    if (showFeaturedOnly) {
      filtered = filtered.filter(product => product.featured);
    }

    // Sort products
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(a.createdAt) - new Date(b.createdAt);
          break;
        case 'featured':
          // Featured items first, then by name
          comparison = (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
          if (comparison === 0) comparison = a.name.localeCompare(b.name);
          break;
        default:
          comparison = a.name.localeCompare(b.name);
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, sortBy, sortOrder, minPrice, maxPrice, showFeaturedOnly]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setShowFeaturedOnly(false);
  };

  const activeFiltersCount = [
    searchTerm,
    selectedCategory,
    minPrice,
    maxPrice,
    showFeaturedOnly
  ].filter(Boolean).length;

  if (loading) {
    return (
      <Center minH={'50vh'}>
        <Spinner size={'xl'} color={'primary.500'} />
      </Center>
    );
  }

  return (
    <Box py={8}>
      <Container maxW={'7xl'}>
        <Stack spacing={8}>
          <Heading
            fontSize={{ base: '2xl', sm: '4xl' }}
            fontWeight={'bold'}
            textAlign={'center'}
          >
            Our Products
          </Heading>

          {/* Search and Main Filters */}
          <Stack
            direction={{ base: 'column', md: 'row' }}
            spacing={4}
            align={{ base: 'stretch', md: 'center' }}
          >
            <InputGroup flex={1}>
              <InputLeftElement pointerEvents={'none'}>
                <Search color={'gray.300'} size={20} />
              </InputLeftElement>
              <Input
                placeholder={'Search products...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
            
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              handleCategoryChange={handleCategoryChange}
            />

            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              maxW={{ base: 'full', md: '200px' }}
            >
              <option value={'name'}>Sort by Name</option>
              <option value={'price'}>Sort by Price</option>
              <option value={'date'}>Sort by Date</option>
              <option value={'featured'}>Featured First</option>
            </Select>
            
            <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              maxW={{ base: 'full', md: '150px' }}
            >
              <option value={'asc'}>Ascending</option>
              <option value={'desc'}>Descending</option>
            </Select>
            
            <IconButton
              icon={<Filter size={20} />}
              onClick={() => setShowFilters(!showFilters)}
              colorScheme={activeFiltersCount > 0 ? 'primary' : 'gray'}
              aria-label="Toggle filters"
            />
          </Stack>

          {/* Advanced Filters */}
          {showFilters && (
            <Accordion defaultIndex={[0]} allowMultiple>
              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    Advanced Filters
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <Stack spacing={6}>
                    {/* Price Range Filter */}
                    <Box>
                      <Text fontWeight="bold" mb={2}>Price Range</Text>
                      <Stack spacing={4}>
                        <Slider
                          aria-label="min-price"
                          min={priceRange.min}
                          max={priceRange.max}
                          value={minPrice ? Number(minPrice) : priceRange.min}
                          onChange={(val) => setMinPrice(val.toString())}
                        >
                          <SliderMark
                            value={minPrice ? Number(minPrice) : priceRange.min}
                            textAlign="center"
                            bg="primary.500"
                            color="white"
                            mt="2"
                            ml="-5"
                            w="12"
                            borderRadius="md"
                          >
                            ₹{minPrice || priceRange.min}
                          </SliderMark>
                          <SliderTrack>
                            <SliderFilledTrack bg="primary.500" />
                          </SliderTrack>
                          <SliderThumb />
                        </Slider>
                        
                        <Slider
                          aria-label="max-price"
                          min={priceRange.min}
                          max={priceRange.max}
                          value={maxPrice ? Number(maxPrice) : priceRange.max}
                          onChange={(val) => setMaxPrice(val.toString())}
                        >
                          <SliderMark
                            value={maxPrice ? Number(maxPrice) : priceRange.max}
                            textAlign="center"
                            bg="primary.500"
                            color="white"
                            mt="2"
                            ml="-5"
                            w="12"
                            borderRadius="md"
                          >
                            ₹{maxPrice || priceRange.max}
                          </SliderMark>
                          <SliderTrack>
                            <SliderFilledTrack bg="primary.500" />
                          </SliderTrack>
                          <SliderThumb />
                        </Slider>
                        
                        <HStack>
                          <Input
                            placeholder="Min Price"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            type="number"
                          />
                          <Text>to</Text>
                          <Input
                            placeholder="Max Price"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            type="number"
                          />
                        </HStack>
                      </Stack>
                    </Box>
                    
                    <Divider />
                    
                    {/* Featured Products Filter */}
                    <Checkbox
                      isChecked={showFeaturedOnly}
                      onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                    >
                      Show Featured Products Only
                    </Checkbox>
                  </Stack>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          )}

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <HStack spacing={2} flexWrap={'wrap'}>
              <Text fontSize={'sm'} color={'gray.600'}>Active filters:</Text>
              {searchTerm && (
                <Badge
                  colorScheme={'primary'}
                  cursor={'pointer'}
                  onClick={() => setSearchTerm('')}
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  "{searchTerm}" <X size={12} />
                </Badge>
              )}
              {selectedCategory && (
                <Badge
                  colorScheme={'primary'}
                  cursor={'pointer'}
                  onClick={() => setSelectedCategory('')}
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  {selectedCategory} <X size={12} />
                </Badge>
              )}
              {minPrice && (
                <Badge
                  colorScheme={'primary'}
                  cursor={'pointer'}
                  onClick={() => setMinPrice('')}
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  Min: ₹{minPrice} <X size={12} />
                </Badge>
              )}
              {maxPrice && (
                <Badge
                  colorScheme={'primary'}
                  cursor={'pointer'}
                  onClick={() => setMaxPrice('')}
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  Max: ₹{maxPrice} <X size={12} />
                </Badge>
              )}
              {showFeaturedOnly && (
                <Badge
                  colorScheme={'primary'}
                  cursor={'pointer'}
                  onClick={() => setShowFeaturedOnly(false)}
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  Featured Only <X size={12} />
                </Badge>
              )}
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={clearAllFilters}
                colorScheme="red"
              >
                Clear All
              </Button>
            </HStack>
          )}

          {/* Results */}
          <Text color={'gray.600'}>
            Showing {filteredProducts.length} of {products.length} products
          </Text>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={8}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </SimpleGrid>
          ) : (
            <Center py={16}>
              <Stack align={'center'} spacing={4}>
                <Text fontSize={'xl'} color={'gray.500'}>
                  No products found
                </Text>
                <Text color={'gray.400'}>
                  Try adjusting your search criteria or browse all products.
                </Text>
                <Button onClick={clearAllFilters} colorScheme="primary">
                  Clear All Filters
                </Button>
              </Stack>
            </Center>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default Products;