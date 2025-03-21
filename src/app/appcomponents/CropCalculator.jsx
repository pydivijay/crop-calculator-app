"use client";

import { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Image from "next/image";

export default function CropCalculator() {
  const [weightType, setWeightType] = useState("totalWeight");
  const [totalWeight, setTotalWeight] = useState("");
  const [weightPerBag, setWeightPerBag] = useState("");
  const [bags, setBags] = useState("");
  const [wastage, setWastage] = useState("");
  const [wastePerTonne, setWastePerTonne] = useState("");
  const [pricePerBag, setPricePerBag] = useState("");
  const [cuttingHours, setCuttingHours] = useState("");
  const [cuttingPricePerHour, setCuttingPricePerHour] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [priceType, setPriceType] = useState("pricePerBag");
  const [totalAmountForPutti, setTotalAmountForPutti] = useState("");

  const pdfRef = useRef(null);

  const validateForm = () => {
    const newErrors = {};

    if (weightType === "totalWeight" && !totalWeight) {
      newErrors.totalWeight = "Total Weight is required.";
    } else if (weightType === "weightPerBag" && (!weightPerBag || !bags)) {
      if (!weightPerBag) newErrors.weightPerBag = "Weight per Bag is required.";
      if (!bags) newErrors.bags = "Number of Bags is required.";
    }

    if (!wastage) newErrors.wastage = "Wastage per Bag is required.";
    //if (!pricePerBag) newErrors.pricePerBag = "Price per Bag is required.";
    if (!cuttingHours) newErrors.cuttingHours = "Cutting Hours is required.";
    if (!cuttingPricePerHour)
      newErrors.cuttingPricePerHour = "Price per Hour is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validateForm()) return;
    setShowModal(true);
  };

  const calculatedTotalWeight =
    weightType === "totalWeight" ? totalWeight : weightPerBag * bags;

  const totalWaste = wastePerTonne
    ? calculatedTotalWeight * (wastePerTonne / 1000)
    : 0;
    const netWeight = calculatedTotalWeight - totalWaste -bags * wastage;

    const netAmount =
      priceType === "pricePerBag"
        ? bags * pricePerBag
        : (netWeight / 860) * totalAmountForPutti;
  
    const finalAmount = netAmount - cuttingHours * cuttingPricePerHour;

  const handleGeneratePDF = async () => {
    try {
      const input = pdfRef.current;
      if (!input) return;
      const canvas = await html2canvas(input, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
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
    setWastePerTonne("");
    setPricePerBag("");
    setCuttingHours("");
    setCuttingPricePerHour("");
    setShowModal(false);
    setErrors({});
    setTotalAmountForPutti("");
  };

  return (
    <div className="min-h-screen bg-[#1a202c] text-white flex flex-col items-center justify-center p-6">
       <div className="flex justify-center mb-4">
          <Image
            src="/VijayLogo.jpg"
            alt="Vijay Kumar Pydi Logo"
            width={100}
            height={100}
            className="rounded-full shadow-lg border-4 border-blue-500"
          />
        </div>
      <h1 className="text-3xl font-extrabold mb-8 text-center">
        Crop Amount Calculator
      </h1>

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
          <div>
            <input
              type="number"
              value={totalWeight}
              onChange={(e) => setTotalWeight(e.target.value)}
              className="w-full p-3 mb-2 rounded border border-[#4a5568] bg-gray-700 placeholder-gray-400"
              placeholder="Enter Total Weight (kg)"
            />
            {errors.totalWeight && (
              <p className="text-red-500 text-sm mb-3">{errors.totalWeight}</p>
            )}
          </div>
        ) : (
          <div>
            <input
              type="number"
              value={weightPerBag}
              onChange={(e) => setWeightPerBag(e.target.value)}
              className="w-full p-3 mb-2 rounded border border-[#4a5568] bg-gray-700 placeholder-gray-400"
              placeholder="Enter Weight per Bag (kg)"
            />
            {errors.weightPerBag && (
              <p className="text-red-500 text-sm mb-3">{errors.weightPerBag}</p>
            )}
          </div>
        )}

        <label className="block mb-2 font-semibold">Total Number of Bags</label>
        <input
          type="number"
          value={bags}
          onChange={(e) => setBags(e.target.value)}
          className="w-full p-3 mb-2 rounded border border-[#4a5568] bg-gray-700 placeholder-gray-400"
          placeholder="Enter Number of Bags"
        />
        {errors.bags && (
          <p className="text-red-500 text-sm mb-3">{errors.bags}</p>
        )}

        <label className="block mb-2 font-semibold">Wastage per Bag (kg)</label>
        <input
          type="number"
          value={wastage}
          onChange={(e) => setWastage(e.target.value)}
          className="w-full p-3 mb-2 rounded border border-[#4a5568] bg-gray-700 placeholder-gray-400"
          placeholder="Enter Wastage per Bag"
        />
        {errors.wastage && (
          <p className="text-red-500 text-sm mb-3">{errors.wastage}</p>
        )}

        <label className="block mb-2 font-semibold">Waste per Tonne (kg)</label>
        <input
          type="number"
          value={wastePerTonne}
          onChange={(e) => setWastePerTonne(e.target.value)}
          className="w-full p-3 mb-2 rounded border border-[#4a5568] bg-gray-700 placeholder-gray-400"
          placeholder="Enter Waste per Tonne"
        />

        <label className="block mb-3 font-semibold">Select Price Type:</label>
        <div className="flex gap-4 mb-5">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="pricePerBag"
              checked={priceType === "pricePerBag"}
              onChange={() => setPriceType("pricePerBag")}
              className="accent-green-500"
            />
            <span>Price per Bag</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="totalAmountForPutti"
              checked={priceType === "totalAmountForPutti"}
              onChange={() => setPriceType("totalAmountForPutti")}
              className="accent-green-500"
            />
            <span>Total Amount for Putti</span>
          </label>
        </div>

        {priceType === "pricePerBag" ? (
          <>
            <label className="block mb-2 font-semibold">
              Price per Bag (₹)
            </label>
            <input
              type="number"
              value={pricePerBag}
              onChange={(e) => setPricePerBag(e.target.value)}
              className="w-full p-3 mb-2 rounded border border-[#4a5568] bg-gray-700 placeholder-gray-400"
              placeholder="Enter Price per Bag"
            />
            {errors.pricePerBag && (
              <p className="text-red-500 text-sm mb-3">{errors.pricePerBag}</p>
            )}
          </>
        ) : (
          <>
            <label className="block mb-2 font-semibold">
              Total Amount for Putti (₹)
            </label>
            <input
              type="number"
              value={totalAmountForPutti}
              onChange={(e) => setTotalAmountForPutti(e.target.value)}
              className="w-full p-3 mb-2 rounded border border-[#4a5568] bg-gray-700 placeholder-gray-400"
              placeholder="Enter Total Amount for Putti"
            />
            {errors.totalAmountForPutti && (
              <p className="text-red-500 text-sm mb-3">
                {errors.totalAmountForPutti}
              </p>
            )}
          </>
        )}

        <label className="block mb-2 font-semibold">Crop Cutting Hours</label>
        <input
          type="number"
          value={cuttingHours}
          onChange={(e) => setCuttingHours(e.target.value)}
          className="w-full p-3 mb-2 rounded border border-[#4a5568] bg-gray-700 placeholder-gray-400"
          placeholder="Enter Cutting Hours"
        />
        {errors.cuttingHours && (
          <p className="text-red-500 text-sm mb-3">{errors.cuttingHours}</p>
        )}

        <label className="block mb-2 font-semibold">Price per Hour (₹)</label>
        <input
          type="number"
          value={cuttingPricePerHour}
          onChange={(e) => setCuttingPricePerHour(e.target.value)}
          className="w-full p-3 mb-5 rounded border border-[#4a5568] bg-gray-700 placeholder-gray-400"
          placeholder="Enter Price per Hour"
        />
        {errors.cuttingPricePerHour && (
          <p className="text-red-500 text-sm mb-3">
            {errors.cuttingPricePerHour}
          </p>
        )}

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
              Total Weight:{" "}
              <span className="font-semibold">{calculatedTotalWeight} kg</span>
            </p>
            <p className="mb-2">
              Total Tonne Waste:{" "}
              <span className="font-semibold">{totalWaste} kg</span>
            </p>
            <p className="mb-2">
              Net Weight: <span className="font-semibold">{netWeight} kg</span>
            </p>
            <p className="mb-2">
              Total Bags: <span className="font-semibold">{bags}</span>
            </p>
            <p className="mb-2">
              Total Wastage:{" "}
              <span className="font-semibold">{bags * wastage} kg</span>
            </p>
            <p className="mb-2">
              Net Amount: <span className="font-semibold">₹{netAmount.toFixed(2)}</span>
            </p>
            <p className="mb-2">
              Crop Cutting Cost:{" "}
              <span className="font-semibold">
                ₹{cuttingHours * cuttingPricePerHour}
              </span>
            </p>
            <p className="mb-4 text-lg font-bold">
              Final Amount Paid to Farmer:{" "}
              <span className="text-green-700">₹{finalAmount.toFixed(2)}</span>
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
