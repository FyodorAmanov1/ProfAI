import React, { useState } from "react";

/**
 * Minimal playground: code editor (textarea) + run button + option to use server grader.
 * For a real product, replace textarea with Monaco/CodeMirror.
 */
export default function Playground({ task, onSubmit }) {
  const [code, setCode] = useState("// write function add(a,b) { return a + b; }");

  async function handleSubmit(useServer = false) {
    if (typeof onSubmit === "function") {
      return onSubmit(code, useServer);
    }
  }

  return (
    <div>
      <textarea value={code} onChange={e => setCode(e.target.value)} rows={8} style={{width:"100%"}} />
      <div style={{marginTop:8}}>
        <button onClick={() => handleSubmit(false)}>Run locally</button>
        {" "}
        <button onClick={() => handleSubmit(true)}>Submit to server</button>
      </div>
    </div>
  );
}
