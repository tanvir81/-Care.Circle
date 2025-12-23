import Banner from "@/components/Banner";
import ClientHome from "@/components/ClientHome";
import { connectDB } from "@/lib/db";

export const metadata = {
  title: "Care.xyz | Reliable Home Care, Baby Sitting & Elderly Services",
  description: "Find and book trusted caretakers for babysitting, senior care, and special home assistance. Easy, secure, and accessible caregiving for your family.",
  keywords: ["caregiving", "babysitting", "elderly care", "home care", "nursing", "trusted care"],
};

export default async function Home() {
  let services = [];
  try {
    const db = await connectDB();
    services = await db.collection("services").find({}).toArray();
    // Convert ObjectIds to strings for client-side serialization
    services = JSON.parse(JSON.stringify(services));
  } catch (error) {
    console.error("Failed to fetch services on server:", error);
  }

  return (
    <div>
      <Banner />
      <ClientHome initialServices={services} />
    </div>
  );
}
