import BankAccounts from "../components/bank-account/BankAccounts";
import DeleteButton from "../components/utils/DeleteButton"
import Notification from "../components/utils/Notification";
import { useState, useEffect } from "react";

export default function Dashboard(){
    return(
        <>
        <BankAccounts/>
        </>
    )
}