// 商品テーブル作成クエリ
export const createProductsTableQuery = `
CREATE TABLE IF NOT EXISTS products (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL,
  image_url   TEXT    NOT NULL,
  price_yen   INTEGER NOT NULL CHECK (price_yen >= 0),
  stock       INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  created_at  TEXT    DEFAULT  CURRENT_TIMESTAMP,
  updated_at  TEXT    DEFAULT  CURRENT_TIMESTAMP,
  UNIQUE(name)
) STRICT;
`;

// products.updated_atを自動更新するトリガークエリ
export const triggerProductsUpdatedAt = `
CREATE TRIGGER IF NOT EXISTS trg_products_updated_at
AFTER UPDATE ON products
FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE products
     SET updated_at = CURRENT_TIMESTAMP
   WHERE id = NEW.id;
END;
`;

// 受注テーブル作成クエリ
export const createOrdersTableQuery = `
CREATE TABLE IF NOT EXISTS orders (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  total_yen     INTEGER NOT NULL CHECK (total_yen >= 0),
  shipping_fee  INTEGER NOT NULL CHECK (shipping_fee >= 0),
  status        TEXT    NOT NULL DEFAULT 'CART',
  created_at    TEXT    DEFAULT  CURRENT_TIMESTAMP
) STRICT;
`;

// 受注明細テーブル作成クエリ
export const createOrderItemsTableQuery = `
CREATE TABLE IF NOT EXISTS order_items (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id      INTEGER NOT NULL,
  product_id    INTEGER NOT NULL,
  quantity      INTEGER NOT NULL CHECK (quantity > 0),
  price_yen     INTEGER NOT NULL CHECK (price_yen >= 0),
  created_at    TEXT    DEFAULT  CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
) STRICT;
`;

// 商品データ挿入クエリ
export const insertProductsQuery = `
INSERT OR IGNORE INTO products (name, image_url, price_yen, stock) VALUES
 ('黒い無地のTシャツ', '/t-shirt1.jpg', 2000, 10),
 ('ピンクの無地のTシャツ', '/t-shirt2.jpg', 1500, 20);
`;
