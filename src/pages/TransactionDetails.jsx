import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import apiClient from "../api/apiClient";

export default function TransactionDetails() {
  const { accountId, txIndex } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [account, setAccount] = useState(location.state?.account || null);
  const [transaction, setTransaction] = useState(location.state?.tx || null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(!transaction); // si pas de state -> on refetch

  // Si on arrive sans state (reload / accès direct), on re-fetch l'historique
  useEffect(() => {
    if (transaction) return; // déjà fourni par History.jsx

    const controller = new AbortController();

    const loadTx = async () => {
      try {
        setLoading(true);
        setError("");

        // infos compte
        const accRes = await apiClient.get(`/accounts/${accountId}`, {
          signal: controller.signal,
        });
        setAccount(accRes.data || null);

        // historique complet
        const txRes = await apiClient.get(
          `/transactions/history/${accountId}`,
          {
            signal: controller.signal,
            params: { from_account_id: accountId },
          }
        );

        const list = txRes.data?.transactions || [];
        const idx = Number(txIndex);
        if (Number.isNaN(idx) || idx < 0 || idx >= list.length) {
          setError("Cette transaction n'existe pas.");
          setLoading(false);
          return;
        }

        setTransaction(list[idx]);
      } catch (err) {
        if (err.name === "CanceledError" || err.name === "AbortError") return;
        console.error(err);
        const detail = err.response?.data?.detail;
        setError(
          typeof detail === "string"
            ? detail
            : "Impossible de charger les détails de la transaction."
        );
      } finally {
        setLoading(false);
      }
    };

    loadTx();
    return () => controller.abort();
  }, [accountId, txIndex, transaction]);

  // Petit helper pour le type
  const getDebitCreditLabel = (tx) => {
    if (!tx) return "";
    if (tx.type === "depot") return "Crédit";
    if (tx.type === "virement") return "Débit";
    return tx.type;
  };

  const formatDate = (raw) => {
    if (!raw) return "";
    const isoLike = raw.replace(" ", "T");
    const d = new Date(isoLike);
    if (isNaN(d.getTime())) return raw;
    return d.toLocaleString("fr-FR");
  };

  // Vérification : l'utilisateur est-il impliqué ?
  const [involvedError, setInvolvedError] = useState("");

  useEffect(() => {
    const checkInvolvement = async () => {
      if (!transaction) return;

      try {
        const res = await apiClient.get("/accounts/me");
        const myAccounts = res.data || [];
        const myIds = new Set(myAccounts.map((a) => a.id));

        const srcId = Number(accountId);
        const dstId = transaction.to_account_id;

        const isSender = myIds.has(srcId);
        const isReceiver = dstId != null && myIds.has(dstId);

        if (!isSender && !isReceiver) {
          setInvolvedError(
            "Vous n'êtes ni l'envoyeur ni le destinataire de cette transaction."
          );
        }
      } catch (e) {
        // si ça échoue, on n'empêche pas l'affichage mais on log
        console.error(e);
      }
    };

    checkInvolvement();
  }, [accountId, transaction]);

  if (loading) {
    return <div className="p-6 text-center">Chargement…</div>;
  }

  if (error) {
    return (
      <div className="px-6 py-6 max-w-2xl mx-auto">
        <Link
          to={`/transactions/history/${accountId}`}
          className="text-blue-600 underline mb-4 inline-block"
        >
          ← Retour à l'historique
        </Link>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="px-6 py-6 max-w-2xl mx-auto">
        <Link
          to={`/transactions/history/${accountId}`}
          className="text-blue-600 underline mb-4 inline-block"
        >
          ← Retour à l'historique
        </Link>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
          Cette transaction n'existe pas.
        </div>
      </div>
    );
  }

  const isDebit = transaction.type === "virement";
  const sign = isDebit ? "-" : "+";
  const amountClass = isDebit ? "text-red-600" : "text-green-600";

  return (
    <div className="px-6 py-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Link
          to={`/transactions/history/${accountId}`}
          className="text-blue-600 underline hover:text-blue-800"
        >
          ← Retour à l'historique
        </Link>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-600 underline"
        >
          Retour
        </button>
      </div>

      <h1 className="text-2xl font-semibold mb-4">
        Détail de la transaction
      </h1>

      {involvedError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4">
          {involvedError}
        </div>
      )}

      <div className="bg-white shadow-md rounded-xl border border-gray-200 p-5 space-y-3">
        <p>
          <strong>Montant :</strong>{" "}
          <span className={`${amountClass} font-semibold`}>
            {sign} {Number(transaction.amount).toFixed(2)} €
          </span>
        </p>
        <p>
          <strong>Date :</strong> {formatDate(transaction.date)}
        </p>
        <p>
          <strong>Type :</strong> {getDebitCreditLabel(transaction)}{" "}
          <span className="text-gray-500 text-sm">
            ({transaction.type === "depot" ? "dépôt" : "virement"})
          </span>
        </p>
        <p>
          <strong>Compte source :</strong> Compte n° {accountId}
        </p>
        <p>
          <strong>Compte destinataire :</strong>{" "}
          {transaction.to_account_id
            ? `Compte n° ${transaction.to_account_id}`
            : "—"}
        </p>
        <p>
          <strong>Statut :</strong>{" "}
          <span className="text-green-600 font-medium">
            {transaction.status === "cancelled" ? "Annulée" : "Confirmée"}
          </span>
        </p>
        {transaction.description && (
          <p className="text-gray-600 italic mt-2">
            {transaction.description}
          </p>
        )}
      </div>
    </div>
  );
}
