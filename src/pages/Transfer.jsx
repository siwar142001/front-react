import TransferForm from "../components/transfer/TransferForm";
import Footer from "../components/utils/Footer";

export default function Transfer() {
  return (
    <div className="px-6 py-6 bg-slate-200 h-screen w-screen flex flex-col justify-center items-center">
      <TransferForm />
      <Footer/>
    </div>
  );
}
