import BeneficiaryDeleteButton from "./BeneficiaryDeleteButton";

export default function BeneficiaryCard({beneficiary, handleBeneficiaryDeleted}){
    return(
        <div className="gap-6 mt-5">
                <div
                className="w-150 relative bg-white shadow-md rounded-xl p-6 border border-gray-200 hover:shadow-xl transition-shadow"
                >
                {/* Delete en haut à droite */}
                <div className="absolute top-4 right-4">
                    <BeneficiaryDeleteButton
                    deletedId={beneficiary.id}
                    onDeleted={handleBeneficiaryDeleted}
                    />
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {beneficiary.name}
                </h3>

                <h3 className="text-xl text-gray-800 mb-3">
                    {beneficiary.description}
                </h3>

                <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {"Created on : " + beneficiary.creation_date}
                </h3>
                </div>
        </div>
    )
}