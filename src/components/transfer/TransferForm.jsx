import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/apiClient";
import Notification from "../utils/Notification";
import BeneficiariesScroller from "../beneficiaries/BeneficiariesScroller";

export default function TransferForm() {
  const [accounts, setAccounts] = useState([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [accountsError, setAccountsError] = useState("");

  const [beneficiaryId, setBeneficiaryId] = useState("");

  const [sourceId, setSourceId] = useState("");
  const [amount, setAmount] = useState("");

  const [formError, setFormError] = useState("");
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // Charger les comptes pour la liste déroulante
  useEffect(() => {
    const loadAccounts = async () => {
      setIsLoadingAccounts(true);
      setAccountsError("");
      try {
        const res = await apiClient.get("/accounts/me");
        setAccounts(res.data || []);
      } catch (e) {
        console.error(e);
        setAccountsError("Impossible de charger vos comptes.");
      } finally {
        setIsLoadingAccounts(false);
      }
    };

    loadAccounts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setApiError("");
    setSuccess("");

    if (!sourceId || !beneficiaryId || !amount) {
      setFormError("Veuillez remplir tous les champs.");
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setFormError("Le montant doit être supérieur à 0.");
      return;
    }

    if (sourceId === beneficiaryId) {
      setFormError("Le compte source et le compte destinataire doivent être différents.");
      return;
    }

    setIsSubmitting(true);

    try {
      await apiClient.post("/transactions/transfer", {
        from_account_id: Number(sourceId),
        to_account_id: Number(beneficiaryId),
        amount: numericAmount,
      });

      setSuccess("Virement effectué avec succès.");

      // petite pause optionnelle pour laisser voir le message
      setTimeout(() => {
        navigate("/"); // retour au dashboard
      }, 1000);
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail;
      setApiError(
        typeof detail === "string"
          ? detail
          : "Une erreur est survenue lors du virement."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-150 bg-white shadow-md rounded-xl border border-gray-200 p-6">
      <h2 className="text-xl font-semibold mb-4">Effectuer un virement</h2>

      {accountsError && (
        <p className="text-sm text-red-500 mb-3">{accountsError}</p>
      )}

      {success && (
        <p className="text-sm text-green-600 mb-3">{success}</p>
      )}

      {formError && (
        <p className="text-sm text-red-500 mb-3">{formError}</p>
      )}

      {apiError && (
        <p className="text-sm text-red-500 mb-3">{apiError}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Compte source */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Compte source
          </label>
          <select
            value={sourceId}
            onChange={(e) => setSourceId(e.target.value)}
            disabled={isLoadingAccounts || !accounts.length}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">Sélectionnez un compte</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {`Compte n°${acc.id} • ${acc.account_type} • ${acc.balance.toFixed(
                  2
                )} €`}
              </option>
            ))}
          </select>
        </div>

        {<BeneficiariesScroller beneficiaryId={beneficiaryId} setBeneficiaryId={setBeneficiaryId}/>}

        {/* Montant */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Montant
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Ex : 50.00"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting || isLoadingAccounts || !accounts.length}
            className="w-full rounded-lg bg-blue-600 text-white py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-60 transition-colors"
          >
            {isSubmitting ? "Virement en cours..." : "Envoyer l'argent"}
          </button>
        </div>
      </form>

      <button className=" mt-10 w-full rounded-lg bg-blue-600 text-white py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-60 transition-colors" onClick={() => navigate("/beneficiaries")}>Gérer les bénéficiaires</button>

      {success ? <Notification active={success} setActive={setSuccess} text="Transaction réussie"/> : null}
    </div>
  );
}