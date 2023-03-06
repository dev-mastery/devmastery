import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const defaultNewsletter = {
  id: "DEVMASTERY_DEFAULT",
  name: "The Dev Mastery Newsletter",
  description: "The Dev Mastery Newsletter",
};

async function seedDatabase() {
  console.log("Seeding database...");

  try {
    await createDefaultNewsletter();
    console.log("Database seeding completed successfully.");
  } catch (error) {
    console.error("Error while seeding the database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

async function createDefaultNewsletter() {
  console.log("Creating default newsletter...");

  const existingNewsletter = await prisma.newsletter.findFirst({
    where: defaultNewsletter,
  });

  if (existingNewsletter) {
    console.log("Default newsletter already exists.");
    return;
  }

  const createdNewsletter = await prisma.newsletter.upsert({
    where: {
      id: defaultNewsletter.id,
    },
    update: defaultNewsletter,
    create: defaultNewsletter,
  });

  console.log("Default newsletter created:", createdNewsletter);
}

seedDatabase();
