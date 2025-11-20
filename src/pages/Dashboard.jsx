import BankAccounts from "../components/bank-account/BankAccounts";
import DeleteButton from "../components/utils/DeleteButton"
import Notification from "../components/utils/Notification";
import Footer from "../components/utils/Footer";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="px-6 py-6">
      {/* Barre d’action en haut */}
      <div className="flex justify-end mb-4">

        
        <Link
          to="/transfert"
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Effectuer un virement
        </Link>


        <Link
          to="/depot"
          className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
        >
          Effectuer un dépôt
        </Link>



      </div>

      {/* Liste des comptes */}
      <BankAccounts />
      <Footer/>
    </div>
  );
}
