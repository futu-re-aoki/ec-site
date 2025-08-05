import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import { addCartItem, getProductById } from "@/lib/repos/productRepo";

type Props = {
  params: { id: string };
};

// サーバーアクション
export async function addToCart(formData: FormData) {
  "use server";
  const productId = Number(formData.get("productId"));
  addCartItem(productId, 1);
  redirect("/cart");
}

export default function ProductDetail({ params }: Props) {
  const id = Number(params.id);
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="h-full">
      <Header />
      <main className="max-w-xl mx-auto p-6">
        <Image
          src={product.image_url}
          alt={product.name}
          width={300}
          height={300}
          className="mx-auto"
        />
        <h1 className="mt-4 text-2xl font-bold">{product.name}</h1>
        <p className="mt-2 text-lg">価格: ¥{product.price_yen.toLocaleString()}</p>
        <p>在庫数: {product.stock}</p>
        <div className="mt-6 flex gap-4">
          <form action={addToCart}>
            <input type="hidden" name="productId" value={product.id} />
            <button className="px-4 py-2 bg-black text-white rounded">
              カートに追加
            </button>
          </form>
          <Link href="/" className="px-4 py-2 border rounded">
            一覧へ戻る
          </Link>
        </div>
      </main>
    </div>
  );
}
