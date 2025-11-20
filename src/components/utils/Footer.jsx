import { useNavigate } from "react-router-dom";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { IoSendOutline } from "react-icons/io5";

export default function Footer(){

    function LogOut(){
        localStorage.removeItem("jwtToken");   // delete token
        navigate("/login");                    // redirect
    }

    const navigate = useNavigate();
    return(
        <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-slate-500 border-t border-default">
            <div className="grid h-full max-w-lg grid-cols-3 mx-auto font-medium">
                <button type="button" onClick={() => navigate("/")} className="cursor-pointer inline-flex flex-col items-center justify-center px-5 hover:bg-slate-600">
                    <svg className="w-7 h-7 mb-1 text-body group-hover:text-fg-brand" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"/></svg>
                    <span className="text-sm text-body">Home</span>
                </button>
                <button type="button" onClick={() => navigate("/transfer")} className="cursor-pointer inline-flex flex-col items-center justify-center px-5 hover:bg-slate-600">
                    <FaMoneyBillTransfer className="size-7"/>
                    <span className="text-sm text-body">Transfer</span>
                </button>
                <button type="button" onClick={() => LogOut()} className="cursor-pointer inline-flex flex-col items-center justify-center px-5 hover:bg-slate-600">
                    <svg className="w-6 h-6 mb-1 text-body group-hover:text-fg-brand" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6 4v10m0 0a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m0 0v2m6-16v2m0 0a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m0 0v10m6-16v10m0 0a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m0 0v2"/></svg>
                    <span className="text-sm text-body">Log Out</span>
                </button>
            </div>
        </div>


    )
}