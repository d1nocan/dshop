import { PrismaClient, Role } from "@prisma/client";
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();
const roles = [Role.Admin, Role.User];
async function main() {
    Array.from({ length: 100 }).forEach(async () => {
        await prisma.user.create({
            data: {
                name: faker.internet.userName(),
                email: faker.internet.email(),
                points: BigInt(faker.random.numeric(4)),
                role: roles[Math.random(Math.random() * roles.length)],
                image: faker.internet.avatar(),
            },
        });
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
