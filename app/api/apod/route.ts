// app/api/apod/route.ts
import { NextResponse } from "next/server";
import { fetchApod } from "../../../lib/nasa";
import type { ApodResult } from "../../../types/nasa";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const date = searchParams.get("date") ?? undefined;
    const countParam = searchParams.get("count");
    const count = countParam ? Number(countParam) : undefined;
    const thumbs = true;

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
      thumbs
    });

    return NextResponse.json(
      { ok: true, data },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error in /api/apod:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error?.message ?? "Unexpected server error.",
      },
      { status: 500 },
    );
  }
}