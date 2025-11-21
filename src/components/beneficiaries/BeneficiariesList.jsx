import { useState, useEffect } from "react";
import apiClient from "../../api/apiClient";
import BeneficiaryCard from "./BeneficiaryCard";
import CreateBeneficiaryModal from "./CreateBeneficiaryModal";
import Notification from "../utils/Notification";

export default function BeneficiariesList(){
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isLoadingBeneficiaries, setIsLoadingBeneficiaries] = useState(true);
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [beneficiaryDeleted, setBeneficiaryDeleted] = useState(false);
    const [beneficiaryCreated, setBeneficiaryCreated] = useState(false);

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

    const handleBeneficiaryDeleted = (deletedId) => {
        setBeneficiaries((prev) => prev.filter((beneficiary) => beneficiary.id !== deletedId));
        setBeneficiaryDeleted(true);
    };

    const handleBeneficiaryCreated = (newBeneficiary) => {
        // On ajoute le nouveau compte en bas de la liste
        setBeneficiaries((prev) => [...prev, newBeneficiary]);
        setBeneficiaryCreated(true)
    };

    return(
        <div className=" bg-slate-200 h-screen w-screen flex justify-center">
            <section className="px-6 py-6 flex flex-col items-center">
                <div className="flex items-center justify-between mb-6 w-150">
                    <h2 className="text-2xl font-semibold">Mes bénéficiaires</h2>
                    <div className="flex items-center gap-4">
                        <button
                        type="button"
                        onClick={() => setIsCreateOpen(true)}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                        + Ajouter un bénéfiaire
                        </button>
                    </div>
                </div>
                {beneficiaries.length === 0 ? (
                <div className="text-center mt-10 text-gray-600">
                    Vous n’avez encore aucun bénéficiaires.  
                    <br />
                    Cliquez sur <span className="font-medium">« Ajouter un bénéficiaire »</span> pour en ajouter un.
                </div>
                ) : beneficiaries.map((beneficiary) => (<BeneficiaryCard key={beneficiary.id} beneficiary={beneficiary} handleBeneficiaryDeleted={handleBeneficiaryDeleted}/>))}
        

                {/* Modal de création de compte */}
                {<CreateBeneficiaryModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onCreated={handleBeneficiaryCreated}
                />}
            </section>

            {beneficiaryDeleted ?  <Notification active={beneficiaryDeleted} setActive={setBeneficiaryDeleted} text={"Beneficiary deleted successfully."}/> 
            : beneficiaryCreated ? <Notification active={beneficiaryCreated} setActive={setBeneficiaryCreated} text={"Beneficiary created successfully."}/> : null }
        </div>
    )
}