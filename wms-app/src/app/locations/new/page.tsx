import { LocationForm } from "../shared/LocationForm";

export default function NewLocationPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">New Location</h2>
      <LocationForm />
    </div>
  );
}
