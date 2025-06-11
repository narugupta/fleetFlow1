"use client";

import React,{Suspense} from 'react'
import "./page.css"
import { useSearchParams } from "next/navigation";
import DemandPredictor from "@/components/modelPrediction";



const OptimisationContent = () => {
    const searchParams = useSearchParams();
  const volume = searchParams.get("volume");
  return (
    
    <div className='optimisation-page'>
        <div className="optimisation-heading">
            Our Optimised Solution
        </div>
      <div className='ship-demand bg-gray-200'>
           <div className="p-1">
      <div className="predicted-volume text-lg">Predicted Volume</div>
      {volume ? (
        <div className="volume text-lg text-green-600">{volume}</div>
      ) : (
        <p className="text-red-600">No prediction result found.</p>
      )}
    </div>
      </div>
      <div className="demand-map bg-gray-200">
         <DemandPredictor />
      </div>
    </div>
  )
}

export default function Page(){
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OptimisationContent />
    </Suspense>
  );
}
