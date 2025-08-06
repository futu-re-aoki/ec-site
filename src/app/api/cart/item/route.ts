import { updateQty, removeItem } from "@/lib/repos/productRepo";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const { productId, quantity } = await req.json();
  updateQty(Number(productId), Number(quantity));
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const { productId } = await req.json();
  removeItem(Number(productId));
  return NextResponse.json({ ok: true });
}
