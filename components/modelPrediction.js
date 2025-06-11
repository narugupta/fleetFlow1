// "use client";
// import React, { useState } from "react";
// import { predictDemand } from "@/utils/predictor"; 
// import { predictDemand } from "@/app/api/regionDemand/route";
// import { useSelector } from "react-redux";

// export default function DemandPredictor() {
//   const [output, setOutput] = useState("");
//   const formData = useSelector((state) => state.city.value);
//   console.log("Redux form date:", formData.date_input);
//   const input = formData.date_input; 

//   const handlePredict = async () => {
//     const result = await predictDemand(input);
//     setOutput(result);
//   };

//   return (
//     <div>
//       <button onClick={handlePredict}>Predict Demand</button>
//       <div dangerouslySetInnerHTML={{ __html: output }} />
//     </div>
//   );
// }

// const response = await fetch("http://localhost:3000/api/regionDemand", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({ dates_input: "2025-06-10" }),
// });

// const data = await response.json();
// console.log(data.result);

"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";

const DemandPredictor = () => {
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function convertDateFormat(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;

  const [day, month, year] = parts;
  if (!day || !month || !year) return null;

  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}
const selectedDate = useSelector((state) => state.form.value.date_input);
console.log("Selected date from map:", selectedDate);


  const handlePredict = async () => {
    const formattedDate = convertDateFormat(selectedDate);

    setIsLoading(true);
    try {
      const res = await fetch("/api/regionDemand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dates_input: selectedDate }),
      });

      const data = await res.json();
      if (data.result) {
        setResult(data.result);
      } else {
        setResult("Error: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      setResult("Fetch error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <button
        onClick={handlePredict}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {isLoading ? "Predicting..." : "Predict Demand"}
      </button>
       {isLoading && <div className="h-[60vh] flex flex-col items-center justify-center">
        <div>
        <img className="h-[50vh]"  src="https://i.pinimg.com/originals/63/eb/c0/63ebc09daae37481cbdc0aa734202609.gif" alt="" />
        </div>
        The United States spends over $1.5 trillion annually on transportation logistics. </div>}
      <div dangerouslySetInnerHTML={{ __html: result }} className="mt-4" />
    </div>
  );
};

export default DemandPredictor;


