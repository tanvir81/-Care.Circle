import { connectDB } from "@/lib/db";
import { sendInvoiceEmail } from "@/lib/email";

export async function POST(request) {
  try {
    const body = await request.json();
    const db = await connectDB();
    const bookingsCollection = db.collection("bookings");
    
    const result = await bookingsCollection.insertOne({
      ...body,
      paymentStatus: "Unpaid"
    });
    
    // Send email asynchronously (don't await to avoid slowing down the response if email fails)
    sendInvoiceEmail(body.userEmail, { ...body, paymentStatus: "Unpaid" });

    return Response.json({ message: "Booking saved", bookingId: result.insertedId }, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Booking failed" }, { status: 500 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  try {
    const db = await connectDB();
    const query = email ? { userEmail: email } : {};
    const bookings = await db.collection("bookings").find(query).sort({ createdAt: -1 }).toArray();
    return Response.json(bookings);
  } catch (error) {
    return Response.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}
