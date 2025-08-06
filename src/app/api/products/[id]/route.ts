import { getProductById } from "@/lib/repos/productRepo";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const product = getProductById(Number(params.id));
  if (!product) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json(product);
}
