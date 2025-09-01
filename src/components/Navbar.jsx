import React from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Badge,
  HStack,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  VStack,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';
import { ShoppingCart, User, LogOut, Heart } from 'lucide-react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';

const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const { user, signOut } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <Box>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={{ base: '50px', md: '60px' }}
        py={{ base: 1, md: 2 }}
        px={{ base: 2, sm: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}
        shadow={'sm'}
      >
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
            size={'sm'}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Text
            as={RouterLink}
            to={'/'}
            textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
            fontFamily={'heading'}
            color={useColorModeValue('primary.500', 'white')}
            fontSize={{ base: 'lg', md: 'xl' }}
            fontWeight={'bold'}
            _hover={{ textDecoration: 'none' }}
          >
            Herambha Dryfruits
          </Text>

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <DesktopNav user={user} />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={{ base: 2, sm: 4, md: 6 }}
        >
          {/* Wishlist Icon */}
          <Button
            as={RouterLink}
            to={'/wishlist'}
            variant={'ghost'}
            size={{ base: 'sm', sm: 'md' }}
            position={'relative'}
            minW={'auto'}
            px={2}
          >
            <Icon as={Heart} w={5} h={5} />
            {wishlist.length > 0 && (
              <Badge
                colorScheme={'red'}
                position={'absolute'}
                top={'-1'}
                right={'-1'}
                fontSize={'2xs'}
                borderRadius={'full'}
                px={1}
                py={0.5}
              >
                {wishlist.length}
              </Badge>
            )}
          </Button>
          
          {/* Cart Icon */}
          <Button
            as={RouterLink}
            to={'/cart'}
            variant={'ghost'}
            size={{ base: 'sm', sm: 'md' }}
            position={'relative'}
            minW={'auto'}
            px={2}
          >
            <Icon as={ShoppingCart} w={5} h={5} />
            {cart.itemCount > 0 && (
              <Badge
                colorScheme={'red'}
                position={'absolute'}
                top={'-1'}
                right={'-1'}
                fontSize={'2xs'}
                borderRadius={'full'}
                px={1}
                py={0.5}
              >
                {cart.itemCount}
              </Badge>
            )}
          </Button>

          {user ? (
            <Menu>
              <MenuButton as={Button} variant={'ghost'} size={{ base: 'sm', sm: 'md' }} minW={'auto'} px={2}>
                <HStack spacing={2}>
                  <Avatar size={{ base: 'xs', sm: 'sm' }} src={user.photoURL} name={user.displayName} />
                  <Text display={{ base: 'none', sm: 'flex' }} fontSize={{ base: 'sm', sm: 'md' }}>
                    {user.displayName || 'User'}
                  </Text>
                </HStack>
              </MenuButton>
              <MenuList>
                <MenuItem as={RouterLink} to={'/account'}>
                  Account
                </MenuItem>
                <MenuItem as={RouterLink} to={'/settings'}>
                  Settings
                </MenuItem>
                <MenuItem as={RouterLink} to={'/orders'}>
                  My Orders
                </MenuItem>
                {user.isAdmin && (
                  <>
                    <MenuDivider />
                    <MenuItem as={RouterLink} to={'/admin'}>
                      Admin Dashboard
                    </MenuItem>
                    <MenuItem as={RouterLink} to={'/admin/products'}>
                      Manage Products
                    </MenuItem>
                    <MenuItem as={RouterLink} to={'/admin/orders'}>
                      Manage Orders
                    </MenuItem>
                  </>
                )}
                <MenuDivider />
                <MenuItem onClick={handleSignOut}>
                  <Icon as={LogOut} mr={2} />
                  Sign Out
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Button
              as={RouterLink}
              to={'/login'}
              fontSize={{ base: 'sm', sm: 'md' }}
              fontWeight={400}
              variant={'link'}
              color={'primary.500'}
              minW={'auto'}
              px={2}
            >
              Sign In
            </Button>
          )}
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav user={user} />
      </Collapse>
    </Box>
  );
};

const DesktopNav = ({ user }) => {
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('primary.500', 'white');
  const popoverContentBgColor = useColorModeValue('white', 'gray.800');

  // Add admin navigation items if user is admin
  const navItems = [...NAV_ITEMS];
  if (user && user.isAdmin) {
    navItems.push({
      label: 'Admin',
      href: '/admin',
      children: [
        {
          label: 'Dashboard',
          subLabel: 'Admin dashboard overview',
          href: '/admin',
        },
        {
          label: 'Products',
          subLabel: 'Manage products',
          href: '/admin/products',
        },
        {
          label: 'Orders',
          subLabel: 'Manage orders',
          href: '/admin/orders',
        },
      ],
    });
  }

  return (
    <Stack direction={'row'} spacing={{ base: 2, md: 4, lg: 6 }}>
      {navItems.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <Link
                as={RouterLink}
                to={navItem.href ?? '#'}
                p={{ base: 1, md: 2 }}
                fontSize={{ base: 'sm', sm: 'md' }}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: 'none',
                  color: linkHoverColor,
                }}
              >
                {navItem.label}
              </Link>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={'xl'}
                bg={popoverContentBgColor}
                p={4}
                rounded={'xl'}
                minW={{ base: 'sm', md: 'md' }}
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }) => {
  return (
    <Link
      as={RouterLink}
      to={href}
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      _hover={{ bg: useColorModeValue('primary.50', 'gray.900') }}
    >
      <Stack direction={'row'} align={'center'}>
        <Box>
          <Text
            transition={'all .3s ease'}
            _groupHover={{ color: 'primary.400' }}
            fontWeight={500}
            fontSize={{ base: 'sm', sm: 'md' }}
          >
            {label}
          </Text>
          <Text fontSize={'xs'} display={{ base: 'none', sm: 'block' }}>{subLabel}</Text>
        </Box>
        <Flex
          transition={'all .3s ease'}
          transform={'translateX(-10px)'}
          opacity={0}
          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify={'flex-end'}
          align={'center'}
          flex={1}
        >
          <Icon color={'primary.400'} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

const MobileNav = ({ user }) => {
  // Add admin navigation items if user is admin
  const navItems = [...NAV_ITEMS];
  if (user && user.isAdmin) {
    navItems.push({
      label: 'Admin',
      href: '/admin',
      children: [
        {
          label: 'Dashboard',
          href: '/admin',
        },
        {
          label: 'Products',
          href: '/admin/products',
        },
        {
          label: 'Orders',
          href: '/admin/orders',
        },
      ],
    });
  }

  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={{ base: 2, sm: 4 }}
      display={{ md: 'none' }}
    >
      {navItems.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={2} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? '#'}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue('gray.600', 'gray.200')}
          fontSize={{ base: 'sm', sm: 'md' }}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={5}
            h={5}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={1}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}
        >
          {children &&
            children.map((child) => (
              <Link
                as={RouterLink}
                key={child.label}
                py={2}
                to={child.href}
                fontSize={{ base: 'sm', sm: 'md' }}
              >
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

const NAV_ITEMS = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Products',
    href: '/products',
    children: [
      {
        label: 'All Products',
        subLabel: 'Browse our complete collection',
        href: '/products',
      },
      {
        label: 'Nuts',
        subLabel: 'Premium quality nuts',
        href: '/products?category=Nuts',
      },
      {
        label: 'Dried Fruits',
        subLabel: 'Natural dried fruits',
        href: '/products?category=Dried%20Fruits',
      },
    ],
  },
  {
    label: 'Wishlist',
    href: '/wishlist',
  },
  {
    label: 'Policies',
    href: '/policies',
  },
];

export default Navbar;