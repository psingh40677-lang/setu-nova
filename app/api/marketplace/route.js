import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { getDatabase, readPayloadRows } from "../../../lib/database.js";
import { categories, demoProducts } from "../../../lib/catalog.js";
import { forestCategory, forestSubcategories, isForestProduct } from "../../../lib/forest-market-data.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const jsonError = (message, status = 400) => NextResponse.json({ error: message }, { status });
const text = (value, max = 500) => typeof value === "string" ? value.trim().slice(0, max) : "";
const finiteNumber = (value) => Number.isFinite(Number(value)) ? Number(value) : NaN;
const nowIso = () => new Date().toISOString();

function readCollection(db, collection) {
  if (collection === "products") {
    return readPayloadRows(db, "SELECT payload FROM products WHERE status = 'PUBLISHED' ORDER BY created_at DESC");
  }
  if (collection === "sellerProducts") {
    return db.prepare("SELECT payload, status FROM products WHERE id LIKE 'seller-%' AND status != 'REMOVED' ORDER BY created_at DESC")
      .all().map((row) => ({ ...JSON.parse(row.payload), status: row.status }));
  }
  if (collection === "orders") {
    return db.prepare("SELECT id, status, payment_status AS paymentStatus, payload, history, created_at AS createdAt FROM orders ORDER BY created_at DESC")
      .all().map((row) => ({ ...JSON.parse(row.payload), id: row.id, status: row.status, paymentStatus: row.paymentStatus, history: JSON.parse(row.history), createdAt: row.createdAt }));
  }
  if (collection === "requests") {
    return db.prepare("SELECT id, status, payload, created_at AS createdAt FROM buyer_requests ORDER BY created_at DESC")
      .all().map((row) => ({ ...JSON.parse(row.payload), id: row.id, status: row.status, createdAt: row.createdAt, quotations: readPayloadRows(db, "SELECT payload FROM quotations WHERE request_id = ? ORDER BY created_at DESC", row.id) }));
  }
  if (collection === "rentals") return readPayloadRows(db, "SELECT payload FROM rentals ORDER BY id");
  if (collection === "bookings") {
    return db.prepare("SELECT id, rental_id AS rentalId, status, payload, created_at AS createdAt FROM rental_bookings ORDER BY created_at DESC")
      .all().map((row) => ({ ...JSON.parse(row.payload), id: row.id, rentalId: row.rentalId, status: row.status, createdAt: row.createdAt }));
  }
  if (collection === "forestReview") {
    return db.prepare("SELECT id, status, payload, created_at AS createdAt FROM products WHERE id LIKE 'seller-%' AND status != 'REMOVED' ORDER BY created_at DESC")
      .all().map((row) => ({ ...JSON.parse(row.payload), id: row.id, status: row.status, createdAt: row.createdAt }))
      .filter((product) => isForestProduct(product));
  }
  if (collection === "forestPriceReferences") {
    const records = readPayloadRows(db, "SELECT payload FROM forest_price_references WHERE id != 'research-sources' ORDER BY id");
    const sources = JSON.parse(db.prepare("SELECT payload FROM forest_price_references WHERE id = 'research-sources'").get()?.payload || '{"sources":[]}');
    return { records, sources: sources.sources };
  }
  if (collection === "forestPriceHistory") {
    return db.prepare("SELECT listing_id AS listingId, payload, created_at AS createdAt FROM forest_price_history ORDER BY created_at DESC")
      .all().map((row) => ({ ...JSON.parse(row.payload), listingId: row.listingId, createdAt: row.createdAt }));
  }
  if (collection === "forestAudit") {
    return db.prepare("SELECT listing_id AS listingId, actor, action, note, created_at AS createdAt FROM listing_audit ORDER BY created_at DESC")
      .all();
  }
  return null;
}

export async function GET(request) {
  try {
    const db = getDatabase();
    const collection = new URL(request.url).searchParams.get("collection");
    if (collection) {
      const data = readCollection(db, collection);
      return data ? NextResponse.json({ [collection]: data, demo: true }) : jsonError("Unknown marketplace collection.", 404);
    }
    return NextResponse.json({
      products: readCollection(db, "products"),
      sellerProducts: readCollection(db, "sellerProducts"),
      orders: readCollection(db, "orders"),
      requests: readCollection(db, "requests"),
      rentals: readCollection(db, "rentals"),
      bookings: readCollection(db, "bookings"),
      forestPriceReferences: readCollection(db, "forestPriceReferences"),
      forestReview: readCollection(db, "forestReview"),
      forestPriceHistory: readCollection(db, "forestPriceHistory"),
      forestAudit: readCollection(db, "forestAudit"),
      demo: true,
    });
  } catch (error) {
    console.error("Marketplace data could not be loaded.", error);
    return jsonError("Marketplace data could not be loaded.", 500);
  }
}

function parseListing(input, existing = {}) {
  const name = text(input.name, 100);
  const description = text(input.description, 1200);
  const descriptionHi = text(input.descriptionHi, 1200);
  const price = finiteNumber(input.price);
  const quantity = finiteNumber(input.stock ?? input.quantity);
  const category = text(input.category, 50);
  const nameHi = text(input.nameHi, 100);
  const imageAlt = text(input.imageAlt, 200);
  const discount = input.discount === undefined || input.discount === "" ? 0 : finiteNumber(input.discount);
  const forestProduct = isForestProduct({ ...input, category });
  if (name.length < 2 || description.length < 10 || ![...categories, "Medicinal plants"].includes(category) || !Number.isFinite(price) || price <= 0 || !Number.isInteger(quantity) || quantity < 1 || quantity > 100000 || !Number.isFinite(discount) || discount < 0 || discount > 90) {
    throw new Error("Enter a product name, description, category, positive price and stock between 1 and 100,000.");
  }
  if (forestProduct && nameHi.length < 2) {
    throw new Error("Forest listings require product names in both English and Hindi.");
  }
  if (forestProduct && descriptionHi.length < 10) {
    throw new Error("Forest listings require a product description in both English and Hindi.");
  }
  if (forestProduct && imageAlt.length < 15) {
    throw new Error("Forest listings require descriptive alt text for a genuine product photo.");
  }
  const details = {
    materials: text(input.materials, 300),
    dimensions: text(input.dimensions, 150),
    packaging: text(input.packaging, 200),
    source: text(input.source, 300),
    processing: text(input.processing, 300),
    botanicalName: text(input.botanicalName, 150),
    plantPart: text(input.plantPart, 100),
    storage: text(input.storage, 300),
    safety: text(input.safety, 500),
    complianceRequired: input.complianceRequired === true || input.complianceRequired === "on",
    isMedicinal: input.isMedicinal === true || input.isMedicinal === "on",
    documentReferences: text(input.documentReferences, 500),
    harvestDate: text(input.harvestDate, 10),
    packedDate: text(input.packedDate, 10),
    bestBefore: text(input.bestBefore, 10),
  };
  const detailsHi = {
    materials: text(input.materialsHi, 300),
    source: text(input.sourceHi, 300),
    processing: text(input.processingHi, 300),
    plantPart: text(input.plantPartHi, 100),
    storage: text(input.storageHi, 300),
    safety: text(input.safetyHi, 500),
    packaging: text(input.packagingHi, 200),
  };
  if (forestProduct &&
      (!details.source || !details.processing || !details.storage || !details.complianceRequired)) {
    throw new Error("Forest listings require source, processing, storage and a seller compliance declaration.");
  }
  if (forestProduct && !forestSubcategories.includes(text(input.subcategory, 120))) {
    throw new Error("Choose a valid forest-product subcategory before saving this listing.");
  }
  if ((category === "Medicinal plants" || details.isMedicinal) && (!details.botanicalName || !details.plantPart)) {
    throw new Error("Medicinal plant listings require a botanical name and plant part.");
  }
  for (const field of ["harvestDate", "packedDate", "bestBefore"]) {
    if (details[field]) {
      const date = new Date(`${details[field]}T00:00:00Z`);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(details[field]) || Number.isNaN(date.valueOf()) || date.toISOString().slice(0, 10) !== details[field]) {
        throw new Error(`Enter ${field} as a valid YYYY-MM-DD date.`);
      }
    }
  }
  if (details.packedDate && details.bestBefore && details.bestBefore < details.packedDate) {
    throw new Error("Best-before date cannot be earlier than the packing date.");
  }
  if (details.bestBefore && details.bestBefore < nowIso().slice(0, 10)) {
    throw new Error("Expired listings cannot be submitted for sale.");
  }
  if (forestProduct && /\b(cure|cures|treat|treats|treatment|prevents|prevent|heals|healing|therapeutic benefit)\b/i.test(`${description} ${details.safety}`)) {
    throw new Error("Do not make disease-treatment, cure or unverified therapeutic claims for forest or botanical products.");
  }
  const prohibitedTerms = /\b(tiger|pangolin|ivory|rhino|shahtoosh|red sanders|red sandalwood|bear bile|star tortoise|wild orchid|agarwood|eagle feather)\b/i;
  if (prohibitedTerms.test(`${name} ${description} ${details.botanicalName}`)) {
    throw new Error("This listing may include a protected or prohibited species or item and cannot be published.");
  }
  return {
    ...existing,
    id: existing.id || `seller-${randomUUID()}`,
    name,
    nameHi: nameHi || name,
    description,
    descriptionHi: descriptionHi || description,
    category: forestProduct ? forestCategory : category,
    subcategory: text(input.subcategory, 120),
    price,
    discount,
    priceType: "SELLER_ASKING",
    priceVerification: forestProduct ? "SELLER_DEFINED_NOT_MARKET_VERIFIED" : "NOT_APPLICABLE",
    priceLastUpdated: nowIso(),
    unit: text(input.unit, 40) || "each",
    stock: quantity,
    image: /^\/uploads\/[a-zA-Z0-9-]+\.(?:jpg|png|webp)$/.test(text(input.image, 1000)) ||
      /^https:\/\/images\.unsplash\.com\/[a-zA-Z0-9-]+(?:\?.*)?$/.test(text(input.image, 1000))
      ? text(input.image, 1000)
      : "/placeholder.svg",
    images: Array.isArray(input.images) ? input.images.map((image) => text(image, 1000)).filter((image) =>
      /^\/uploads\/[a-zA-Z0-9-]+\.(?:jpg|png|webp)$/.test(image) ||
      /^https:\/\/images\.unsplash\.com\/[a-zA-Z0-9-]+(?:\?.*)?$/.test(image) ||
      image === "/placeholder.svg").slice(0, 8) : [],
    imageAlt: imageAlt || `${name}, seller-provided product photo`,
    seller: text(input.seller, 100) || "Independent rural producer",
    sellerHi: text(input.sellerHi, 100) || existing.sellerHi || text(input.seller, 100) || "स्वतंत्र ग्रामीण उत्पादक",
    location: text(input.location, 120) || text(existing.location, 120) || "India",
    locationHi: text(input.locationHi, 120) || text(existing.locationHi, 120) || text(input.location, 120) || text(existing.location, 120) || "भारत",
    details,
    detailsHi,
    imageAltHi: text(input.imageAltHi, 200) || `${nameHi || name}, उत्पाद की फोटो`,
    isForestProduce: forestProduct,
    complianceStatus: forestProduct ? "PENDING_REVIEW" : "NOT_REQUIRED",
    deliveryOptions: text(input.deliveryOptions, 300) || "Seller to confirm delivery options",
    rating: null,
    popularity: 0,
    label: forestProduct ? "Seller asking price · market verification pending" : "Seller listing · demo",
  };
}

export async function POST(request) {
  if (process.env.NODE_ENV === "production") {
    return jsonError("Demo write APIs are disabled in production. Configure authenticated marketplace services before deployment.", 503);
  }

  let input;
  try {
    input = await request.json();
  } catch {
    return jsonError("Request body must be valid JSON.");
  }

  try {
    const db = getDatabase();
    const action = text(input.action, 40);
    const now = nowIso();

    if (action === "create-listing") {
      const product = parseListing(input.product || {});
      const status = product.isForestProduce ? "PENDING_REVIEW" : "PUBLISHED";
      product.status = status;
      product.images = product.images.length ? product.images : [product.image];
      db.prepare("INSERT INTO products (id, payload, status, created_at) VALUES (?, ?, ?, ?)")
        .run(product.id, JSON.stringify(product), status, now);
      if (product.isForestProduce) {
        db.prepare("INSERT INTO listing_audit (id, listing_id, actor, action, note, created_at) VALUES (?, ?, 'seller-demo', 'SUBMITTED_FOR_REVIEW', ?, ?)")
          .run(randomUUID(), product.id, "Seller submitted listing and compliance declaration; no legal verification is implied.", now);
        db.prepare("INSERT INTO forest_price_history (id, listing_id, payload, created_at) VALUES (?, ?, ?, ?)")
          .run(randomUUID(), product.id, JSON.stringify({ amount: product.price, unit: product.unit, priceType: product.priceType, priceVerification: product.priceVerification }), now);
      }
      return NextResponse.json({ product, status, demo: true }, { status: 201 });
    }

    if (action === "update-listing") {
      const id = text(input.id, 100);
      const row = db.prepare("SELECT payload, status FROM products WHERE id = ?").get(id);
      if (!row || demoProducts.some((product) => product.id === id)) return jsonError("Seller listing not found.", 404);
      if (input.operation === "remove") {
        db.prepare("UPDATE products SET status = 'REMOVED' WHERE id = ?").run(id);
        db.prepare("INSERT INTO listing_audit (id, listing_id, actor, action, note, created_at) VALUES (?, ?, 'seller-demo', 'REMOVED', ?, ?)")
          .run(randomUUID(), id, "Listing removed by seller.", now);
        return NextResponse.json({ removed: true, demo: true });
      }
      if (input.operation === "pause") {
        db.prepare("UPDATE products SET status = 'PAUSED' WHERE id = ?").run(id);
        db.prepare("INSERT INTO listing_audit (id, listing_id, actor, action, note, created_at) VALUES (?, ?, 'seller-demo', 'PAUSED', ?, ?)")
          .run(randomUUID(), id, "Listing paused by seller.", now);
        return NextResponse.json({ paused: true, demo: true });
      }
      if (input.operation === "publish") {
        const product = JSON.parse(row.payload);
        if (isForestProduct(product) && product.complianceStatus !== "APPROVED") {
          return jsonError("Forest listings cannot be published until an admin has reviewed the required evidence and approved the compliance record.", 409);
        }
        db.prepare("UPDATE products SET status = 'PUBLISHED' WHERE id = ?").run(id);
        db.prepare("INSERT INTO listing_audit (id, listing_id, actor, action, note, created_at) VALUES (?, ?, 'seller-demo', 'PUBLISHED', ?, ?)")
          .run(randomUUID(), id, "Listing published after review workflow.", now);
        return NextResponse.json({ published: true, demo: true });
      }
      const product = parseListing(input.product || {}, JSON.parse(row.payload));
      product.images = product.images.length ? product.images : [product.image];
      const nextStatus = product.isForestProduce ? "PENDING_REVIEW" : row.status;
      product.status = nextStatus;
      if (product.isForestProduce) product.complianceStatus = "PENDING_REVIEW";
      db.prepare("UPDATE products SET payload = ?, status = ? WHERE id = ?").run(JSON.stringify(product), nextStatus, id);
      db.prepare("INSERT INTO listing_audit (id, listing_id, actor, action, note, created_at) VALUES (?, ?, 'seller-demo', 'EDITED', ?, ?)")
        .run(randomUUID(), id, "Listing edit recorded.", now);
      if (product.isForestProduce) {
        db.prepare("INSERT INTO forest_price_history (id, listing_id, payload, created_at) VALUES (?, ?, ?, ?)")
          .run(randomUUID(), id, JSON.stringify({ amount: product.price, unit: product.unit, priceType: product.priceType, priceVerification: product.priceVerification }), now);
      }
      return NextResponse.json({ product, demo: true });
    }

    if (action === "review-forest-listing") {
      const id = text(input.id, 100);
      const row = db.prepare("SELECT payload, status FROM products WHERE id = ?").get(id);
      if (!row || demoProducts.some((product) => product.id === id)) return jsonError("Forest listing not found.", 404);
      const product = JSON.parse(row.payload);
      if (!isForestProduct(product)) return jsonError("This listing is not a forest or botanical product.", 400);
      const decision = text(input.decision, 40);
      const note = text(input.note, 800);
      if (note.length < 10) return jsonError("Record at least 10 characters describing the review decision and evidence checked.");
      if (decision === "APPROVE") {
        const required = product.details || {};
          const validUploadedImage = (image) => {
            if (!/^\/uploads\/[a-zA-Z0-9-]+\.(?:jpg|png|webp)$/.test(image || "")) return false;
            return fs.existsSync(path.join(process.cwd(), "public", image.slice(1)));
          };
          if (!required.complianceRequired || required.documentReferences.length < 5 || !required.source || !required.processing || !required.storage ||
              !validUploadedImage(product.image) || !product.images?.length || product.images.some((image) => !validUploadedImage(image)) ||
              product.imageAlt.length < 15 || !product.seller || !product.location ||
            ((required.isMedicinal || product.subcategory === "Permitted medicinal plant raw materials") && (!required.botanicalName || !required.plantPart))) {
          return jsonError("Approval requires document references, seller declarations, traceable source and handling details, a genuine uploaded product photo, and verified botanical identity/plant part when medicinal.", 409);
        }
        product.complianceStatus = "APPROVED";
        product.status = "PUBLISHED";
        product.reviewedAt = now;
        product.priceVerification = "SELLER_DEFINED_NOT_MARKET_VERIFIED";
        db.prepare("UPDATE products SET payload = ?, status = 'PUBLISHED' WHERE id = ?").run(JSON.stringify(product), id);
        db.prepare("INSERT INTO forest_price_history (id, listing_id, payload, created_at) VALUES (?, ?, ?, ?)")
          .run(randomUUID(), id, JSON.stringify({ amount: product.price, unit: product.unit, priceType: product.priceType, priceVerification: product.priceVerification }), now);
      } else {
        const statusByDecision = { CORRECTIONS_REQUIRED: "CORRECTIONS_REQUIRED", REJECT: "REJECTED", SUSPEND: "SUSPENDED" };
        const nextStatus = statusByDecision[decision];
        if (!nextStatus) return jsonError("Choose APPROVE, CORRECTIONS_REQUIRED, REJECT or SUSPEND.");
        product.complianceStatus = nextStatus;
        product.status = nextStatus;
        product.reviewedAt = now;
        db.prepare("UPDATE products SET payload = ?, status = ? WHERE id = ?").run(JSON.stringify(product), nextStatus, id);
      }
      db.prepare("INSERT INTO listing_audit (id, listing_id, actor, action, note, created_at) VALUES (?, ?, 'admin-demo', ?, ?, ?)")
        .run(randomUUID(), id, decision, note, now);
      return NextResponse.json({ product, status: decision === "APPROVE" ? "PUBLISHED" : product.complianceStatus, demo: true }, { status: 200 });
    }

    if (action === "create-request") {
      const requiredDate = text(input.requiredDate, 30);
      const payload = {
        title: text(input.title, 120),
        description: text(input.description, 1200),
        category: text(input.category, 60),
        quantity: text(input.quantity, 80),
        budget: finiteNumber(input.budget),
        location: text(input.location, 120),
        requiredDate,
      };
      if (payload.title.length < 3 || payload.description.length < 10 || !payload.category || !payload.quantity || !Number.isFinite(payload.budget) || payload.budget <= 0 || !payload.location || !/^\d{4}-\d{2}-\d{2}$/.test(payload.requiredDate) || Date.parse(`${payload.requiredDate}T00:00:00`) < Date.parse(`${now.slice(0, 10)}T00:00:00`)) {
        return jsonError("Complete the request title, description, category, quantity, budget, delivery location and required date.");
      }
      const id = `REQ-${randomUUID().slice(0, 8).toUpperCase()}`;
      db.prepare("INSERT INTO buyer_requests (id, status, payload, created_at) VALUES (?, 'OPEN', ?, ?)")
        .run(id, JSON.stringify(payload), now);
      return NextResponse.json({ request: { ...payload, id, status: "OPEN", createdAt: now, quotations: [] }, demo: true }, { status: 201 });
    }

    if (action === "create-quotation") {
      const requestId = text(input.requestId, 100);
      const parent = db.prepare("SELECT status FROM buyer_requests WHERE id = ?").get(requestId);
      const price = finiteNumber(input.price);
      const quantity = text(input.quantity, 80);
      const deliveryDays = finiteNumber(input.deliveryDays);
      if (!parent || !["OPEN", "QUOTATIONS_RECEIVED"].includes(parent.status)) return jsonError("This buyer request is not open for quotations.", 409);
      if (!Number.isFinite(price) || price <= 0 || !quantity || !Number.isInteger(deliveryDays) || deliveryDays < 1 || deliveryDays > 365) {
        return jsonError("Enter a positive quote, quantity and a delivery estimate from 1 to 365 days.");
      }
      const quote = {
        id: `QUO-${randomUUID().slice(0, 8).toUpperCase()}`,
        seller: text(input.seller, 100) || "Independent rural producer",
        price, quantity, deliveryDays, message: text(input.message, 500),
        status: "SUBMITTED", createdAt: now,
      };
      db.prepare("INSERT INTO quotations (id, request_id, payload, created_at) VALUES (?, ?, ?, ?)")
        .run(quote.id, requestId, JSON.stringify(quote), now);
      db.prepare("UPDATE buyer_requests SET status = 'QUOTATIONS_RECEIVED' WHERE id = ? AND status = 'OPEN'").run(requestId);
      return NextResponse.json({ quotation: quote, demo: true }, { status: 201 });
    }

    if (action === "create-order") {
      if (!Array.isArray(input.items) || input.items.length < 1 || input.items.length > 50) return jsonError("Add at least one valid product to the basket.");
      const seen = new Set();
      const entries = [];
      for (const item of input.items) {
        const id = text(item.id, 100);
        const quantity = finiteNumber(item.quantity);
        if (!id || !Number.isInteger(quantity) || quantity < 1 || quantity > 100 || seen.has(id)) return jsonError("Basket items or quantities are invalid.");
        seen.add(id);
        const row = db.prepare("SELECT payload FROM products WHERE id = ? AND status = 'PUBLISHED'").get(id);
        if (!row) return jsonError("A basket product is no longer available.", 409);
        const product = JSON.parse(row.payload);
        if (product.stock < quantity) return jsonError(`${product.name} does not have enough stock.`, 409);
        const unitPrice = Math.round(product.price * (100 - Number(product.discount || 0)) / 100);
        entries.push({ id, quantity, product, unitPrice, lineTotal: unitPrice * quantity });
      }
      const subtotal = entries.reduce((sum, item) => sum + item.lineTotal, 0);
      const shipping = subtotal >= 999 ? 0 : 79;
      const id = `SN-${new Date().getFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}`;
      const history = [{ status: "ORDER_PLACED", timestamp: now, note: "Demo order created; payment has not been collected." }];
      const payload = {
        items: entries.map(({ id: productId, quantity, product, unitPrice, lineTotal }) => ({
          id: productId, quantity, lineTotal, name: product.name, image: product.image,
          price: unitPrice, seller: product.seller,
        })),
        subtotal, shipping, total: subtotal + shipping,
        shippingMethod: "Standard demo delivery",
        deliveryRegion: text(input.deliveryRegion, 80) || "India",
        demoOnly: true,
        inventoryReserved: true,
      };
      db.exec("BEGIN IMMEDIATE");
      try {
        for (const entry of entries) {
          const currentRow = db.prepare("SELECT payload FROM products WHERE id = ? AND status = 'PUBLISHED'").get(entry.id);
          if (!currentRow) throw new Error("A basket product is no longer available.");
          const current = JSON.parse(currentRow.payload);
          if (current.stock < entry.quantity) throw new Error(`${current.name} does not have enough stock.`);
          current.stock -= entry.quantity;
          db.prepare("UPDATE products SET payload = ? WHERE id = ?").run(JSON.stringify(current), entry.id);
        }
        db.prepare("INSERT INTO orders (id, status, payment_status, payload, history, created_at) VALUES (?, 'ORDER_PLACED', 'DEMO_UNPAID', ?, ?, ?)")
          .run(id, JSON.stringify(payload), JSON.stringify(history), now);
        db.exec("COMMIT");
      } catch (error) {
        db.exec("ROLLBACK");
        throw error;
      }
      return NextResponse.json({ order: { ...payload, id, status: "ORDER_PLACED", paymentStatus: "DEMO_UNPAID", history, createdAt: now }, demo: true }, { status: 201 });
    }

    if (action === "cancel-order") {
      const id = text(input.id, 100);
      const row = db.prepare("SELECT status, history, payload FROM orders WHERE id = ?").get(id);
      if (!row) return jsonError("Order not found.", 404);
      if (row.status !== "ORDER_PLACED") return jsonError("Only an unconfirmed demo order can be cancelled.", 409);
      const history = [...JSON.parse(row.history), { status: "CANCELLED", timestamp: now, note: "Cancelled in the local demo." }];
      const order = JSON.parse(row.payload);
      db.exec("BEGIN IMMEDIATE");
      try {
        for (const item of order.inventoryReserved ? order.items || [] : []) {
          const productRow = db.prepare("SELECT payload FROM products WHERE id = ?").get(item.id);
          if (!productRow) continue;
          const product = JSON.parse(productRow.payload);
          product.stock += item.quantity;
          db.prepare("UPDATE products SET payload = ? WHERE id = ?").run(JSON.stringify(product), item.id);
        }
        db.prepare("UPDATE orders SET status = 'CANCELLED', history = ? WHERE id = ?").run(JSON.stringify(history), id);
        db.exec("COMMIT");
      } catch (error) {
        db.exec("ROLLBACK");
        throw error;
      }
      return NextResponse.json({ cancelled: true, demo: true });
    }

    if (action === "update-request") {
      const id = text(input.id, 100);
      const status = text(input.status, 30);
      const allowedStatuses = new Set(["ACCEPTED", "CLOSED", "CANCELLED"]);
      const row = db.prepare("SELECT status FROM buyer_requests WHERE id = ?").get(id);
      if (!row) return jsonError("Buyer request not found.", 404);
      if (!allowedStatuses.has(status) || !["OPEN", "QUOTATIONS_RECEIVED"].includes(row.status)) return jsonError("That buyer-request status change is not allowed.", 409);
      if (input.quotationId && status === "ACCEPTED") {
        const quoteId = text(input.quotationId, 100);
        const quoteRow = db.prepare("SELECT payload FROM quotations WHERE id = ? AND request_id = ?").get(quoteId, id);
        if (!quoteRow) return jsonError("Quotation not found for this buyer request.", 404);
        const quote = JSON.parse(quoteRow.payload);
        quote.status = "ACCEPTED";
        db.prepare("UPDATE quotations SET payload = ? WHERE id = ? AND request_id = ?")
          .run(JSON.stringify(quote), quoteId, id);
      }
      db.prepare("UPDATE buyer_requests SET status = ? WHERE id = ?").run(status, id);
      return NextResponse.json({ updated: true, demo: true });
    }

    if (action === "create-rental-booking") {
      const rentalId = text(input.rentalId, 100);
      const row = db.prepare("SELECT payload FROM rentals WHERE id = ?").get(rentalId);
      if (!row) return jsonError("Rental listing not found.", 404);
      const startDate = text(input.startDate, 30);
      const endDate = text(input.endDate, 30);
      const start = Date.parse(startDate);
      const end = Date.parse(endDate);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(endDate) || !Number.isFinite(start) || !Number.isFinite(end) || end < start || start < Date.now() - 86400000) return jsonError("Choose a valid future rental period.");
      const rental = JSON.parse(row.payload);
      const booking = {
        id: `RNT-${randomUUID().slice(0, 8).toUpperCase()}`, rentalId, rentalName: rental.name,
        startDate, endDate, status: "REQUESTED",
        note: "Booking request only; owner approval is required. No payment or availability is confirmed.",
      };
      db.prepare("INSERT INTO rental_bookings (id, rental_id, status, payload, created_at) VALUES (?, ?, 'REQUESTED', ?, ?)")
        .run(booking.id, rentalId, JSON.stringify(booking), now);
      return NextResponse.json({ booking: { ...booking, createdAt: now }, demo: true }, { status: 201 });
    }

    if (action === "update-rental-booking") {
      const id = text(input.id, 100);
      const status = text(input.status, 20);
      const allowedStatuses = new Set(["APPROVED", "REJECTED", "CANCELLED"]);
      const row = db.prepare("SELECT status, payload FROM rental_bookings WHERE id = ?").get(id);
      if (!row) return jsonError("Rental request not found.", 404);
      if (!allowedStatuses.has(status) || row.status !== "REQUESTED") return jsonError("That rental-request status change is not allowed.", 409);
      const payload = { ...JSON.parse(row.payload), status };
      db.prepare("UPDATE rental_bookings SET status = ?, payload = ? WHERE id = ?").run(status, JSON.stringify(payload), id);
      return NextResponse.json({ updated: true, demo: true });
    }

    return jsonError("Unknown marketplace action.", 404);
  } catch (error) {
    if (error instanceof Error && /^(Enter |Forest listings|This listing may|Choose a valid|Do not make|Best-before|Expired listings)/.test(error.message)) return jsonError(error.message);
    if (error instanceof Error && /no longer available|does not have enough stock/i.test(error.message)) return jsonError(error.message, 409);
    console.error("Marketplace operation failed.", error);
    return jsonError("The marketplace operation could not be completed.", 500);
  }
}
