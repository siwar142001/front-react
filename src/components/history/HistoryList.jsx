import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import apiClient from "../../api/apiClient";

export default function HistoryList() {
  const { accountId } = useParams();
  const navigate = useNavigate();

  const [account, setAccount] = useState(null);
  const [history, setHistory] = useState(null); // { from_account_id, transaction_count, transactions }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");

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
        const txRes = await apiClient.get(`/transactions/history/${accountId}`, {
          signal: controller.signal,
          params: { from_account_id: accountId },
        });

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
    const isoLike = raw.replace(" ", "T");
    const d = new Date(isoLike);
    if (isNaN(d.getTime())) return raw;
    return d.toLocaleString("fr-FR");
  };

  // Téléchargement du relevé PDF
  const handleDownloadStatement = async () => {
    setDownloadError("");
    setIsDownloading(true);

    try {
      // À ADAPTER si ton endpoint est différent
      const res = await apiClient.get(
        `/transactions/history/${accountId}/statement`,
        {
          responseType: "blob", // on récupère un binaire (PDF)
        }
      );

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `releve_compte_${accountId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erreur téléchargement relevé:", err.response?.data || err);
      const detail = err?.response?.data?.detail;
      setDownloadError(
        typeof detail === "string"
          ? detail
          : "Impossible de télécharger le relevé de compte."
      );
    } finally {
      setIsDownloading(false);
    }
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
    <div className="min-h-screen h-full w-screen bg-slate-200">
    <div className="px-6 py-6 mx-auto w-fit">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">
          Historique du compte n° {accountId}
        </h1>
        <button
          onClick={handleDownloadStatement}
          disabled={isDownloading}
          className="flex items-center px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium bg-white hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isDownloading ? "Téléchargement..." : "Télécharger le relevé"}
        </button>
      </div>

      {downloadError && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded w-fit">
          {downloadError}
        </div>
      )}

      {account && (
        <div className="bg-white shadow rounded-xl border border-gray-200 p-4 mb-6 w-150">
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
            const isDebit = tx.type === "virement";
            const sign = isDebit ? accountId === tx.to_account_id.toFixed() ? "+" : "-" : "+";
            
            const amountClass = isDebit ? accountId === tx.to_account_id.toFixed() ? "text-green-600" : "text-red-600" : "text-green-600";
            const formattedDate = tx.date
              ? new Date(tx.date.replace(" ", "T")).toLocaleString("fr-FR")
              : "";

            return (
              <Link
                key={index}
                to={`/transactions/history/${accountId}/${index}`}
                state={{ tx, account, accountId }}
                className="block bg-white shadow-md border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
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
                  <strong>Date :</strong> {formattedDate}
                </p>

                {tx.description && (
                  <p className="text-gray-600 italic mt-1">
                    {tx.description}
                  </p>
                )}

                <p className="text-xs text-blue-600 mt-2 underline">
                  Voir les détails →
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
    </div>
  );
}
