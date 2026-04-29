import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User";
import Charity from "../models/Charity";

const MONGODB_URI = process.env.MONGODB_URI!;

async function seed() {
  await mongoose.connect(MONGODB_URI);

  // Create admin user
  const adminExists = await User.findOne({ email: "admin@dheroes.com" });
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await User.create({
      email: "admin@dheroes.com",
      name: "Admin",
      password: hashedPassword,
      role: "admin",
      subscriptionStatus: "active",
    });
    console.log("Admin user created: admin@dheroes.com / admin123");
  }

  // Create sample charities
  const charities = [
    {
      name: "Golf for Good",
      description: "Supporting youth golf programs worldwide",
      logoUrl: "",
      website: "https://example.com",
      featured: true,
    },
    {
      name: "Green Fairways",
      description: "Environmental conservation through golf",
      logoUrl: "",
      website: "https://example.com",
      featured: false,
    },
    {
      name: "Veterans Golf",
      description: "Golf programs for military veterans",
      logoUrl: "",
      website: "https://example.com",
      featured: true,
    },
  ];

  for (const charity of charities) {
    const exists = await Charity.findOne({ name: charity.name });
    if (!exists) {
      await Charity.create(charity);
      console.log(`Charity created: ${charity.name}`);
    }
  }

  console.log("Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
