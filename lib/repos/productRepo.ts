import { Product } from "@/types";
import { db } from "../../db";

export const getAllProducts = () => {
  return db.prepare("SELECT * FROM products ORDER BY id").all() as Product[];
};

export const getProductById = (id: number) => {
  return db.prepare("SELECT * FROM products WHERE id = ?").get(id) as Product;
};

// CART ステータスの orders 行を確実に取得（無ければ作成）
const ensureCart = (): number => {
  let currentCartId: number | null = null;
  if (currentCartId) return currentCartId;

  const row = db.prepare("SELECT id FROM orders WHERE status = 'CART' LIMIT 1").get() as
    | { id: number }
    | undefined;

  if (row) {
    currentCartId = row.id;
  } else {
    const res = db
      .prepare("INSERT INTO orders (total_yen, shipping_fee, status) VALUES (0,0,'CART')")
      .run();
    currentCartId = Number(res.lastInsertRowid);
  }
  return currentCartId;
};

// カートに商品追加（同じ商品なら数量を加算）
export function addCartItem(productId: number, delta = 1) {
  const cartId = ensureCart();
  const row = db
    .prepare("SELECT quantity FROM order_items WHERE order_id = ? AND product_id = ?")
    .get(cartId, productId) as { quantity: number } | undefined;

  if (row) {
    db.prepare(
      "UPDATE order_items SET quantity = quantity + ? WHERE order_id = ? AND product_id = ?"
    ).run(delta, cartId, productId);
  } else {
    db.prepare(
      `INSERT INTO order_items (order_id, product_id, quantity, price_yen)
         VALUES (?, ?, ?, (SELECT price_yen FROM products WHERE id = ?))`
    ).run(cartId, productId, delta, productId);
  }
}

// 数量変更／削除
export const updateQty = (productId: number, quantity: number) => {
  const cartId = ensureCart();

  if (quantity <= 0) {
    db.prepare("DELETE FROM order_items WHERE order_id = ? AND product_id = ?").run(
      cartId,
      productId
    );
  } else {
    db.prepare(
      "UPDATE order_items SET quantity = ? WHERE order_id = ? AND product_id = ?"
    ).run(quantity, cartId, productId);
  }
};

// カートの商品を削除
export const removeItem = (productId: number) => {
  const quantity = 0;
  updateQty(productId, quantity);
};

// カートの商品一覧を取得
export function getCartItems() {
  const cartId = ensureCart();
  return db
    .prepare(
      `SELECT p.*, oi.quantity, oi.order_id
         FROM order_items oi
         JOIN products p ON p.id = oi.product_id
        WHERE oi.order_id = ?`
    )
    .all(cartId) as Array<{
    id: number;
    name: string;
    image_url: string;
    price_yen: number;
    stock: number;
    quantity: number;
    order_id: number;
  }>;
}

// 最終チェックアウト
export function finalizeOrder(cartId: number, shippingFee: number) {
  const items = db
    .prepare(
      `SELECT product_id, quantity, price_yen
         FROM order_items
        WHERE order_id = ?`
    )
    .all(cartId) as { product_id: number; quantity: number; price_yen: number }[];

  const subtotal = items.reduce((sum, i) => sum + i.price_yen * i.quantity, 0);
  const total = subtotal + shippingFee;

  db.transaction(() => {
    const dec = db.prepare("UPDATE products SET stock = stock - ? WHERE id = ?");
    items.forEach((i) => dec.run(i.quantity, i.product_id));

    db.prepare(
      `UPDATE orders
          SET total_yen = ?,
              shipping_fee = ?,
              status = 'PAID'
        WHERE id = ?`
    ).run(total, shippingFee, cartId);
  })();

  return { orderId: cartId, total };
}

// 在庫増減 (+/-)
export const changeProductStock = (id: number, delta: number) => {
  return db.prepare("UPDATE products SET stock = stock + ? WHERE id = ?").run(delta, id);
};
