import { useState, useEffect } from "react";
import apiClient from "../../api/apiClient";

export default function BeneficiariesList(){
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
            {beneficiaries.length ? beneficiaries.map((beneficiary) =>
                (<div key={beneficiary.id} >{beneficiary.name}</div>)) : <button /*onClick={}*/ className="border-2 cursor-click" >Add a beneficiary</button> }
        </div>
    )
}