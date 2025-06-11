"use client";
import "./input.css";
import { use, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setForminput } from "@/store/feature/formSlice";
import { useRouter } from "next/navigation";



export default function VolumePredictor() {
    const router = useRouter();
    const [form, setForm] = useState({
        date_input: new Date().toISOString().split("T")[0],
        hour: 12,
        zone: "North_zone",
        weather: "Foggy",
        goods_type: "Chemicals",
    });
    const inputVal=useSelector((state) => state.form.value);
    const dispatch = useDispatch();
    console.log("Redux form state:", inputVal);

    const [result, setResult] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(setForminput(form));
        const res = await fetch("/api/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        const data = await res.json();
        console.log("Raw API response:", data);
        const volume = data.predictedVolume?.label || "N/A";
        router.push(`/optimisation?volume=${encodeURIComponent(volume)}`);

        setResult(data.predictedVolume);
    };
    console.log("Date input value:", form.date_input);

    return (
        <div className="xyz-up ">
       <div className="xyz p-4 bg-gray-200 rounded shadow-md max-w-md mx-auto">
        
            <h2 className="text-xl font-bold mb-4">Volume Prediction</h2>
            <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                    <h3>Input Date</h3>
                <input
                    type="date"
                    name="date_input"
                    value={form.date_input}
                    onChange={handleChange}
                    className="date-input border-2 border-red-500 p-2 rounded"
                />
                </div>
                
              <div>
                <h3>Input Time</h3>
                <input
                    type="number"
                    name="hour"
                    min="0"
                    max="23"
                    value={form.hour}
                    onChange={handleChange}
                    className="time-input w-full border p-2 rounded"
                />
                </div>
                <div>
                    <h3>Select Zones</h3>
                <select name="zone" value={form.zone} onChange={handleChange} className="zone-input w-full border p-2 rounded">
                    <option>North_zone</option>
                    <option>South_zone</option>
                    <option>East_zone</option>
                    <option>West_zone</option>
                </select>
                </div>
                <div>
                    </div>
                    <div>
                        <h3>Select weather</h3>
                <select name="weather" value={form.weather} onChange={handleChange} className="weather-input w-full border p-2 rounded">
                    <option>Foggy</option>
                    <option>Rainy</option>
                    <option>Sunny</option>
                    <option>Cloudy</option>
                </select>
                </div>
                <div>
                    <h3>Select Shipment Type</h3>
                <select name="goods_type" value={form.goods_type} onChange={handleChange} className="shipment-input w-full border p-2 rounded">
                    <option>Chemicals</option>
                    <option>Electronics</option>
                    <option>Food</option>
                    <option>Furniture</option>
                </select>
                </div>
                <button type="submit" className="predict-button bg-blue-500 text-white px-18 py-2 rounded my-10 mx-auto container">Predict</button>
            </form>

            {result !== null && (
                <div className="mt-4 text-green-700 font-semibold">
                    Predicted Volume: {result.label}
                </div>
            )}
        </div>
        </div>
    );
}
