import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      password: passwordHash,
      role: 'ADMIN',
    },
  });

  const [locA, locB] = await Promise.all([
    prisma.location.upsert({
      where: { code: 'A-01' },
      update: {},
      create: { code: 'A-01', name: 'Rack A-01', type: 'STORAGE' },
    }),
    prisma.location.upsert({
      where: { code: 'RECV' },
      update: {},
      create: { code: 'RECV', name: 'Receiving Dock', type: 'RECEIVING' },
    }),
  ]);

  const [item1, item2] = await Promise.all([
    prisma.item.upsert({
      where: { sku: 'SKU-001' },
      update: {},
      create: { sku: 'SKU-001', name: 'Item 1', uom: 'PCS' },
    }),
    prisma.item.upsert({
      where: { sku: 'SKU-002' },
      update: {},
      create: { sku: 'SKU-002', name: 'Item 2', uom: 'PCS' },
    }),
  ]);

  await Promise.all([
    prisma.inventory.upsert({
      where: { itemId_locationId: { itemId: item1.id, locationId: locA.id } },
      update: { quantity: 100 },
      create: { itemId: item1.id, locationId: locA.id, quantity: 100 },
    }),
    prisma.inventory.upsert({
      where: { itemId_locationId: { itemId: item2.id, locationId: locA.id } },
      update: { quantity: 50 },
      create: { itemId: item2.id, locationId: locA.id, quantity: 50 },
    }),
  ]);

  console.log('Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
