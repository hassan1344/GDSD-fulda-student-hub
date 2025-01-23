import React from "react";
/*
const Disclaimer = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-gray-200 text-gray-700 py-4 z-50">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">
          &copy; 2024 Fulda Student Hub. All rights reserved. This website is
          for educational purposes only. Created by Team 2 of GDSD-AI5088
          (WiSe24/25).
        </p>
      </div>
    </footer>
  );
};

export default Disclaimer;
*/

/* Dev's.N Code */
const Disclaimer = () => {
  const animationStyle = {
    display: "inline-block",
    whiteSpace: "nowrap",
    animation: "marquee 20s linear infinite",
    color: "red", 
  };

  const keyframesStyle = `
    @keyframes marquee {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(100%);
      }
    }
  `;

  return (
    <footer
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        backgroundColor: "rgba(229, 231, 235, 0.5)", // bg-gray-200 with opacity
        padding: "1rem 0",
        zIndex: 50,
        overflow: "hidden",
      }}
    >
      {/* Injecting keyframes directly */}
      <style>{keyframesStyle}</style>
      <div
        style={{
          overflow: "hidden",
          position: "relative",
        }}
      >
        <p style={animationStyle}>
          &copy; 2024 Fulda Student Hub. All rights reserved. This website is
          for educational purposes only. Created by Team 2 of GDSD-AI5088
          (WiSe24/25).
        </p>
      </div>
    </footer>
  );
};

export default Disclaimer;