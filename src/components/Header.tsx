import Image from "next/image";
import Link from "next/link";
import { Badge } from "@heroui/badge";
import { getCartItems } from "@/lib/repos/productRepo";

export default function Header() {
  const cartItemsQuantity = getCartItems().reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="flex py-5">
      <h2 className="text-3xl">
        <Link href="/">E-commerce site</Link>
      </h2>
      <Link href="/cart">
        <Badge color="primary" content={cartItemsQuantity}>
          <Image
            src="/cart.png"
            alt="ショッピングカート"
            width={30}
            height={30}
            priority
          />
        </Badge>
      </Link>
    </header>
  );
}
