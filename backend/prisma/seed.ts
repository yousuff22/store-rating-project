import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const existingAdmin = await prisma.user.findFirst({ where: { role: Role.ADMIN } });
  if (existingAdmin) {
    console.log('Admin user already exists, skipping seed.');
    return;
  }

  const hashedPassword = await bcrypt.hash('Admin@123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'System Administrator Account',
      email: 'admin@storerating.com',
      password: hashedPassword,
      address: 'System Admin Address, Platform HQ',
      role: Role.ADMIN,
    },
  });

  console.log(`Admin user created: ${admin.email}`);
  console.log('Default credentials: admin@storerating.com / Admin@123');
  console.log('IMPORTANT: Change this password after first login!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
