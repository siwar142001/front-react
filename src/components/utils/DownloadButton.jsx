import { useState } from "react";
import apiClient from "../../api/apiClient";

export default function DownloadButton  ({ accountId }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

 const handleDownload = async () => {
  setIsLoading(true);
  setError(null);

  try {
    // Appel API pour récupérer le fichier en binaire.
    const res = await apiClient.get(`/accounts/${accountId}`,
      { responseType: "blob" }
    );

     const contentType = res.headers.get?.('content-type') || 
                       res.headers['content-type'] || 
                       'application/pdf';

    // Génère url vers le Blob
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `relevé-compte-${accountId}.pdf`; //nom du fichier

// On attache le lien au DOM 
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

  } catch (e) {
    console.error(e);
    setError("Impossible de charger le compte");
  } finally {
    setIsLoading(false);
    }

  };
    return (
        <div 
        className="relative">
      <button
                type="button"
                disabled={isLoading}
                onClick={handleDownload}
                className="inline-flex items-center justify-center rounded-full p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                title="Télécharger le relevé de compte"
            >
            <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-4"
            >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
            </svg>

</button>
      {error && (
        <div className="absolute top-full mt-2 right-0 bg-red-50 text-red-600 text-xs px-3 py-2 rounded shadow-lg whitespace-nowrap z-10">
          {error}
        </div>
      )}

</div> );
};

