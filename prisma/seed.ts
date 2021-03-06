const faker = require('faker');
import { hash } from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);
  for (let i = 0; i < Math.floor(Math.random() * 100) + 50; i++) {
    const userTypes = ['RETAILER', 'WHOLESALER'];
    const randomArrayIndex = getRandomNumberBetween(userTypes.length);
    const user = await prisma.user.create({
      data: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: await hash('password', 10),
        confirmed: faker.datatype.boolean(),
        // @ts-ignore
        type: userTypes[randomArrayIndex],
      },
    });
    console.log(`Created user with id: ${user.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

function getRandomNumberBetween(max: number): number {
  return Math.floor(Math.random() * max);
}
