import { connectDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const defaultServices = [
  {
    _id: "1",
    name: "Baby Care",
    description: "Professional and nurturing care for your little ones. Our babysitters are trained in child safety and interactive play.",
    price: 15,
    image: "/baby-care.jpg",
    details: "Includes feeding, changing, playtime, and evening care. Available for all age groups from infants to toddlers."
  },
  {
    _id: "2",
    name: "Elderly Service",
    description: "Compassionate care and assistance for senior family members. Helping with daily tasks and companionship.",
    price: 20,
    image: "/elderly-care.jpg",
    details: "Support with medication reminders, mobility assistance, companionship, and light housekeeping."
  },
  {
    _id: "3",
    name: "Sick People Service",
    description: "Specialized home care for recovery and health support. Dedicated care for those dealing with illness.",
    price: 25,
    image: "/sick-care.jpg",
    details: "Professional nursing assistance, vital signs monitoring, and recovery support at the comfort of your home."
  }
];

export async function GET() {
  try {
    const db = await connectDB();
    const servicesCollection = db.collection("services");
    
    const count = await servicesCollection.countDocuments();
    if (count === 0) {
      await servicesCollection.insertMany(defaultServices).catch(err => {
        console.error("Seeding error:", err.message);
      });
    }
    
    const data = await servicesCollection.find({}).toArray();
    
    return Response.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59',
      },
    });
  } catch (error) {
    console.error("API Error (GET /api/services):", error);
    return Response.json(
      { error: "Failed to fetch services", details: error.message }, 
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "admin") {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const service = await request.json();
    const db = await connectDB();
    const result = await db.collection("services").insertOne(service);
    return Response.json({ message: "Service added", id: result.insertedId }, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Failed to add service" }, { status: 500 });
  }
}
