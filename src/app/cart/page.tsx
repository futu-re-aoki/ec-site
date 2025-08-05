import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";
import {
  getCartItems,
  updateQty,
  removeItem,
  finalizeOrder,
} from "@/lib/repos/productRepo";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { SHIPPING_FEE } from "@/constants/index";

// --- サーバーアクション ------------------------------
export async function changeQty(formData: FormData) {
  "use server";
  const id = Number(formData.get("id"));
  const qty = Number(formData.get("qty"));
  updateQty(id, qty);
  revalidatePath("/cart");
}

export async function deleteItem(formData: FormData) {
  "use server";
  const id = Number(formData.get("id"));
  removeItem(id);
  revalidatePath("/cart");
}

export async function checkout() {
  "use server";
  const cart = getCartItems();
  if (cart.length === 0) redirect("/cart");

  const cartId = cart[0].order_id ?? 1;
  const { orderId } = finalizeOrder(cartId, SHIPPING_FEE);
  redirect(`/thanks?order=${orderId}`);
}
// ----------------------------------------------------

export default function CartPage() {
  const items = getCartItems();
  const subtotal = items.reduce((s, i) => s + i.price_yen * i.quantity, 0);
  const total = items.length ? subtotal + SHIPPING_FEE : 0;

  return (
    <div className="h-full">
      <Header />
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">カート</h1>
        {items.length === 0 ? (
          <p>カートは空です。</p>
        ) : (
          <>
            {items.map((i) => (
              <div key={i.id} className="flex items-center gap-4 border-b py-4">
                <Image src={i.image_url} alt={i.name} width={80} height={80} />
                <div className="flex-1">
                  <p>{i.name}</p>
                  <p>¥{i.price_yen.toLocaleString()}</p>
                </div>
                <form action={changeQty}>
                  <input type="hidden" name="id" value={i.id} />
                  <input
                    type="number"
                    name="qty"
                    min={0}
                    defaultValue={i.quantity}
                    className="w-16 border px-1"
                  />
                  <button className="ml-1 border px-2">更新</button>
                </form>
                <form action={deleteItem}>
                  <input type="hidden" name="id" value={i.id} />
                  <button className="ml-2 text-red-600">削除</button>
                </form>
              </div>
            ))}
            <div className="text-right mt-6">
              <p>小計: ¥{subtotal.toLocaleString()}</p>
              <p>送料: ¥{items.length ? SHIPPING_FEE : 0}</p>
              <p className="text-xl font-bold">合計: ¥{total.toLocaleString()}</p>
              <form action={checkout}>
                <button className="mt-4 bg-black text-white px-6 py-2 rounded">
                  注文する
                </button>
              </form>
            </div>
          </>
        )}
        <Link href="/" className="inline-block mt-6 underline">
          商品一覧へ戻る
        </Link>
      </main>
    </div>
  );
}
