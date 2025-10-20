import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { LocationForm } from "../shared/LocationForm";

export default async function EditLocationPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const location = await prisma.location.findUnique({ where: { id } });
  if (!location) return notFound();
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Edit Location</h2>
      <LocationForm location={location} />
    </div>
  );
}
