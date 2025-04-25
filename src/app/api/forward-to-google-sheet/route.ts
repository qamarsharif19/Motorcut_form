export async function POST(req: Request) {
    const data = await req.json();
  
    try {
      const sheetResponse = await fetch("https://script.google.com/macros/s/AKfycbynsIU8J_uXsaFY4hNSSVNRp5g9HC5x2ujqZzZIyY-O3uatyw0FerQoU8y1MOcrSW81/exec", {
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
  