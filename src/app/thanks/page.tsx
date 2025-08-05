import Header from "@/components/Header";
import Link from "next/link";

type Props = {
  searchParams: { order?: string };
};

export default function ThanksPage({ searchParams }: Props) {
  const orderId = searchParams.order;

  return (
    <div className="h-full">
      <Header />
      <main className="max-w-xl mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">ご注文ありがとうございます！</h1>
        {orderId && (
          <p className="mb-4">
            受注番号: <span className="font-mono">{orderId}</span>
          </p>
        )}
        <Link href="/" className="underline">
          トップへ戻る
        </Link>
      </main>
    </div>
  );
}
