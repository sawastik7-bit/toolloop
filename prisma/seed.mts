import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";

async function main() {
  const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
  const db = new PrismaClient({ adapter });

  // Clean in FK order (Phase 2 tables first)
  await db.favorite.deleteMany();
  await db.borrowRequest.deleteMany();
  await db.tool.deleteMany();
  await db.user.deleteMany();

  // Users
  const heidi = await db.user.create({
    data: {
      name: "Heidi Hicks",
      email: "heidi.hicks@example.com",
      phone: "(585) 527-4709",
      address: "7762 Central St",
      neighborhood: "Riverside",
      avatarColor: "#0f766e",
    },
  });

  const luke = await db.user.create({
    data: {
      name: "Luke Williams",
      email: "luke.williams@example.com",
      phone: "(585) 746-7587",
      address: "9485 Bollinger Rd",
      neighborhood: "Oak Hill",
      avatarColor: "#b45309",
    },
  });

  const joann = await db.user.create({
    data: {
      name: "Joann Gregory",
      email: "joann.gregory@example.com",
      phone: "(432) 944-1892",
      address: "8057 Preston Rd",
      neighborhood: "Maple Court",
      avatarColor: "#1d4ed8",
    },
  });

  const alan = await db.user.create({
    data: {
      name: "Alan Holland",
      email: "alan.holland@example.com",
      phone: "(670) 414-8201",
      address: "12 Valley View Ln",
      neighborhood: "Cedar Flats",
      avatarColor: "#7c3aed",
    },
  });

  const terry = await db.user.create({
    data: {
      name: "Terry Medina",
      email: "terry.medina@example.com",
      phone: "(712) 659-8017",
      address: "9756 Woodland St",
      neighborhood: "Riverside",
      avatarColor: "#be123c",
    },
  });

  // Tools - Heidi (Riverside)
  const drill = await db.tool.create({
    data: {
      name: "Cordless Drill (18V)",
      category: "POWER_TOOLS",
      description: "18V cordless drill with two batteries and a charger. Great for home projects.",
      condition: "GOOD",
      neighborhood: "Riverside",
      rules: "Return with batteries charged. Handle with care.",
      available: true,
      ownerId: heidi.id,
    },
  });

  await db.tool.create({
    data: {
      name: "Orbital Sander",
      category: "POWER_TOOLS",
      description:
        "Random orbital sander, ideal for finishing wood surfaces. Includes sanding pads.",
      condition: "GOOD",
      neighborhood: "Riverside",
      rules: "Return clean. Replace any used sanding pads.",
      available: true,
      ownerId: heidi.id,
    },
  });

  // Terry (Riverside)
  await db.tool.create({
    data: {
      name: "Pressure Washer",
      category: "CLEANING",
      description: "Electric pressure washer, 1800 PSI. Great for driveways and decks.",
      condition: "GOOD",
      neighborhood: "Riverside",
      rules: "Drain hose before returning. Pickup/drop-off evenings only.",
      available: false,
      ownerId: terry.id,
    },
  });

  // Luke (Oak Hill)
  const saw = await db.tool.create({
    data: {
      name: "Circular Saw",
      category: "POWER_TOOLS",
      description: "7-1/4 inch circular saw with blade. Good for rough cuts and framing.",
      condition: "FAIR",
      neighborhood: "Oak Hill",
      rules: "Return with blade guard on. No wet cutting.",
      available: false,
      ownerId: luke.id,
    },
  });

  const socketSet = await db.tool.create({
    data: {
      name: "Socket Set (40pc)",
      category: "AUTOMOTIVE",
      description: "40-piece socket set, metric and SAE. All pieces accounted for.",
      condition: "GOOD",
      neighborhood: "Oak Hill",
      rules: "Return complete. Check all pieces before returning.",
      available: true,
      ownerId: luke.id,
    },
  });

  const extLadder = await db.tool.create({
    data: {
      name: "Extension Ladder (16ft)",
      category: "LADDERS",
      description: "16ft aluminum extension ladder. Rated for 225 lbs.",
      condition: "FAIR",
      neighborhood: "Oak Hill",
      rules: "Inspect before use. Return with all rungs intact.",
      available: false,
      ownerId: luke.id,
    },
  });

  // Joann (Maple Court)
  const stepLadder = await db.tool.create({
    data: {
      name: "6ft Step Ladder",
      category: "LADDERS",
      description: "6-foot fiberglass step ladder. Stable and non-conductive.",
      condition: "GOOD",
      neighborhood: "Maple Court",
      rules: "Return clean and dry.",
      available: true,
      ownerId: joann.id,
    },
  });

  await db.tool.create({
    data: {
      name: "Wheelbarrow",
      category: "GARDEN",
      description: "Single-wheel steel wheelbarrow, 6 cu ft. Tire holds air.",
      condition: "WELL_USED",
      neighborhood: "Maple Court",
      rules: "Rinse out after use. Return the same day if possible.",
      available: true,
      ownerId: joann.id,
    },
  });

  // Alan (Cedar Flats)
  const hedgeTrimmer = await db.tool.create({
    data: {
      name: "Hedge Trimmer",
      category: "GARDEN",
      description: "Cordless hedge trimmer, 22-inch blade. Battery included.",
      condition: "LIKE_NEW",
      neighborhood: "Cedar Flats",
      rules: "Return charged and clean.",
      available: true,
      ownerId: alan.id,
    },
  });

  await db.tool.create({
    data: {
      name: "Stud Finder",
      category: "HAND_TOOLS",
      description: "Electronic stud finder with AC wire detection.",
      condition: "LIKE_NEW",
      neighborhood: "Cedar Flats",
      rules: "Return with battery. Handle gently.",
      available: true,
      ownerId: alan.id,
    },
  });

  // Requests
  // PENDING: Alan -> Luke's Socket Set
  await db.borrowRequest.create({
    data: {
      toolId: socketSet.id,
      requesterId: alan.id,
      status: "PENDING",
      message: "Need it to fix my car this weekend. Will return Monday.",
    },
  });

  // APPROVED: Terry -> Luke's Circular Saw (saw.available = false)
  await db.borrowRequest.create({
    data: {
      toolId: saw.id,
      requesterId: terry.id,
      status: "APPROVED",
      message: "Building a deck this summer. Will need it for about a week.",
    },
  });

  // APPROVED: Joann -> Luke's Extension Ladder (extLadder.available = false)
  await db.borrowRequest.create({
    data: {
      toolId: extLadder.id,
      requesterId: joann.id,
      status: "APPROVED",
      message: "Painting the exterior. Should only need it for a day or two.",
    },
  });

  // RETURNED: Joann -> Heidi's Cordless Drill (drill.available = true)
  await db.borrowRequest.create({
    data: {
      toolId: drill.id,
      requesterId: joann.id,
      status: "RETURNED",
      message: "Needed for shelf installation. Thanks!",
    },
  });

  // RETURNED: Heidi -> Joann's Step Ladder (stepLadder.available = true)
  await db.borrowRequest.create({
    data: {
      toolId: stepLadder.id,
      requesterId: heidi.id,
      status: "RETURNED",
      message: "Needed to clean gutters. Returned same day.",
    },
  });

  // Favorites (4 across 3 users)
  await db.favorite.create({ data: { userId: heidi.id, toolId: socketSet.id } });
  await db.favorite.create({ data: { userId: heidi.id, toolId: stepLadder.id } });
  await db.favorite.create({ data: { userId: terry.id, toolId: hedgeTrimmer.id } });
  await db.favorite.create({ data: { userId: alan.id, toolId: drill.id } });

  await db.$disconnect();
  console.log("Seeded: 5 users, 10 tools, 5 requests, 4 favorites");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
