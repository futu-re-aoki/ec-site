import { getCartItems } from "@/lib/repos/productRepo";
import { NextResponse } from "next/server";

export async function GET() {
  const cartItemsQuantity = getCartItems().reduce((sum, item) => sum + item.quantity, 0);
  return NextResponse.json(cartItemsQuantity);
}
