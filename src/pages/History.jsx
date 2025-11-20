import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";

export default function History() {
  const { accountId } = useParams();
  const navigate = useNavigate();

  const [account, setAccount] = useState(null);
  const [history, setHistory] = useState(null); // { from_account_id, transaction_count, transactions }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!accountId) {
      setError("Aucun identifiant de compte fourni.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const loadData = async () => {
      setLoading(true);
      setError("");

      try {
        // Infos du compte
        const accRes = await apiClient.get(`/accounts/${accountId}`, {
          signal: controller.signal,
        });

        // Historique des transactions
        // URL fournie par ton back : /transactions/history/{account_id}
        const txRes = await apiClient.get(
        `/transactions/history/${accountId}`,
        {
            signal: controller.signal,
            params: { from_account_id: accountId },
        }
        );

        setAccount(accRes.data || null);
        setHistory(txRes.data || null);
      } catch (err) {
        if (err.name === "CanceledError" || err.name === "AbortError") return;

        console.error("Erreur history:", err.response?.data || err);
        const detail = err?.response?.data?.detail;
        setError(
          typeof detail === "string"
            ? detail
            : "Impossible de charger l'historique des transactions."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();

    return () => controller.abort();
  }, [accountId]);

  const transactions = history?.transactions || [];
  const transactionCount = history?.transaction_count ?? transactions.length;

  const formatType = (type) => {
    if (type === "depot") return "Dépôt";
    if (type === "virement") return "Virement";
    return type;
  };

  const formatDate = (raw) => {
    if (!raw) return "";
    // "2025-11-20 11:05:13" -> "2025-11-20T11:05:13"
    const isoLike = raw.replace(" ", "T");
    const d = new Date(isoLike);
    if (isNaN(d.getTime())) return raw;
    return d.toLocaleString("fr-FR");
  };

  if (loading) {
    return <div className="p-6 text-center">Chargement…</div>;
  }

  if (error) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <Link
          to="/"
          className="text-blue-600 underline mb-4 inline-block"
        >
          ← Retour au dashboard
        </Link>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Link
          to="/"
          className="text-blue-600 underline hover:text-blue-800"
        >
          ← Retour au dashboard
        </Link>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-600 underline"
        >
          Retour
        </button>
      </div>

      <h1 className="text-2xl font-semibold mb-4">
        Historique du compte n° {accountId}
      </h1>

      {account && (
        <div className="bg-white shadow rounded-xl border border-gray-200 p-4 mb-6">
          <p>
            <strong>Type :</strong> {account.account_type}
          </p>
          <p>
            <strong>Solde :</strong>{" "}
            <span className="text-green-600 font-semibold">
              {Number(account.balance).toFixed(2)} €
            </span>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Nombre de transactions : {transactionCount}
          </p>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">Transactions</h2>

      {transactions.length === 0 ? (
        <p className="text-gray-600">
          Aucune transaction trouvée pour ce compte.
        </p>
      ) : (
        <div className="space-y-4">
          {transactions.map((tx, index) => {
            // D'après ton JSON : { type, to_account_id, amount, date, description }
            const isDebit = tx.type === "virement"; // l'argent sort
            const sign = isDebit ? "-" : "+";
            const amountClass = isDebit ? "text-red-600" : "text-green-600";

            return (
              <div
                key={index}
                className="bg-white shadow-md border border-gray-200 rounded-lg p-4"
              >
                <p>
                  <strong>Type :</strong> {formatType(tx.type)}
                </p>

                {tx.type === "virement" && (
                  <p>
                    <strong>Vers :</strong> Compte n° {tx.to_account_id}
                  </p>
                )}

                <p>
                  <strong>Montant :</strong>{" "}
                  <span className={`${amountClass} font-semibold`}>
                    {sign} {Number(tx.amount).toFixed(2)} €
                  </span>
                </p>

                <p>
                  <strong>Date :</strong> {formatDate(tx.date)}
                </p>

                {tx.description && (
                  <p className="text-gray-600 italic mt-1">
                    {tx.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
