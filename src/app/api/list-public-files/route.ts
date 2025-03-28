import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // "public/uploads" فولڈر میں موجود فائلز کو لسٹ کریں
    const directoryPath = path.join(process.cwd(), "public/uploads");
    const files = fs.readdirSync(directoryPath); // تمام فائلز پڑھیں

    // ہر فائل کا URL بنائیں
    const fileData = files.map((file) => ({
      name: file,
      url: `/uploads/${file}`, // Public path for frontend
    }));

    return NextResponse.json(fileData, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: "Failed to fetch files", details: errorMessage },
      { status: 500 }
    );
  }
}
