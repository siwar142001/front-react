import BankAccounts from "../components/bank-account/BankAccounts";
import DeleteButton from "../components/utils/DeleteButton"
import Notification from "../components/utils/Notification";
import Footer from "../components/utils/Footer";
import { useState, useEffect } from "react";

export default function Dashboard(){
    return(
        <div className="h-screen w-screen">
            <BankAccounts/>
            <Footer></Footer>
        </div>
    )
}