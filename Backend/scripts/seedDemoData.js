require('dotenv').config();

const db = require('../Confiq/db');
const Category = require('../Models/CategoryModel');
const Vendor = require('../Models/VendorModel');
const Product = require('../Models/ProductModel');

const restaurants = [
  {
    ownerName: 'Demo Owner',
    restaurantName: 'Paradise Biryani',
    email: 'paradise@example.com',
    mobile: '9000000001',
    password: 'demo123',
    cuisine: 'Biryani,Hyderabadi,North Indian',
    address: 'Banjara Hills, Hyderabad',
    city: 'Hyderabad',
    products: [
      { name: 'Chicken Biryani', description: 'Aromatic basmati rice with tender chicken and spices', price: 320, category: 'Biryani', isVeg: false, isBestseller: true },
      { name: 'Mutton Biryani', description: 'Fragrant basmati rice with slow-cooked mutton', price: 380, category: 'Biryani', isVeg: false, isBestseller: true },
      { name: 'Veg Biryani', description: 'Vegetables cooked with aromatic basmati rice', price: 220, category: 'Biryani', isVeg: true, isBestseller: false },
      { name: 'Chicken Lunch Thali', description: 'Biryani, curry, salad and dessert lunch combo', price: 350, category: 'Lunch', isVeg: false, isBestseller: false },
    ],
  },
  {
    ownerName: 'Demo Owner',
    restaurantName: 'Pizza Hut',
    email: 'pizzahut@example.com',
    mobile: '9000000002',
    password: 'demo123',
    cuisine: 'Pizza,Italian,Fast Food',
    address: 'Hitech City, Hyderabad',
    city: 'Hyderabad',
    products: [
      { name: 'Margherita Pizza', description: 'Classic mozzarella pizza with tomato sauce', price: 299, category: 'Pizza', isVeg: true, isBestseller: true },
      { name: 'Pepperoni Pizza', description: 'Pizza with pepperoni and mozzarella', price: 399, category: 'Pizza', isVeg: false, isBestseller: true },
      { name: 'Garlic Bread', description: 'Toasted bread with garlic butter and herbs', price: 149, category: 'Sides', isVeg: true, isBestseller: false },
      { name: 'Loaded Fries', description: 'Crispy fries topped with cheese and herbs', price: 159, category: 'Fast Food', isVeg: true, isBestseller: false },
    ],
  },
  {
    ownerName: 'Demo Owner',
    restaurantName: 'Burger King',
    email: 'burgerking@example.com',
    mobile: '9000000003',
    password: 'demo123',
    cuisine: 'Burgers,American,Fast Food',
    address: 'Kukatpally, Hyderabad',
    city: 'Hyderabad',
    products: [
      { name: 'Veg Whopper', description: 'Crispy veggie patty with fresh vegetables', price: 169, category: 'Burgers', isVeg: true, isBestseller: true },
    ],
  },
  {
    ownerName: 'Demo Owner',
    restaurantName: 'Chinese Wok',
    email: 'chinesewok@example.com',
    mobile: '9000000004',
    password: 'demo123',
    cuisine: 'Chinese,Asian,Noodles',
    address: 'Gachibowli, Hyderabad',
    city: 'Hyderabad',
    products: [
      { name: 'Hakka Noodles', description: 'Stir-fried noodles with vegetables', price: 180, category: 'Chinese', isVeg: true, isBestseller: true },
    ],
  },
  {
    ownerName: 'Demo Owner',
    restaurantName: "Haldiram's",
    email: 'haldirams@example.com',
    mobile: '9000000005',
    password: 'demo123',
    cuisine: 'North Indian,Mithai,Snacks',
    address: 'Secunderabad, Hyderabad',
    city: 'Hyderabad',
    products: [
      { name: 'Chole Bhature', description: 'Spiced chickpeas served with fluffy fried bread', price: 180, category: 'North Indian', isVeg: true, isBestseller: true },
      { name: 'North Indian Dinner Thali', description: 'A complete dinner with dal, paneer, roti and rice', price: 260, category: 'Dinner', isVeg: true, isBestseller: false },
    ],
  },
  {
    ownerName: 'Demo Owner',
    restaurantName: 'Udupi Kitchen',
    email: 'udupi@example.com',
    mobile: '9000000006',
    password: 'demo123',
    cuisine: 'South Indian,Vegetarian,Breakfast',
    address: 'Madhapur, Hyderabad',
    city: 'Hyderabad',
    products: [
      { name: 'Masala Dosa', description: 'Crisp dosa filled with spiced potato masala', price: 120, category: 'South Indian', isVeg: true, isBestseller: true },
    ],
  },
  {
    ownerName: 'Demo Owner',
    restaurantName: 'Sweet Truth',
    email: 'sweettruth@example.com',
    mobile: '9000000007',
    password: 'demo123',
    cuisine: 'Desserts,Bakery,Sweets',
    address: 'Jubilee Hills, Hyderabad',
    city: 'Hyderabad',
    products: [
      { name: 'Chocolate Brownie', description: 'Rich chocolate brownie served warm', price: 110, category: 'Desserts', isVeg: true, isBestseller: true },
    ],
  },
  {
    ownerName: 'Demo Owner',
    restaurantName: 'Chai Point',
    email: 'chaipoint@example.com',
    mobile: '9000000008',
    password: 'demo123',
    cuisine: 'Beverages,Snacks,Cafe',
    address: 'Banjara Hills, Hyderabad',
    city: 'Hyderabad',
    products: [
      { name: 'Masala Chai', description: 'Traditional Indian spiced tea', price: 45, category: 'Beverages', isVeg: true, isBestseller: true },
    ],
  },
];

async function seedDemoData() {
  await db.sync();

  for (const restaurant of restaurants) {
    const { products, ...vendorDetails } = restaurant;
    const [vendor] = await Vendor.findOrCreate({
      where: { mobile: vendorDetails.mobile },
      defaults: { ...vendorDetails, active: true },
    });

    for (const productDetails of products) {
      const { category: categoryName, ...product } = productDetails;
      const [category] = await Category.findOrCreate({
        where: { name: categoryName },
        defaults: { name: categoryName, active: true },
      });

      await Product.findOrCreate({
        where: { vendorId: vendor.id, name: productDetails.name },
        defaults: {
          ...product,
          categoryId: category.id,
          vendorId: vendor.id,
          active: true,
          stock: 100,
        },
      });
    }
  }

  console.log('Demo restaurants and products are ready.');
}

seedDemoData()
  .catch((error) => {
    console.error('Unable to seed demo data:', error);
    process.exitCode = 1;
  })
  .finally(() => db.close());
