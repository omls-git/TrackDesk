import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { formattedIST } from "../Utility";

const DateEditor = forwardRef((editorProps, ref)=> {
  const { value, onUpdate, ...rest } = editorProps
  const inputRef = useRef(null);
   
  useImperativeHandle(ref, () => ({
    getValue: () => inputRef.current.value
  }));
  let date = value ? value.split('T')[0] : ''  
  return (
    <input
    {...rest}
    key='date'
      type="date"
      ref={inputRef}
      defaultValue={date || ""}
      onChange={(e) => onUpdate && onUpdate(formattedIST(inputRef.current.value))}
      style={{ width: "100%" }}
    />
  );
})

export default DateEditor