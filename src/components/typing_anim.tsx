import React from "react";

const BouncingDotsAnimation = () => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          style={{
            width: "0.5rem",
            height: "0.5rem",
            backgroundColor: "#737373",
            borderRadius: "50%",
            animationName: "bounce",
            animationDelay: `${index * 0.2}s`,
            animationDuration: "0.8s",
            animationIterationCount: "infinite",
            animationTimingFunction: "ease-in-out",
          }}
        />
      ))}
    </div>
  );
};

export default BouncingDotsAnimation;
