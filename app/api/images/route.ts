// app/api/images/route.ts

import { NextRequest, NextResponse } from "next/server";

import { searchNasaImages } from "@/lib/nasa";

/**
 * GET /api/images
 *
 * Query parameters:
 *  - query: search term (required)
 *  - page: page number (optional, default = 1)
 *
 * For this task, the UI will only use page=1.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const query = searchParams.get("query") ?? "";
  const pageParam = searchParams.get("page") ?? "1";
  const page = Number(pageParam) || 1;

  try {
    // Call our server-side helper
    const result = await searchNasaImages({ query, page });

    // Return success JSON
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error in /api/images:", error);
    }

    // Return a JSON error shape the UI can read
    return NextResponse.json(
      {
        message: error?.message ?? "Failed to load NASA images.",
      },
      { status: 500 },
    );
  }
}
