import { useNavigate } from "react-router-dom";

export default function Beneficiaries() {
  const navigate = useNavigate();
    return(
        <div>
            <div>
                <p>Liste des bénéficiaires</p>
            </div>
            <button
        id="return"
        type="button"
        className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
        onClick={() => navigate("/")}
      >
        <span className="text-sm text-body">Retour</span>
      </button>
        </div>
    )
}