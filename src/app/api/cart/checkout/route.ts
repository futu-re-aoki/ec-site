import { getCartItems, finalizeOrder } from "@/lib/repos/productRepo";
import { SHIPPING_FEE } from "@/constants/index";
import { NextResponse } from "next/server";

export async function POST() {
  const items = getCartItems();
  if (items.length === 0)
    return NextResponse.json({ error: "empty_cart" }, { status: 400 });

  const cartId = (items[0] as any).order_id ?? 1;

  const { orderId } = finalizeOrder(cartId, SHIPPING_FEE);
  return NextResponse.json({ orderId });
}
