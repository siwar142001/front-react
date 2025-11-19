import { useState, useEffect } from "react";
import apiClient from "../../api/apiClient";

export default function BankAccounts(){
    const [bankAccounts, setBankAccounts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const loadBankAccounts = async () => {
            try {
                apiClient.get("/accounts/me")
                const data = await res.json();
                setBankAccounts(data.results);
            } catch (e) {
                setError("Impossible de charger les comptes");
            } finally {
                setIsLoading(false);
            }
        };
        loadBankAccounts();
    }, []);
    return(
        <div>
            {
            bankAccounts.map((bankAccount) => <div key={bankAccount.id}>{bankAccount.balance}</div>)
            }
        </div>
    )
}