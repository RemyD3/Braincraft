
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  document.body.innerHTML = '<div style="color:red; padding: 20px;">Error: Root element not found.</div>';
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (err) {
  console.error("Render error:", err);
  rootElement.innerHTML = `<div style="color:red; padding: 20px;"><h1>Application Error</h1><pre>${err instanceof Error ? err.message : String(err)}</pre></div>`;
}
