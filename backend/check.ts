import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function run() {
    const vehicle = await prisma.vehicle.findFirst();
    console.log(vehicle);
}
run().finally(() => prisma.$disconnect());
