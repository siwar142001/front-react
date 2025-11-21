import { useState } from "react";
import apiClient from "../../api/apiClient";

export default function CreateBeneficiaryModal({ isOpen, onClose, onCreated }) {
  const [toAccountId, setToAccountId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // --- Frontend validation ---
    if (!name || !toAccountId) {
      setError("Le nom et le numéro de compte sont obligatoires.");
      setIsLoading(false);
      return;
    }

    if (isNaN(toAccountId)) {
      setError("Le numéro de compte doit être un nombre.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await apiClient.post("/beneficiary/create", {
        to_account_id: toAccountId,
        name,
        description,
      });

      // --- Check API response for valid beneficiary ---
      const newBeneficiary = res.data;

      if (!newBeneficiary || typeof newBeneficiary !== "object" || !newBeneficiary.id) {
        // API returned an error object instead of a valid beneficiary
        setError(
          newBeneficiary?.msg ||
          newBeneficiary?.errors?.[0]?.msg ||
          "Une erreur est survenue lors de la création."
        );
        return;
      }

      // --- Pass valid beneficiary to parent ---
      if (onCreated) onCreated(newBeneficiary);

      // Reset form and close modal
      setName("");
      setToAccountId("");
      setDescription("");
      onClose();
    } catch (err) {
      console.error(err);
      const apiMsg =
        err.response?.data?.detail || "Une erreur est survenue lors de la création du bénéficiaire.";
      setError(apiMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-2">Ajouter un nouveau bénéficiaire</h3>

        {error && (
          <p className="text-sm text-red-500 mb-3">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <p>
            Nom du bénéficiaire
            <input
              type="text"
              value={name}
              placeholder="Nom du bénéficiaire..."
              onChange={(e) => setName(e.target.value)}
              className="border-2 border-blue-500 rounded p-1 w-full mt-1"
            />
          </p>

          <p>
            Numéro du compte bénéficiaire
            <input
              type="text"
              value={toAccountId}
              placeholder="Numéro du compte bénéficiaire..."
              onChange={(e) => setToAccountId(e.target.value)}
              className="border-2 border-blue-500 rounded p-1 w-full mt-1"
            />
          </p>

          <p>
            Description
            <input
              type="text"
              value={description}
              placeholder="Description..."
              onChange={(e) => setDescription(e.target.value)}
              className="border-2 border-blue-500 rounded p-1 w-full mt-1"
            />
          </p>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => !isLoading && onClose()}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
            >
              {isLoading ? "Création..." : "Créer le compte"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
