import { NextResponse } from "next/server";
import { getAllData } from "@/lib/store";

export async function GET() {
  const data = await getAllData();
  return NextResponse.json(data);
}
