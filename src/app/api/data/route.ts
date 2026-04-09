import { NextRequest, NextResponse } from "next/server";
import { getAllData, setAllData } from "@/lib/store";
import { BurgerData } from "@/lib/types";

export async function GET() {
  const data = await getAllData();
  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  const secret = request.headers.get("x-seed-secret");
  if (secret !== process.env.SEED_SECRET && secret !== "burgeroisie-seed-2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as BurgerData;
  await setAllData(body);
  return NextResponse.json({ ok: true, visits: body.visits.length });
}
