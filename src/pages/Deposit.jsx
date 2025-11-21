import DepositForm from "../components/deposit/DepositForm";
import Footer from "../components/utils/Footer";

export default function Deposit() {
  return (
    <div className="px-6 py-6 h-screen bg-slate-200 flex flex-col items-center justify-center">
      <DepositForm />
      <Footer></Footer>
    </div>
  );
}