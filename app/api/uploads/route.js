import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const extensions = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
]);
const maxBytes = 5 * 1024 * 1024;

export async function POST(request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Demo image uploads are disabled in production. Configure authenticated object storage before deployment." }, { status: 503 });
  }
  let formData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Upload form data is invalid." }, { status: 400 });
  }

  const file = formData.get("image");
  if (!(file instanceof File)) return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });
  const extension = extensions.get(file.type);
  if (!extension) return NextResponse.json({ error: "Use a JPEG, PNG or WebP image." }, { status: 415 });
  if (file.size < 1 || file.size > maxBytes) return NextResponse.json({ error: "Images must be smaller than 5 MB." }, { status: 413 });

  try {
    const uploadDirectory = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDirectory, { recursive: true });
    const bytes = Buffer.from(await file.arrayBuffer());
    const validSignature =
      (file.type === "image/jpeg" && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) ||
      (file.type === "image/png" && bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) ||
      (file.type === "image/webp" && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP");
    if (!validSignature) return NextResponse.json({ error: "The uploaded file does not match its declared image type." }, { status: 415 });
    const filename = `${randomUUID()}${extension}`;
    await fs.writeFile(path.join(uploadDirectory, filename), bytes, { flag: "wx" });
    return NextResponse.json({ url: `/uploads/${filename}`, demo: true }, { status: 201 });
  } catch (error) {
    console.error("Product image upload failed.", error);
    return NextResponse.json({ error: "The image could not be saved. Check server upload storage." }, { status: 500 });
  }
}
