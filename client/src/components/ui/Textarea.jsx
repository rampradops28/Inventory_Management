import React from "react";

export function Textarea({ className, ...props }) {
  return <textarea className={`border p-2 rounded-md ${className}`} {...props} />;
}

export default Textarea;
