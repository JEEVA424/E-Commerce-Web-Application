// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@store.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@store.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'user@store.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'user@store.com',
      password: userPassword,
      role: 'USER',
    },
  });

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Electronics' },
      update: {},
      create: { name: 'Electronics', description: 'Electronic devices and gadgets' },
    }),
    prisma.category.upsert({
      where: { name: 'Clothing' },
      update: {},
      create: { name: 'Clothing', description: 'Fashion and apparel' },
    }),
    prisma.category.upsert({
      where: { name: 'Books' },
      update: {},
      create: { name: 'Books', description: 'Books and literature' },
    }),
    prisma.category.upsert({
      where: { name: 'Home & Garden' },
      update: {},
      create: { name: 'Home & Garden', description: 'Home improvement and garden' },
    }),
    prisma.category.upsert({
      where: { name: 'Sports' },
      update: {},
      create: { name: 'Sports', description: 'Sports and outdoor equipment' },
    }),
  ]);

  // Create products
  const products = [
    {
      name: 'iPhone 15 Pro',
      description: 'The latest iPhone with A17 Pro chip, titanium design, and 48MP camera system. Features ProMotion display and Action Button.',
      price: 999.99,
      stock: 50,
      brand: 'Apple',
      rating: 4.8,
      numReviews: 245,
      isFeatured: true,
      categoryId: categories[0].id,
      image: '/uploads/placeholder.jpg',
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      description: 'Samsung flagship with 200MP camera, built-in S Pen, and Snapdragon 8 Gen 3 processor for ultimate performance.',
      price: 1199.99,
      stock: 30,
      brand: 'Samsung',
      rating: 4.7,
      numReviews: 189,
      isFeatured: true,
      categoryId: categories[0].id,
      image: '/uploads/placeholder.jpg',
    },
    {
      name: 'MacBook Pro 14"',
      description: 'Apple MacBook Pro with M3 Pro chip, 18GB RAM, 512GB SSD. Perfect for creative professionals.',
      price: 1999.99,
      stock: 20,
      brand: 'Apple',
      rating: 4.9,
      numReviews: 312,
      isFeatured: true,
      categoryId: categories[0].id,
      image: '/uploads/placeholder.jpg',
    },
    {
      name: 'Sony WH-1000XM5',
      description: 'Industry-leading noise canceling headphones with 30-hour battery life and crystal clear hands-free calling.',
      price: 349.99,
      stock: 75,
      brand: 'Sony',
      rating: 4.6,
      numReviews: 423,
      categoryId: categories[0].id,
      image: '/uploads/placeholder.jpg',
    },
    {
      name: 'Nike Air Max 270',
      description: 'Stylish and comfortable sneakers with Max Air cushioning for all-day wear. Available in multiple colors.',
      price: 129.99,
      stock: 100,
      brand: 'Nike',
      rating: 4.5,
      numReviews: 567,
      isFeatured: true,
      categoryId: categories[1].id,
      image: '/uploads/placeholder.jpg',
    },
    {
      name: 'Levi\'s 501 Original Jeans',
      description: 'The original straight-fit jeans. Classic 5-pocket styling in rigid denim that softens to fit your body.',
      price: 59.99,
      stock: 150,
      brand: 'Levi\'s',
      rating: 4.4,
      numReviews: 892,
      categoryId: categories[1].id,
      image: '/uploads/placeholder.jpg',
    },
    {
      name: 'The Clean Coder',
      description: 'A Code of Conduct for Professional Programmers by Robert C. Martin. Essential reading for software developers.',
      price: 34.99,
      stock: 200,
      brand: 'Prentice Hall',
      rating: 4.7,
      numReviews: 1234,
      categoryId: categories[2].id,
      image: '/uploads/placeholder.jpg',
    },
    {
      name: 'Dyson V15 Detect',
      description: 'Cordless vacuum with laser dust detection and intelligent suction power adjustment. Includes multiple attachments.',
      price: 699.99,
      stock: 25,
      brand: 'Dyson',
      rating: 4.8,
      numReviews: 345,
      isFeatured: true,
      categoryId: categories[3].id,
      image: '/uploads/placeholder.jpg',
    },
    {
      name: 'Yoga Mat Pro',
      description: 'Non-slip professional yoga mat with alignment lines, extra thick 6mm cushioning, and carrying strap included.',
      price: 49.99,
      stock: 80,
      brand: 'Manduka',
      rating: 4.6,
      numReviews: 678,
      categoryId: categories[4].id,
      image: '/uploads/placeholder.jpg',
    },
    {
      name: 'Kindle Paperwhite',
      description: 'Waterproof e-reader with 6.8" display, adjustable warm light, and weeks of battery life. Holds thousands of books.',
      price: 139.99,
      stock: 60,
      brand: 'Amazon',
      rating: 4.7,
      numReviews: 2341,
      categoryId: categories[0].id,
      image: '/uploads/placeholder.jpg',
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log('✅ Seed complete!');
  console.log(`👤 Admin: admin@store.com / admin123`);
  console.log(`👤 User:  user@store.com / user123`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
