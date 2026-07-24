import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_INITIAL_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'ADMIN_EMAIL and ADMIN_INITIAL_PASSWORD are required for seeding',
    );
  }

  if (password.length < 12) {
    throw new Error(
      'ADMIN_INITIAL_PASSWORD must contain at least 12 characters',
    );
  }

  const passwordHash = await hash(password, 12);
  await prisma.admin.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash },
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
