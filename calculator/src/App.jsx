import React, { useState, useEffect } from "react";
import { Calculator as CalcIcon } from "lucide-react";

// Main Calculator component
const Calculator = () => {
  // States for display input, memory storage, and active keyboard button
  const [input, setInput] = useState("0");
  const [memory, setMemory] = useState(null);
  const [activeButton, setActiveButton] = useState(null);

  // Append value to the input display
  const appendValue = (value) => {
    if (input === "0" || input === "Error") {
      setInput(value);
    } else {
      setInput(input + value);
    }
  };

  // Clear the entire display
  const clearDisplay = () => {
    setInput("0");
  };

  // Delete the last character
  const deleteLast = () => {
    const newInput = input.slice(0, -1);
    setInput(newInput || "0");
  };

  // Evaluate the current expression and update display
  const calculate = () => {
    try {
      // Replace % with equivalent fraction
      const expression = input.replace(/(\d+)%/g, "($1/100)");
      const result = eval(expression); // Use eval to calculate
      if (!isFinite(result)) throw new Error("Invalid calculation");

      // Show up to 10 decimal places
      setInput(parseFloat(result.toFixed(10)).toString());
    } catch {
      setInput("Error"); // Display error on invalid expression
    }
  };

  // Handle memory operations: M+, M-, MR, MC
  const handleMemory = (action) => {
    const num = parseFloat(input);
    if (isNaN(num)) return;

    switch (action) {
      case "M+":
        setMemory((memory ?? 0) + num);
        break;
      case "M-":
        setMemory((memory ?? 0) - num);
        break;
      case "MR":
        if (memory !== null) setInput(memory.toString());
        break;
      case "MC":
        setMemory(null);
        break;
    }
  };

  // Handle square root operation
  const handleSqrt = () => {
    const num = parseFloat(input);
    if (isNaN(num) || num < 0) {
      setInput("Error");
    } else {
      setInput(Math.sqrt(num).toString());
    }
  };

  // Handle keyboard inputs
  const handleKeyDown = (e) => {
    const key = e.key;

    // Highlight the key temporarily
    setActiveButton(key);
    setTimeout(() => setActiveButton(null), 150);

    // Append numbers or operators
    if (/\d/.test(key) || ["+", "-", "*", "/", ".", "%"].includes(key)) {
      appendValue(key);
    }
    // Calculate result on Enter or =
    else if (key === "Enter" || key === "=") {
      e.preventDefault();
      calculate();
    }
    // Backspace deletes last character
    else if (key === "Backspace") {
      e.preventDefault();
      deleteLast();
    }
    // Clear display on Escape or 'c'
    else if (key.toLowerCase() === "c" || key === "Escape") {
      clearDisplay();
    }
  };

  // Register keyboard listener on mount
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [input]);

  // Reusable Button component
  const Button = ({
    label,
    onClick,
    variant = "number",
    className = "",
    isActive = false,
  }) => {
    const baseClasses =
      "h-14 rounded-xl font-semibold text-lg transition-all duration-200 transform active:scale-95 shadow-sm";

    const variantClasses = {
      number:
        "bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 hover:border-gray-300",
      operator: "bg-blue-500 hover:bg-blue-600 text-white shadow-blue-200",
      special: "bg-gray-500 hover:bg-gray-600 text-white",
      equals: "bg-green-500 hover:bg-green-600 text-white shadow-green-200",
      clear: "bg-red-500 hover:bg-red-600 text-white shadow-red-200",
    };

    const activeClasses = isActive
      ? "scale-95 shadow-inner"
      : "hover:shadow-md";

    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${variantClasses[variant]} ${activeClasses} ${className}`}
      >
        {label}
      </button>
    );
  };

  // Main calculator layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20 w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <CalcIcon className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">Calculator</h1>
        </div>

        {/* Display section */}
        <div className="bg-gray-900 text-white text-right text-2xl p-6 mb-6 rounded-2xl shadow-inner font-mono overflow-hidden">
          <div className="overflow-x-auto whitespace-nowrap">{input}</div>
        </div>

        {/* Memory display */}
        {memory !== null && (
          <div className="text-xs text-blue-600 text-center mb-2 font-medium">
            Memory: {memory}
          </div>
        )}

        {/* Buttons grid */}
        <div className="grid grid-cols-4 gap-3">
          {/* Memory buttons */}
          <Button
            label="MC"
            onClick={() => handleMemory("MC")}
            variant="special"
            isActive={activeButton === "MC"}
          />
          <Button
            label="MR"
            onClick={() => handleMemory("MR")}
            variant="special"
            isActive={activeButton === "MR"}
          />
          <Button
            label="M+"
            onClick={() => handleMemory("M+")}
            variant="special"
            isActive={activeButton === "M+"}
          />
          <Button
            label="M-"
            onClick={() => handleMemory("M-")}
            variant="special"
            isActive={activeButton === "M-"}
          />

          {/* Clear, sqrt, %, ÷ */}
          <Button
            label="C"
            onClick={clearDisplay}
            variant="clear"
            isActive={activeButton === "c" || activeButton === "C"}
          />
          <Button
            label="√"
            onClick={handleSqrt}
            variant="special"
            isActive={activeButton === "√"}
          />
          <Button
            label="%"
            onClick={() => appendValue("%")}
            variant="operator"
            isActive={activeButton === "%"}
          />
          <Button
            label="÷"
            onClick={() => appendValue("/")}
            variant="operator"
            isActive={activeButton === "/"}
          />

          {/* Number and operator buttons */}
          <Button
            label="7"
            onClick={() => appendValue("7")}
            isActive={activeButton === "7"}
          />
          <Button
            label="8"
            onClick={() => appendValue("8")}
            isActive={activeButton === "8"}
          />
          <Button
            label="9"
            onClick={() => appendValue("9")}
            isActive={activeButton === "9"}
          />
          <Button
            label="×"
            onClick={() => appendValue("*")}
            variant="operator"
            isActive={activeButton === "*"}
          />

          <Button
            label="4"
            onClick={() => appendValue("4")}
            isActive={activeButton === "4"}
          />
          <Button
            label="5"
            onClick={() => appendValue("5")}
            isActive={activeButton === "5"}
          />
          <Button
            label="6"
            onClick={() => appendValue("6")}
            isActive={activeButton === "6"}
          />
          <Button
            label="−"
            onClick={() => appendValue("-")}
            variant="operator"
            isActive={activeButton === "-"}
          />

          <Button
            label="1"
            onClick={() => appendValue("1")}
            isActive={activeButton === "1"}
          />
          <Button
            label="2"
            onClick={() => appendValue("2")}
            isActive={activeButton === "2"}
          />
          <Button
            label="3"
            onClick={() => appendValue("3")}
            isActive={activeButton === "3"}
          />
          <Button
            label="+"
            onClick={() => appendValue("+")}
            variant="operator"
            isActive={activeButton === "+"}
          />

          {/* Zero, dot, equal */}
          <Button
            label="0"
            onClick={() => appendValue("0")}
            className="col-span-2"
            isActive={activeButton === "0"}
          />
          <Button
            label="."
            onClick={() => appendValue(".")}
            isActive={activeButton === "."}
          />
          <Button
            label="="
            onClick={calculate}
            variant="equals"
            isActive={activeButton === "Enter" || activeButton === "="}
          />
        </div>

        {/* Footer info */}
        <div className="mt-6 text-xs text-gray-500 text-center">
          <p>Keyboard shortcuts: Numbers, +, −, ×, ÷, Enter, C, Backspace</p>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
