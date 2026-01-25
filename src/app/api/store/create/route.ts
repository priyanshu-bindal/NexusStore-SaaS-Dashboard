import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        if (session.user.role !== "MERCHANT") {
            return NextResponse.json({ message: "Only merchants can create stores" }, { status: 403 });
        }

        // 1. ADD THIS CHECK:
        const userExists = await db.user.findUnique({
            where: { id: session.user.id }
        });

        if (!userExists) {
            console.error("User not found in DB for ID:", session.user.id);
            return new NextResponse("User account does not exist in database.", { status: 400 });
        }

        const { name, description } = await req.json();

        // Create the store
        const store = await db.store.create({
            data: {
                name,
                description: description || "",
                userId: session.user.id,
            },
        });

        return NextResponse.json({ success: true, store }, { status: 201 });
    } catch (error) {
        console.error("Store creation error:", error);
        return NextResponse.json({ message: "Failed to create store" }, { status: 500 });
    }
}
