"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@heroui/badge";

export default function Header() {
  // const cartItemsQuantity = getCartItems().reduce((sum, item) => sum + item.quantity, 0);
  const [cartItemsQuantity, setCartItemsQuantity] = useState(0);

  useEffect(() => {
    async function fetchCartItemsQuantity() {
      try {
        const res = await fetch("/api/cart/quantity");
        if (!res.ok) throw new Error(`status: ${res.status}`);
        const quantity = await res.json();
        setCartItemsQuantity(quantity);
      } catch (e) {
        console.error(e);
        setCartItemsQuantity(0);
      }
    }
    fetchCartItemsQuantity();
  }, []);

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
