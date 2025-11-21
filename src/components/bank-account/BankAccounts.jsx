import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../api/apiClient";
import DeleteButton from "../utils/DeleteButton";
import Notification from "../utils/Notification"

function CreateAccountModal({ isOpen, onClose, onCreated }) {
  const [accountType, setAccountType] = useState("current");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await apiClient.post("/accounts/open", {
        account_type: accountType,
      });

      // On renvoie le compte créé au parent
      if (onCreated) {
        onCreated(res.data);
      }

      // reset + fermer
      setAccountType("current");
      onClose();
    } catch (err) {
      console.error(err);
      const apiMsg =
        err.response?.data?.detail ||
        "Une erreur est survenue lors de la création du compte.";
      setError(apiMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-2">Ouvrir un nouveau compte</h3>
        <p className="text-sm text-gray-600 mb-4">
          Choisissez le type de compte que vous souhaitez ouvrir.
        </p>

        {error && (
          <p className="text-sm text-red-500 mb-3">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type de compte
            </label>
            <select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="current">Compte courant</option>
              <option value="savings">Compte épargne</option>
              {/* Ajoute d'autres types si tu en as en base */}
            </select>
          </div>

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

export default function BankAccounts({ refreshKey = 0 }) {
  const [accountDeleted, setAccountDeleted] = useState(false);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    const loadBankAccounts = async () => {
      try {
        const res = await apiClient.get("/accounts/me");
        setBankAccounts(res.data || []);
      } catch (e) {
        console.error(e);
        setError("Impossible de charger les comptes");
      } finally {
        setIsLoading(false);
      }
    };

    loadBankAccounts();}, 

    
    [refreshKey]); 
  

  const handleAccountDeleted = (deletedId) => {
    setBankAccounts((prev) => prev.filter((acc) => acc.id !== deletedId));
    setSuccess("Compte clôturé avec succès.");
  };

 

  const handleAccountCreated = (newAccount) => {
    // On ajoute le nouveau compte en haut de la liste
    setBankAccounts((prev) => [...prev, newAccount]);
    setSuccess("Compte créé avec succès.");
  };

  if (isLoading) return <p className="text-center mt-10">Chargement...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="flex justify-center">
      <section className="px-6 py-6 flex flex-col w-fit">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Mes comptes</h2>
          <div className="flex items-center">
            {success && (
              <span className="text-sm text-green-600">{success}</span>
            )}
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              + Ouvrir un compte
            </button>
          </div>
        </div>

        {bankAccounts.length === 0 ? (
          <div className="text-center mt-10 text-gray-600">
            Vous n’avez encore aucun compte.  
            <br />
            Cliquez sur <span className="font-medium">« Ouvrir un compte »</span> pour en créer un.
          </div>
        ) : (
        <div>
          <div className="flex flex-col w-200 md:grid-cols-2 gap-6">
            {bankAccounts.map((account) => {
              const formattedDate = new Date(account.created_at).toLocaleDateString("fr-FR");

              return (
                <div
                  key={account.id}
                  className="relative bg-white shadow-md rounded-xl p-6 border border-gray-200 hover:shadow-xl transition-shadow"
                >
                  {/* Delete en haut à droite */}
                  <div className="absolute top-4 right-4">
                    <DeleteButton
                      accountId={account.id}
                      onDeleted={handleAccountDeleted}
                    />
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    Compte n° {account.id}
                  </h3>

                  <p className="text-gray-600">
                    <span className="font-medium">Type :</span> {account.account_type}
                  </p>

                  <p className="text-gray-600 mt-1">
                    <span className="font-medium">Solde :</span>{" "}
                    <span className="text-green-600 font-semibold">
                      {account.balance.toFixed(2)} €
                    </span>
                  </p>

                  <p className="text-gray-600 mt-1">
                    <span className="font-medium">Créé le :</span> {formattedDate}
                  </p>

                  <Link
                    to={`/transactions/history/${account.id}`}
                    className="mt-6 block w-full bg-blue-600 text-center text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Voir le compte
                  </Link>
                </div>
              );
            })}
          </div>
          </div>
        )}

        {success ? <Notification active={success} setActive={setSuccess} text={success} /> : <></>}

        {/* Modal de création de compte */}
        <CreateAccountModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onCreated={handleAccountCreated}
        />
      </section>
    </div>
  );
}
