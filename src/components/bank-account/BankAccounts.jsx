import { useState, useEffect } from "react";
import apiClient from "../../api/apiClient";

export default function BankAccounts() {
  const [bankAccounts, setBankAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBankAccounts = async () => {
      try {
        const res = await apiClient.get("/accounts/me");
        setBankAccounts(res.data);
        console.log(res.data)
      } catch (e) {
        console.error(e);
        setError("Impossible de charger les comptes");
      } finally {
        setIsLoading(false);
      }
    };

    loadBankAccounts();
  }, []);

  if (isLoading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {bankAccounts ? bankAccounts.map((bankAccount) => (
        <div key={bankAccount.id}>{bankAccount.balance}</div>
      )) : <a>ouvrez un compte</a>}
    </div>
  );
}
