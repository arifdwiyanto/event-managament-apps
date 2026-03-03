import { PrismaClient, Role, OrgRole, PointType, TransactionStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding started...");

  // Cleanup
  await prisma.review.deleteMany();
  await prisma.transactionItem.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.promotionEvent.deleteMany();
  await prisma.promotion.deleteMany();
  await prisma.ticketType.deleteMany();
  await prisma.event.deleteMany();
  await prisma.category.deleteMany();
  await prisma.organizerTeam.deleteMany();
  await prisma.organizer.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.point.deleteMany();
  await prisma.userCoupon.deleteMany();
  await prisma.referral.deleteMany();
  await prisma.userNotification.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("Password123!", 10);

  // 1. Create 10 Categories
  const categoriesData = [
    { name: "Music", icon: "MusicalNoteIcon", color: "#FF00E5", thumbnail: "https://images.unsplash.com/photo-1514525253361-bee04896b0af?auto=format&fit=crop&q=80&w=800" },
    { name: "Nightlife", icon: "SparklesIcon", color: "#00F0FF", thumbnail: "https://images.unsplash.com/photo-1566737236500-c8ac01014a4c?auto=format&fit=crop&q=80&w=800" },
    { name: "Tech", icon: "CommandLineIcon", color: "#A855F7", thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800" },
    { name: "Art", icon: "PaintBrushIcon", color: "#FFBB00", thumbnail: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=800" },
    { name: "Food", icon: "CakeIcon", color: "#00FF00", thumbnail: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800" },
    { name: "Sports", icon: "TrophyIcon", color: "#FF4400", thumbnail: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800" },
    { name: "Education", icon: "AcademicCapIcon", color: "#0088FF", thumbnail: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800" },
    { name: "Business", icon: "BriefcaseIcon", color: "#888888", thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800" },
    { name: "Charity", icon: "HeartIcon", color: "#FF0000", thumbnail: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800" },
    { name: "Gaming", icon: "PuzzlePieceIcon", color: "#00FFFF", thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800" },
  ];

  const categories = await Promise.all(
    categoriesData.map((cat) => prisma.category.create({ data: cat }))
  );

  // 2. Create 15 Organizer Users
  const organizerUsers = [];
  for (let i = 1; i <= 15; i++) {
    const user = await prisma.user.create({
      data: {
        name: `Organizer User ${i}`,
        email: `org${i}@example.com`,
        password: passwordHash,
        referralCode: `ORG_REF_${i}`,
        isVerified: true,
        roles: {
          create: [{ role: Role.ORGANIZER }]
        }
      },
    });
    organizerUsers.push(user);
  }

  // 3. Create 5 Customer Users
  const customerUsers = [];
  for (let i = 1; i <= 5; i++) {
    const user = await prisma.user.create({
      data: {
        name: `Customer User ${i}`,
        email: `cust${i}@example.com`,
        password: passwordHash,
        referralCode: `CUST_REF_${i}`,
        isVerified: true,
        roles: {
          create: [{ role: Role.CUSTOMER }]
        }
      },
    });
    customerUsers.push(user);
  }

  // 4. Create 5 Organizers with 3-person teams (OWNER, ADMIN, MARKETING)
  const organizers = [];
  for (let i = 0; i < 5; i++) {
    const owner = organizerUsers[i * 3];
    const admin = organizerUsers[i * 3 + 1];
    const marketing = organizerUsers[i * 3 + 2];

    const organizer = await prisma.organizer.create({
      data: {
        name: `Neon ${i + 1} Productions`,
        description: `High energy event organizers specialized in neon vibes.`,
        ownerId: owner.id,
        isVerified: true,
        teams: {
          create: [
            { userId: owner.id, role: OrgRole.OWNER },
            { userId: admin.id, role: OrgRole.ADMIN },
            { userId: marketing.id, role: OrgRole.MARKETING },
          ]
        }
      }
    });
    organizers.push(organizer);
  }

  // 5. Create 10 Events per Organizer (50 total)
  const events = [];
  for (const org of organizers) {
    for (let j = 1; j <= 10; j++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const event = await prisma.event.create({
        data: {
          name: `${org.name} - Epic Event ${j}`,
          description: `An unforgettable experience brought to you by ${org.name}. Join us for a night of pure neon hype!`,
          location: "Jakarta Convention Center",
          startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * (j + 7)),
          endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * (j + 8)),
          organizerId: org.id,
          categoryId: category.id,
          isPaid: true,
          imageUrl: `https://picsum.photos/seed/event${org.id}${j}/1200/800`,
        }
      });
      events.push(event);

      // 6. Create 3 TicketTypes per Event
      const ticketTypes = await Promise.all([
        prisma.ticketType.create({
          data: {
            eventId: event.id,
            name: "General Admission",
            price: 150000,
            quota: 100,
            description: "Standard entry to all main stages."
          }
        }),
        prisma.ticketType.create({
          data: {
            eventId: event.id,
            name: "VIP Access",
            price: 500000,
            quota: 50,
            description: "Fast track + VIP Lounge access + 2 free drinks."
          }
        }),
        prisma.ticketType.create({
          data: {
            eventId: event.id,
            name: "Backstage Pass",
            price: 1500000,
            quota: 10,
            description: "Exclusive access to backstage and artist meetup."
          }
        }),
      ]);

      // 7. Create 2 Promotions per Event
      for(let p = 1; p <= 2; p++) {
        const promotion = await prisma.promotion.create({
          data: {
            name: `Promo ${p} for ${event.name}`,
            code: `PROMO_${event.id.substring(0,4)}_${p}`,
            discountPercentage: 10 * p,
            organizerId: org.id,
            startDate: new Date(),
            endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
            events: {
              create: { eventId: event.id }
            }
          }
        });
      }

      // 8. Transactions & Reviews from all 5 Customers
      for (const customer of customerUsers) {
        // Pick a random ticket type
        const ticket = ticketTypes[Math.floor(Math.random() * ticketTypes.length)];
        const qty = 1 + Math.floor(Math.random() * 2);
        const totalPrice = Number(ticket.price) * qty;

        const transaction = await prisma.transaction.create({
          data: {
            invoice: `INV-${Date.now()}-${customer.id.substring(0,4)}-${event.id.substring(0,4)}`,
            userId: customer.id,
            eventId: event.id,
            totalOriginalPrice: totalPrice,
            totalFinalPrice: totalPrice,
            status: TransactionStatus.PAID,
            paymentMethod: "CREDIT_CARD",
            transactionDate: new Date(),
            items: {
              create: {
                ticketTypeId: ticket.id,
                quantity: qty,
                pricePerUnit: ticket.price,
                totalPrice: totalPrice
              }
            }
          }
        });

        // 9. Review for each transaction
        await prisma.review.create({
          data: {
            userId: customer.id,
            eventId: event.id,
            rating: 4 + Math.floor(Math.random() * 2), // 4 or 5
            comment: "Absolutely insane experience! The vibes were unmatched.",
          }
        });
      }
    }
  }

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
