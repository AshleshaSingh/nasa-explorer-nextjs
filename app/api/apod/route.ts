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
import { NextResponse } from "next/server";
import { fetchApod } from "@/lib/nasa";
import type { ApodResult } from "@/types/nasa";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const date = searchParams.get("date") ?? undefined;
    const countParam = searchParams.get("count");
    const count = countParam ? Number(countParam) : undefined;

    if (countParam && Number.isNaN(count)) {
      return NextResponse.json(
        { ok: false, error: "Invalid 'count' parameter." },
        { status: 400 },
      );
    }

    if (!date && !count) {
      return NextResponse.json(
        { ok: false, error: "Provide either 'date' or 'count' parameter." },
        { status: 400 },
      );
    }

    const data: ApodResult = await fetchApod({
      date,
      count,
      thumbs: true,
    });

    return NextResponse.json(
      { ok: true, data },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error in /api/apod:", error);

    return NextResponse.json(
      {
        message: error?.message ?? "Failed to load APOD",
      },
      {
        status: 500,
      }
        ok: false,
        error: error?.message ?? "Unexpected server error.",
      },
      { status: 500 },
    );
  }
}
