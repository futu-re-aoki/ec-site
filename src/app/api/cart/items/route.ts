import { getCartItems } from "@/lib/repos/productRepo";
import { NextResponse } from "next/server";

export async function GET() {
  const items = getCartItems();
  return NextResponse.json(items);
}
