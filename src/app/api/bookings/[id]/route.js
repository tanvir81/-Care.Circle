import { connectDB } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    const db = await connectDB();
    await db.collection("bookings").deleteOne({ _id: new ObjectId(id) });
    return Response.json({ message: "Booking cancelled" });
  } catch (error) {
    return Response.json({ error: "Cancellation failed" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const db = await connectDB();
    await db.collection("bookings").updateOne(
      { _id: new ObjectId(id) },
      { $set: body }
    );
    return Response.json({ message: "Updated successfully" });
  } catch (error) {
    return Response.json({ error: "Update failed" }, { status: 500 });
  }
}
