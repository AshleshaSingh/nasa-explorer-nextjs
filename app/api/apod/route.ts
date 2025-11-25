// app/api/apod/route.ts
import { NextRequest, NextResponse } from "next/server";
// relative path from app/api/apod/route.ts → lib/nasa.ts
import { fetchApod } from "../../../lib/nasa";

export async function GET(req: NextRequest) {
  // Read ?date=YYYY-MM-DD from the query string if provided
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date") ?? undefined;

  try {
    const apod = await fetchApod(date);

    return NextResponse.json(apod, {
      status: 200,
    });
  } catch (error: any) {
    console.error("Error in /api/apod:", error);

    return NextResponse.json(
      {
        message: error?.message ?? "Failed to load APOD",
      },
      {
        status: 500,
      }
    );
  }
}
