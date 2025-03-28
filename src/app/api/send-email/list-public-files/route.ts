import { NextResponse } from "next/server";

export async function GET() {
  const files = ["Main Frame.png"]; 
  return NextResponse.json(files);
}
