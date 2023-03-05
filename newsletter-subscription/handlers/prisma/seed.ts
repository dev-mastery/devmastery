import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();
const defaultNewsletter = {
  id: "DEVMASTERY_DEFAULT",
  name: "The Dev Mastery Newsletter",
  description: "The Dev Mastery Newsletter",
};

async function main() {
  return client.newsletter.upsert({
    where: {
      id: "DEVMASTERY_DEFAULT",
    },
    update: defaultNewsletter,
    create: defaultNewsletter,
  });
}

main()
  .then(async () => {
    await client.$disconnect();
    console.log("Done!");
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    await client.$disconnect();
    process.exit(1);
  });
