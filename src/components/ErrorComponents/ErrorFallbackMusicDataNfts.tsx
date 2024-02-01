import React from "react";

const ErrorFallbackMusicDataNfts: React.FC<{ error: Error }> = ({ error }) => (
  <div className="border bg-muted  border-accent p-12 my-4">
    <h2>Something went wrong. With the structure of the manifest file</h2>
    <p>{error.message}</p>

    <button className="mx-auto my-auto flex border border-white p-2 rounded-full" onClick={() => window.location.reload()}>
      Try again
    </button>
  </div>
);

export default ErrorFallbackMusicDataNfts;
