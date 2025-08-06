"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Product } from "@/types";

// サーバーアクション
// async function changeProductStockAction(formData: FormData) {
//   "use server";
//   const id = Number(formData.get("id"));
//   const delta = Number(formData.get("delta"));
//   changeProductStock(id, delta);
//   revalidatePath("/admin");
// }

export default function Admin() {
  // const products = getAllProducts();
  const [products, setProducts] = useState<Product[]>([]);

  async function fetchProducts() {
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error(`status ${res.status}`);
      const productsList: Product[] = await res.json();
      setProducts(productsList);
    } catch (e) {
      console.error(e);
    }
  }

  async function changeProductStock(id: number, delta: number) {
    await fetch("/api/products/stock", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, delta }),
    });
    fetchProducts();
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="h-full">
      <h1 className="text-2xl font-bold p-4">管理画面</h1>
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="p-2">id</th>
            <th className="p-2">商品</th>
            <th className="p-2">価格</th>
            <th className="p-2">在庫</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b text-center">
              <td className="p-2">{p.id}</td>
              <td className="p-2 flex items-center gap-2">
                <Image src={p.image_url} alt={p.name} width={50} height={50} />
                <h2>{p.name}</h2>
              </td>
              <td className="p-2">¥{p.price_yen.toLocaleString()}</td>
              <td className="p-2">
                {/* <form className="inline mr-2" action={changeProductStockAction}>
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="delta" value={-1} />
                  <button className="border px-2">-</button>
                </form> */}
                <button
                  className="border px-2 mr-2"
                  onClick={() => changeProductStock(p.id, -1)}
                >
                  -
                </button>
                {p.stock}
                <button
                  className="border px-2 ml-2"
                  onClick={() => changeProductStock(p.id, 1)}
                >
                  +
                </button>
                {/* <form className="inline ml-2" action={changeProductStockAction}>
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="delta" value={1} />
                  <button className="border px-2">+</button>
                </form> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
