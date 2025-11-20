import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/apiClient";

export default function DepositForm() {
  const [accounts, setAccounts] = useState([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [accountsError, setAccountsError] = useState("");

  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState("");

  const [formError, setFormError] = useState("");
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // Charger les comptes de l'utilisateur
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

    if (!accountId || !amount) {
      setFormError("Veuillez remplir tous les champs.");
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setFormError("Le montant doit être supérieur à 0.");
      return;
    }

    setIsSubmitting(true);

    try {
      await apiClient.post("/transactions/deposit", {
        from_account_id: Number(accountId),
        amount: numericAmount,
        description: "Dépôt via interface",
      });

      setSuccess("Dépôt effectué avec succès.");

      // petite pause puis retour au dashboard
      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail;

      let message = "Une erreur est survenue lors du dépôt.";
      if (typeof detail === "string") {
        message = detail;
      } else if (Array.isArray(detail) && detail[0]?.msg) {
        // gestion des erreurs de validation Pydantic
        message = detail[0].msg;
      }

      setApiError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl bg-white shadow-md rounded-xl border border-gray-200 p-6">
      <h2 className="text-xl font-semibold mb-4">Effectuer un dépôt</h2>

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
        {/* Compte à créditer */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Compte à créditer
          </label>
          <select
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            disabled={isLoadingAccounts || !accounts.length}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
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
            placeholder="Ex : 100.00"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting || isLoadingAccounts || !accounts.length}
            className="w-full rounded-lg bg-green-600 text-white py-2 text-sm font-medium hover:bg-green-700 disabled:opacity-60 transition-colors"
          >
            {isSubmitting ? "Dépôt en cours..." : "Déposer l'argent"}
          </button>
        </div>
      </form>
    </div>
  );
}
