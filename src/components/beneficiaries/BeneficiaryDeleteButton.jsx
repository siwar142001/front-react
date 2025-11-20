import { useState } from "react";
import apiClient from "../../api/apiClient";

export default function DeleteButton({ deletedId, onDeleted }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleConfirmDelete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // appelle l'endpoint FastAPI de clôture
      await apiClient.delete(`/beneficiary/delete/${deletedId}`);

      // on ferme la modale
      setIsOpen(false);

      // on prévient le parent que le compte est supprimé
      if (onDeleted) {
        onDeleted(deletedId);
      }
    } catch (e) {
      console.error(e);
      setError("Impossible de clôturer ce compte. Réessayez plus tard.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Bouton poubelle */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center rounded-full p-2 text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
        title="Clôturer ce compte"
      >
        {/* Icône poubelle */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8.5 3a1.5 1.5 0 00-1.415 1H5a.75.75 0 000 1.5h10a.75.75 0 000-1.5h-2.085A1.5 1.5 0 0011.5 3h-3zM6.25 7A.75.75 0 017 7.75v6.5a.75.75 0 01-1.5 0v-6.5A.75.75 0 016.25 7zM10 7a.75.75 0 01.75.75v6.5a.75.75 0 01-1.5 0v-6.5A.75.75 0 0110 7zm3.75 0A.75.75 0 0114.5 7.75v6.5a.75.75 0 01-1.5 0v-6.5A.75.75 0 0113.75 7z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* popup de de confirmation */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-2">
              Supprimer ce bénéficiaire ?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Cette action va supprimer ce bénéficiaire. Cette opération est irréversible.
            </p>

            {error && (
              <p className="text-sm text-red-500 mb-3">
                {error}
              </p>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => !isLoading && setIsOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isLoading}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 transition-colors"
              >
                {isLoading ? "Clôture..." : "Clôturer le compte"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
