import DepositForm from "../components/deposit/DepositForm";

export default function Deposit() {
  return (
    <div className="px-6 py-6">
      <h1 className="text-2xl font-semibold mb-4">Effectuer un dépôt</h1>
      <DepositForm />
    </div>
  );
}
