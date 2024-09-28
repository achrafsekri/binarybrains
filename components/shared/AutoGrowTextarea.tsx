import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";

const AutoGrowTextArea = (props: {
  onChange: (text: string) => void;
  Value: string;
  placeholder: string;
  className:string
}) => {
  const [text, setText] = useState(props.Value); // State to hold text area value
  const textAreaRef = useRef(null); // Ref for the textarea

  // Function to adjust the height of the textarea
  const adjustHeight = () => {
    const textArea = textAreaRef.current;
    //@ts-ignore
    textArea!.style.height = "auto"; // Reset the height
    //@ts-ignore
    textArea!.style.height = `${textArea?.scrollHeight}px`; // Set it based on scroll height
  };

  // Effect to adjust height when content changes
  useEffect(() => {
    adjustHeight();
  }, [text]);

  return (
    <textarea
      ref={textAreaRef}
      className={cn("w-full resize-none overflow-hidden rounded-md border border-gray-300 p-2",props.className)}
      rows={1} // Initial number of rows
      value={props.Value || text}
      placeholder={props.placeholder || ""}
      onChange={(e) => {
        setText(e.target.value);
        props.onChange(e.target.value);
      }} // Handle text input change
      style={{ overflow: "hidden" }} // Ensure no scrollbars appear
    />
  );
};

export default AutoGrowTextArea;
