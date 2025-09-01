import React from 'react';
import { 
  Button, 
  Menu, 
  MenuButton, 
  MenuList, 
  MenuItem, 
  Icon,
  HStack,
  Text,
  Badge
} from '@chakra-ui/react';
import { ChevronDown, Tag } from 'lucide-react';

const CategoryFilter = ({ categories, selectedCategory, handleCategoryChange }) => {
  return (
    <Menu>
      <MenuButton 
        as={Button} 
        rightIcon={<ChevronDown size={16} />}
        variant={selectedCategory ? 'solid' : 'outline'}
        colorScheme="primary"
        leftIcon={<Tag size={16} />}
      >
        {selectedCategory || 'All Categories'}
        {selectedCategory && (
          <Badge 
            ml={2} 
            fontSize="0.6em" 
            colorScheme="white" 
            color="primary.500"
            variant="solid"
          >
            1
          </Badge>
        )}
      </MenuButton>
      <MenuList>
        <MenuItem 
          onClick={() => handleCategoryChange('')}
          fontWeight={selectedCategory === '' ? 'bold' : 'normal'}
        >
          <HStack w="100%" justify="space-between">
            <Text>All Categories</Text>
            {!selectedCategory && <Badge colorScheme="primary">Active</Badge>}
          </HStack>
        </MenuItem>
        {categories.map((category) => (
          <MenuItem
            key={category}
            onClick={() => handleCategoryChange(category)}
            fontWeight={selectedCategory === category ? 'bold' : 'normal'}
          >
            <HStack w="100%" justify="space-between">
              <Text>{category}</Text>
              {selectedCategory === category && <Badge colorScheme="primary">Active</Badge>}
            </HStack>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default CategoryFilter;