export async function POST(req: Request) {
    const data = await req.json();
  
    try {
      const sheetResponse = await fetch("https://script.google.com/macros/s/AKfycbw8XNMnJ1Hhar35i3Vc9MojQlJFgqRMWJFS2hjR0ZjDIvc2xrzebGSXUQLD3DxfdIPp/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
  
      if (!sheetResponse.ok) {
        return new Response("Failed to send to Google Sheet", { status: 500 });
      }
  
      return new Response("Success", { status: 200 });
    } catch (error) {
      console.error("Google Sheet Error:", error);
      return new Response("Error", { status: 500 });
    }
  }
  