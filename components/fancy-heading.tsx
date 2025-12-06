"use client";

import React, { useEffect, useState } from "react";
import { useStyling, FONT_FAMILIES } from "@/lib/styling-context";

interface FancyHeadingProps {
  children: React.ReactNode;
}

const FancyHeading: React.FC<FancyHeadingProps> = ({ children }) => {
  const { headingFont, headingColor, headingStyle } = useStyling();
  const [currentFont, setCurrentFont] = useState(headingFont);
  const [currentColor, setCurrentColor] = useState(headingColor);

  useEffect(() => {
    setCurrentFont(headingFont);
  }, [headingFont]);

  useEffect(() => {
    setCurrentColor(headingColor);
  }, [headingColor]);

  const getStyles = () => {
    const baseStyles = `text-base font-bold my-2 uppercase ${FONT_FAMILIES[currentFont]}`;
    
    if (headingStyle === 'background') {
      return `${baseStyles} bg-muted px-2 py-1 rounded`;
    }
    
    if (headingStyle === 'border-top') {
      return `${baseStyles} border-t border-gray-200 pt-2`;
    }
    
    return `${baseStyles} border-b border-gray-200 pb-2`;
  };

  return (
    <h2
      className={getStyles()}
      style={{ 
        color: currentColor,
      }}
    >
      {children}
    </h2>
  );
};

export default FancyHeading;