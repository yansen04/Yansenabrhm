import { ItemForm } from "../shared/ItemForm";

export default function NewItemPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">New Item</h2>
      <ItemForm />
    </div>
  );
}
