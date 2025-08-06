import { getAllProducts } from "@/lib/repos/productRepo";
import { NextResponse } from "next/server";

export async function GET() {
  const products = getAllProducts();
  return NextResponse.json(products);
}
