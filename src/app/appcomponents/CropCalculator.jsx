"use client";

import { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function CropCalculator() {
  const [weightType, setWeightType] = useState("totalWeight");
  const [totalWeight, setTotalWeight] = useState("");
  const [weightPerBag, setWeightPerBag] = useState("");
  const [bags, setBags] = useState("");
  const [wastage, setWastage] = useState("");
  const [pricePerBag, setPricePerBag] = useState("");
  const [cuttingHours, setCuttingHours] = useState("");
  const [cuttingPricePerHour, setCuttingPricePerHour] = useState("");
  const [showModal, setShowModal] = useState(false);

  const pdfRef = useRef(null);

  const calculatedTotalWeight =
    weightType === "totalWeight" ? totalWeight : weightPerBag * bags;

  const netAmount = bags * pricePerBag - wastage * pricePerBag;
  const finalAmount = netAmount - cuttingHours * cuttingPricePerHour;

  const handleCalculate = () => {
    if (
      (weightType === "totalWeight" && !totalWeight) ||
      (weightType === "weightPerBag" && (!weightPerBag || !bags)) ||
      !wastage ||
      !pricePerBag ||
      !cuttingHours ||
      !cuttingPricePerHour
    ) {
      alert("Please fill all the required fields.");
      return;
    }
    setShowModal(true);
  };

  const handleGeneratePDF = async () => {
    try {
        
      const input = pdfRef.current;
      if (!input) return;
      // Set backgroundColor option to white
      const canvas = await html2canvas(input, {
        scale: 2,
        backgroundColor: "#ffffff", // Forces a white background
        useCORS: true, // Ensures cross-origin images are handled properly
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      pdf.text("Crop Amount Calculation", 10, 15);
      const imgWidth = 180;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 10, 25, imgWidth, imgHeight);
      pdf.save("Crop_Amount_Calculation.pdf");
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const handleReset = () => {
    setWeightType("totalWeight");
    setTotalWeight("");
    setWeightPerBag("");
    setBags("");
    setWastage("");
    setPricePerBag("");
    setCuttingHours("");
    setCuttingPricePerHour("");
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-[#1a202c] text-white flex flex-col items-center justify-center p-6">

      <h1 className="text-3xl font-extrabold mb-8 text-center">Crop Amount Calculator</h1>

      {/* Form Section */}
      <div className="bg-gray-800 rounded-xl shadow-xl p-8 w-full max-w-md">
        <label className="block mb-3 font-semibold">Select Weight Type:</label>
        <div className="flex gap-4 mb-5">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="totalWeight"
              checked={weightType === "totalWeight"}
              onChange={() => setWeightType("totalWeight")}
              className="accent-green-500"
            />
            <span>Total Weight</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="weightPerBag"
              checked={weightType === "weightPerBag"}
              onChange={() => setWeightType("weightPerBag")}
              className="accent-green-500"
            />
            <span>Weight per Bag</span>
          </label>
        </div>

        {weightType === "totalWeight" ? (
          <input
            type="number"
            value={totalWeight}
            onChange={(e) => setTotalWeight(e.target.value)}
            className="w-full p-3 mb-5 rounded border border-[#4a5568] bg-gray-700 placeholder-gray-400"
            placeholder="Enter Total Weight (kg)"
          />
        ) : (
          <input
            type="number"
            value={weightPerBag}
            onChange={(e) => setWeightPerBag(e.target.value)}
            className="w-full p-3 mb-5 rounded border border-[#4a5568] bg-gray-700 placeholder-gray-400"
            placeholder="Enter Weight per Bag (kg)"
          />
        )}

        <label className="block mb-2 font-semibold">Total Number of Bags</label>
        <input
          type="number"
          value={bags}
          onChange={(e) => setBags(e.target.value)}
          className="w-full p-3 mb-5 rounded border border-[#4a5568] bg-gray-700 placeholder-gray-400"
          placeholder="Enter Number of Bags"
        />

        <label className="block mb-2 font-semibold">Wastage per Bag (kg)</label>
        <input
          type="number"
          value={wastage}
          onChange={(e) => setWastage(e.target.value)}
          className="w-full p-3 mb-5 rounded border border-[#4a5568] bg-gray-700 placeholder-gray-400"
          placeholder="Enter Wastage per Bag"
        />

        <label className="block mb-2 font-semibold">Price per Bag (₹)</label>
        <input
          type="number"
          value={pricePerBag}
          onChange={(e) => setPricePerBag(e.target.value)}
          className="w-full p-3 mb-5 rounded border border-[#4a5568] bg-gray-700 placeholder-gray-400"
          placeholder="Enter Price per Bag"
        />

        <label className="block mb-2 font-semibold">Crop Cutting Hours</label>
        <input
          type="number"
          value={cuttingHours}
          onChange={(e) => setCuttingHours(e.target.value)}
          className="w-full p-3 mb-5 rounded border border-[#4a5568] bg-gray-700 placeholder-gray-400"
          placeholder="Enter Cutting Hours"
        />

        <label className="block mb-2 font-semibold">Price per Hour (₹)</label>
        <input
          type="number"
          value={cuttingPricePerHour}
          onChange={(e) => setCuttingPricePerHour(e.target.value)}
          className="w-full p-3 mb-5 rounded border border-[#4a5568] bg-gray-700 placeholder-gray-400"
          placeholder="Enter Price per Hour"
        />

        <button
          onClick={handleCalculate}
          className="w-full bg-green-500 py-3 rounded font-bold hover:bg-green-600 transition-colors"
        >
          Calculate
        </button>

        <button
          onClick={handleReset}
          className="w-full bg-red-500 py-3 rounded font-bold hover:bg-red-600 transition-colors mt-4"
        >
          Reset
        </button>
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div
            className="bg-white text-black rounded-xl shadow-2xl p-8 w-full max-w-lg relative"
            style={{ backgroundColor: "#ffffff" }}
            ref={pdfRef}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-2xl font-bold text-gray-600 hover:text-gray-800"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-6">Crop Amount Breakdown</h2>
            <p className="mb-2">
              Total Weight: <span className="font-semibold">{calculatedTotalWeight} kg</span>
            </p>
            <p className="mb-2">
              Total Bags: <span className="font-semibold">{bags}</span>
            </p>
            <p className="mb-2">
              Total Wastage: <span className="font-semibold">{bags * wastage} kg</span>
            </p>
            <p className="mb-2">
              Net Amount: <span className="font-semibold">₹{netAmount}</span>
            </p>
            <p className="mb-2">
              Crop Cutting Cost: <span className="font-semibold">₹{cuttingHours * cuttingPricePerHour}</span>
            </p>
            <p className="mb-4 text-lg font-bold">
              Final Amount Paid to Farmer:{" "}
              <span className="text-green-700">₹{finalAmount}</span>
            </p>
            <button
              onClick={handleGeneratePDF}
              className="w-full bg-blue-500 py-3 rounded font-bold text-white hover:bg-blue-600 transition-colors"
            >
              Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
