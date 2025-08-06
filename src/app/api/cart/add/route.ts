import { addCartItem } from "@/lib/repos/productRepo";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { productId } = await req.json();
  addCartItem(Number(productId), 1);
  return NextResponse.json({ ok: true });
}
