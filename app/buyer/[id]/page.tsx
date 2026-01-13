type Props = {
  params: { id: string };
};

export default async function BuyerProfilePage({ params }: Props) {
  const res = await fetch(
    `http://localhost:3001/buyer/${params.id}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch buyer");
  }

  const buyer = await res.json();

  return (
    <div className="card bg-base-100 shadow p-6">
      <h2 className="text-xl font-bold mb-2">Buyer Profile</h2>
      <p><strong>Name:</strong> {buyer.fullName}</p>
      <p><strong>Email:</strong> {buyer.email}</p>
    </div>
  );
}
