import Database from "better-sqlite3";
import {
  createOrderItemsTableQuery,
  createOrdersTableQuery,
  createProductsTableQuery,
  insertProductsQuery,
  triggerProductsUpdatedAt,
} from "./queries.js";

// データベース接続の作成
export const db = new Database("ecommerce.db");

// 各クエリの実行
try {
  // 外部キー制約を有効化
  db.pragma("foreign_keys = ON");

  // 各テーブル作成クエリの実行
  db.exec(createProductsTableQuery);
  db.exec(createOrdersTableQuery);
  db.exec(createOrderItemsTableQuery);

  // 自動更新トリガの実行
  db.exec(triggerProductsUpdatedAt);

  // 商品データ挿入クエリ
  db.exec(insertProductsQuery);

  console.log("Table creation and data insertion were completed successfully");
} catch (e) {
  console.error("Failed to create table and insert data");
  console.error(e);
}
