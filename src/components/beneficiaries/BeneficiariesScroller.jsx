import apiClient from "../../api/apiClient";
import { useState, useEffect } from "react";

export default function BeneficiariesScroller({beneficiaryId, setBeneficiaryId}){
    const [isLoadingBeneficiaries, setIsLoadingBeneficiaries] = useState(true);
    const [beneficiaries, setBeneficiaries] = useState([]);
    
    useEffect(() => {
    const loadBeneficiaries = async () => {
      setIsLoadingBeneficiaries(true);
      try {
        const res = await apiClient.get("/beneficiary/list");
        setBeneficiaries(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoadingBeneficiaries(false);
      }
    };

    loadBeneficiaries();
    }, []);
    return(
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bénéficiaires
          </label>
          <select
            value={beneficiaryId}
            onChange={(e) => setBeneficiaryId(e.target.value)}
            disabled={isLoadingBeneficiaries || !beneficiaries.length}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">Sélectionnez un compte</option>
            {beneficiaries.length ? (
            beneficiaries.map((beneficiary) => (
            <option key={beneficiary.to_account_id} value={beneficiary.to_account_id}>
            {beneficiary.name}
            </option>
            ))) : (
            <option disabled>Aucun bénéficiaire</option>
        )}
          </select>
        </div>
    )
}