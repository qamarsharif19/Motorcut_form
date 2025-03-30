import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const baseDirectory = path.join(process.cwd(), "public/uploads");
    const categories = ["studio", "indoor", "outdoor", "showroom", "simplistic"]; // Tabs ke naam

    let fileData: { name: string; url: string; category: string }[] = [];

    categories.forEach((category) => {
      const categoryPath = path.join(baseDirectory, category);
      if (fs.existsSync(categoryPath)) {
        const files = fs.readdirSync(categoryPath);
        files.forEach((file) => {
          fileData.push({
            name: file,
            url: `/uploads/${category}/${file}`, // File ka public URL
            category: category.charAt(0).toUpperCase() + category.slice(1), // First letter capital for frontend
          });
        });
      }
    });

    return NextResponse.json(fileData, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: "Failed to fetch files", details: errorMessage },
      { status: 500 }
    );
  }
}
