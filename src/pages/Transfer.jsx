import TransferForm from "../components/transfer/TransferForm";

export default function Transfer() {
  return (
    <div className="px-6 py-6">
      <h1 className="text-2xl font-semibold mb-4">Effectuer un virement</h1>
      <TransferForm />
    </div>
  );
}
