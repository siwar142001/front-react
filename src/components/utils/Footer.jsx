import { useNavigate } from "react-router-dom";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { IoSendOutline } from "react-icons/io5";

export default function Footer(){
    const navigate = useNavigate();
    return(
        <div class="fixed bottom-0 left-0 z-50 w-full h-16 bg-slate-500 border-t border-default">
            <div class="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
                <button type="button" class="cursor-pointer inline-flex flex-col items-center justify-center px-5 hover:bg-slate-600">
                    <svg class="w-7 h-7 mb-1 text-body group-hover:text-fg-brand" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"/></svg>
                    <span class="text-sm text-body">Home</span>
                </button>
                <button type="button" onClick={() => navigate("/transfer")} class="cursor-pointer inline-flex flex-col items-center justify-center px-5 hover:bg-slate-600">
                    <FaMoneyBillTransfer className="size-7"/>
                    <span class="text-sm text-body">Transfer</span>
                </button>
                <button type="button" class="cursor-pointer inline-flex flex-col items-center justify-center px-5 hover:bg-slate-600">
                    <svg class="w-6 h-6 mb-1 text-body group-hover:text-fg-brand" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6 4v10m0 0a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m0 0v2m6-16v2m0 0a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m0 0v10m6-16v10m0 0a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m0 0v2"/></svg>
                    <span class="text-sm text-body">Settings</span>
                </button>
                <button type="button" onClick={() => navigate("/beneficiaries")} class="cursor-pointer inline-flex flex-col items-center justify-center px-5 hover:bg-slate-600">
                    <svg class="w-6 h-6 mb-1 text-body group-hover:text-fg-brand" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="#000000" width="24" height="24" viewBox="0 0 24 24"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"></path></g></svg>
                    <span class="text-sm text-body">Bénéficiaires</span>
                </button>
            </div>
        </div>


    )
}