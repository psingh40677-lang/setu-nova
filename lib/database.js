import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { demoProducts, demoRentals } from "./catalog.js";
import { forestPriceReferences, forestResearchSources, isForestProduct } from "./forest-market-data.js";

let database;

export function getDatabase() {
  if (database) return database;

  const databasePath = process.env.SETU_NOVA_DB_PATH || path.join(process.cwd(), ".data", "setu-nova.sqlite");
  fs.mkdirSync(path.dirname(databasePath), { recursive: true });
  database = new DatabaseSync(databasePath);
  database.exec(`
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      payload TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'PUBLISHED',
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      status TEXT NOT NULL,
      payment_status TEXT NOT NULL,
      payload TEXT NOT NULL,
      history TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS buyer_requests (
      id TEXT PRIMARY KEY,
      status TEXT NOT NULL,
      payload TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS quotations (
      id TEXT PRIMARY KEY,
      request_id TEXT NOT NULL REFERENCES buyer_requests(id),
      payload TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS rentals (
      id TEXT PRIMARY KEY,
      payload TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS rental_bookings (
      id TEXT PRIMARY KEY,
      rental_id TEXT NOT NULL REFERENCES rentals(id),
      status TEXT NOT NULL,
      payload TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS forest_price_references (
      id TEXT PRIMARY KEY,
      payload TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS forest_price_history (
      id TEXT PRIMARY KEY,
      listing_id TEXT NOT NULL,
      payload TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS listing_audit (
      id TEXT PRIMARY KEY,
      listing_id TEXT NOT NULL,
      actor TEXT NOT NULL,
      action TEXT NOT NULL,
      note TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  const now = new Date().toISOString();
  for (const product of demoProducts) {
    const existing = database.prepare("SELECT payload FROM products WHERE id = ?").get(product.id);
    if (existing) {
      const oldPayload = JSON.parse(existing.payload);
      database.prepare("UPDATE products SET payload = ? WHERE id = ?")
        .run(JSON.stringify({ ...product, stock: oldPayload.stock }), product.id);
      if (isForestProduct(product)) {
        database.prepare("UPDATE products SET status = 'PENDING_REVIEW' WHERE id = ?").run(product.id);
      }
    } else {
      database.prepare("INSERT INTO products (id, payload, status, created_at) VALUES (?, ?, ?, ?)")
        .run(product.id, JSON.stringify(product), isForestProduct(product) ? "PENDING_REVIEW" : "PUBLISHED", now);
    }
  }

  const insertPriceReference = database.prepare("INSERT OR IGNORE INTO forest_price_references (id, payload) VALUES (?, ?)");
  for (const reference of forestPriceReferences) insertPriceReference.run(reference.id, JSON.stringify(reference));
  insertPriceReference.run("research-sources", JSON.stringify({ sources: forestResearchSources }));

  const seedRental = database.prepare("INSERT OR IGNORE INTO rentals (id, payload) VALUES (?, ?)");
  for (const rental of demoRentals) seedRental.run(rental.id, JSON.stringify(rental));

  const demoOrderId = "SN-DEMO-2026";
  const existingDemoOrder = database.prepare("SELECT id FROM orders WHERE id = ?").get(demoOrderId);
  if (!existingDemoOrder) {
    const sample = demoProducts.find((product) => product.id === "bamboo-tokari");
    const createdAt = new Date().toISOString();
    const payload = {
      items: [{ id: sample.id, quantity: 1, lineTotal: sample.price, name: sample.name, image: sample.image, price: sample.price, seller: sample.seller }],
      subtotal: sample.price,
      shipping: 79,
      total: sample.price + 79,
      shippingMethod: "Demo only; no courier selected",
      deliveryRegion: "India",
      demoOnly: true,
      inventoryReserved: false,
    };
    const history = [{ status: "ORDER_PLACED", timestamp: createdAt, note: "Seeded sample order for demonstration only. No real order or shipment exists." }];
    database.prepare("INSERT INTO orders (id, status, payment_status, payload, history, created_at) VALUES (?, 'ORDER_PLACED', 'DEMO_UNPAID', ?, ?, ?)")
      .run(demoOrderId, JSON.stringify(payload), JSON.stringify(history), createdAt);
  }

  const demoRequestId = "REQ-DEMO-BASKET";
  const existingDemoRequest = database.prepare("SELECT id FROM buyer_requests WHERE id = ?").get(demoRequestId);
  if (!existingDemoRequest) {
    const payload = {
      title: "DEMO · Handwoven bamboo baskets",
      description: "Sample buyer request for 40 handmade baskets. This fictional request is included to demonstrate the quotation workflow.",
      category: "Handicrafts",
      quantity: "40 baskets",
      budget: 25000,
      location: "Pune, Maharashtra",
      requiredDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
    };
    database.prepare("INSERT INTO buyer_requests (id, status, payload, created_at) VALUES (?, 'OPEN', ?, ?)")
      .run(demoRequestId, JSON.stringify(payload), now);
  }

  return database;
}

export function readPayloadRows(db, sql, ...parameters) {
  return db.prepare(sql).all(...parameters).map((row) => JSON.parse(row.payload));
}
