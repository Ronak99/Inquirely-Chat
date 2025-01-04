import React from "react";

const BouncingDotsAnimation = () => {
  return (
    <div className="flex items-center space-x-1">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className="w-2 h-2  bg-neutral-500 rounded-full animate-bounce"
          style={{
            animationDelay: `${index * 0.2}s`,
            animationDuration: "0.8s",
          }}
        />
      ))}
    </div>
  );
};

export default BouncingDotsAnimation;
