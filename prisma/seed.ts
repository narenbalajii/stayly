import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Create Admin
  const admin = await prisma.user.upsert({
    where: { email: 'demo.admin@stayly.demo' },
    update: {},
    create: {
      email: 'demo.admin@stayly.demo',
      name: 'Stayly Admin',
      passwordHash,
      role: 'ADMIN',
    },
  });

  // 2. Create Hosts
  const hosts = [];
  for (let i = 1; i <= 3; i++) {
    const host = await prisma.user.upsert({
      where: { email: `demo.host${i}@stayly.demo` },
      update: {},
      create: {
        email: `demo.host${i}@stayly.demo`,
        name: `Demo Host ${i}`,
        passwordHash,
        role: 'HOST',
      },
    });
    hosts.push(host);
  }

  // 3. Create Guests
  const guests = [];
  for (let i = 1; i <= 8; i++) {
    const guest = await prisma.user.upsert({
      where: { email: `demo.guest${i}@stayly.demo` },
      update: {},
      create: {
        email: `demo.guest${i}@stayly.demo`,
        name: `Demo Guest ${i}`,
        passwordHash,
        role: 'GUEST',
      },
    });
    guests.push(guest);
  }

  // 4. Create Properties
  const propertiesData = [
    { title: 'Ocean Pearl Villa', location: 'Goa', price: 250, type: 'Villa', guests: 6, amenities: ['WiFi', 'Pool', 'Beachfront', 'Air Conditioning'] },
    { title: 'Urban Nest Bengaluru', location: 'Bengaluru', price: 80, type: 'Apartment', guests: 2, amenities: ['WiFi', 'Gym', 'Workspace'] },
    { title: 'The Jaipur Courtyard', location: 'Jaipur', price: 150, type: 'Heritage', guests: 4, amenities: ['WiFi', 'Breakfast', 'Air Conditioning'] },
    { title: 'Himalayan View Lodge', location: 'Manali', price: 120, type: 'Mountain stay', guests: 4, amenities: ['Heating', 'Mountain View', 'Kitchen'] },
    { title: 'Coastal Haven', location: 'Kochi', price: 100, type: 'Beach stay', guests: 3, amenities: ['WiFi', 'Kitchen', 'Air Conditioning'] },
    { title: 'Heritage House Udaipur', location: 'Udaipur', price: 180, type: 'Luxury stay', guests: 4, amenities: ['WiFi', 'Pool', 'Lake View'] },
    { title: 'Delhi Central Apartment', location: 'Delhi', price: 90, type: 'Apartment', guests: 3, amenities: ['WiFi', 'Kitchen', 'Air Conditioning'] },
    { title: 'Mumbai Sea Link View', location: 'Mumbai', price: 140, type: 'Apartment', guests: 2, amenities: ['WiFi', 'Ocean View', 'Air Conditioning'] },
    { title: 'Pondicherry French Villa', location: 'Pondicherry', price: 160, type: 'Villa', guests: 5, amenities: ['WiFi', 'Pool', 'Bicycles'] },
    { title: 'Hyderabad Tech Suite', location: 'Hyderabad', price: 70, type: 'Apartment', guests: 2, amenities: ['WiFi', 'Workspace', 'Gym'] },
    { title: 'Goa Party Pad', location: 'Goa', price: 300, type: 'Villa', guests: 8, amenities: ['WiFi', 'Pool', 'BBQ grill'] },
    { title: 'Quiet Coorg Estate', location: 'Bengaluru', price: 200, type: 'Boutique stay', guests: 4, amenities: ['WiFi', 'Breakfast', 'Garden'] },
    { title: 'Manali Snow Cabin', location: 'Manali', price: 150, type: 'Cabin', guests: 4, amenities: ['Heating', 'Fireplace', 'Mountain View'] },
    { title: 'Jaipur Royal Tent', location: 'Jaipur', price: 110, type: 'Luxury stay', guests: 2, amenities: ['Air Conditioning', 'Breakfast'] },
    { title: 'Mumbai Cozy Studio', location: 'Mumbai', price: 60, type: 'Budget stay', guests: 2, amenities: ['WiFi', 'Kitchen'] },
  ];

  const imageUrls = [
    'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1de2d96674?w=800&q=80',
    'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=800&q=80',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80'
  ];

  const dbProperties = [];
  for (let i = 0; i < propertiesData.length; i++) {
    const data = propertiesData[i];
    const host = hosts[i % hosts.length];
    
    let property = await prisma.property.findFirst({ where: { title: data.title } });
    
    if (!property) {
      property = await prisma.property.create({
        data: {
          title: data.title,
          location: data.location,
          pricePerNight: data.price,
          type: data.type,
          maxGuests: data.guests,
          amenities: data.amenities,
          description: `Enjoy a wonderful stay at ${data.title} in beautiful ${data.location}. This ${data.type.toLowerCase()} comfortably accommodates up to ${data.guests} guests and features top-tier amenities including ${data.amenities.join(', ')}.`,
          hostId: host.id,
          images: {
            create: [
              { imageUrl: imageUrls[i % imageUrls.length] },
              { imageUrl: imageUrls[(i + 1) % imageUrls.length] }
            ]
          }
        }
      });
    }
    dbProperties.push(property);
  }

  // 5. Create Bookings
  const today = new Date();
  for (let i = 0; i < 20; i++) {
    const property = dbProperties[i % dbProperties.length];
    const guest = guests[i % guests.length];
    
    const checkIn = new Date(today);
    checkIn.setDate(today.getDate() + (i * 3) + 1); 
    
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkIn.getDate() + 2);

    const existing = await prisma.booking.findFirst({
      where: { propertyId: property.id, checkIn }
    });

    if (!existing) {
      await prisma.booking.create({
        data: {
          propertyId: property.id,
          guestId: guest.id,
          checkIn,
          checkOut,
          totalPrice: Number(property.pricePerNight) * 2,
          status: 'CONFIRMED'
        }
      });
    }
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
