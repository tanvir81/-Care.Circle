import { connectDB } from "../../../../lib/db";
import { hashSync } from "bcryptjs";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, nid, contact } = body;

    if (!email || !password || !nid) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = await connectDB();
    const existingUser = await db.collection("users").findOne({ email });

    if (existingUser) {
      return Response.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = hashSync(password, 12);

    const newUser = {
      name,
      email,
      password: hashedPassword,
      nid,
      contact,
      role: "user",
      createdAt: new Date()
    };

    await db.collection("users").insertOne(newUser);

    return Response.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
