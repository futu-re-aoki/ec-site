import { changeProductStock } from "@/lib/repos/productRepo";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const { id, delta } = await req.json();
  changeProductStock(Number(id), Number(delta));
  return NextResponse.json({ ok: true });
}
