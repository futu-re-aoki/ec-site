import Header from "@/components/Header";
import Image from "next/image";
import { getAllProducts } from "@/lib/repos/productRepo";
import Link from "next/link";

export default function Home() {
  const products = getAllProducts();

  return (
    <div className="h-full">
      <Header />
      <main className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 p-4">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.id}`}
            className="border rounded-lg p-4 text-center hover:shadow-lg"
          >
            <Image src={p.image_url} alt={p.name} width={180} height={180} />
            <h2 className="mt-2 text-lg font-semibold">{p.name}</h2>
            <p>価格: ¥{p.price_yen}</p>
            <p>在庫数: {p.stock}</p>
          </Link>
        ))}
      </main>
    </div>
  );
}
