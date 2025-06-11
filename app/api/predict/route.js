// app/api/predict/route.js
import { Client } from "@gradio/client";

export async function POST(req) {
  try {
    const { date_input, hour, zone, weather, goods_type } = await req.json();

    const client = await Client.connect("grimcoder123/volume_prediction");

    const result = await client.predict("/predict", {
      date_input,
      hour: parseInt(hour),
      zone,
      weather,
      goods_type,
    });

    return Response.json({ predictedVolume: result.data[0] });
  } catch (error) {
    console.error("Prediction API error:", error);
    return Response.json({ error: "Prediction failed." }, { status: 500 });
  }
}
