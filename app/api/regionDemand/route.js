import { Client } from "@gradio/client";

export async function POST(req) {
  try {
    const body = await req.json();
    const { dates_input } = body;

    if (!dates_input || typeof dates_input !== "string") {
      return new Response(
        JSON.stringify({ error: "Invalid or missing 'dates_input'" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const client = await Client.connect("Fa0713/DemandPredictor");
    const result = await client.predict("/predict", {
      dates_input: dates_input, // "2025-06-10" or "2025-06-10,2025-06-11"
    });

    return new Response(
      JSON.stringify({ result: result.data }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Prediction error:", error);
    return new Response(
      JSON.stringify({ error: "Prediction failed." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
