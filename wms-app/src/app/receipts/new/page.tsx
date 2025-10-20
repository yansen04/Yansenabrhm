import { NewReceiptForm } from "../shared/NewReceiptForm";

export default function NewReceiptPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">New Receipt</h2>
      <NewReceiptForm />
    </div>
  );
}
