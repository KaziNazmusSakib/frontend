export default async function HomePage() {
  const res = await fetch("http://localhost:3001/products", {
    cache: "no-store",
  });

  const products = await res.json();

  return (
    <div>
      <section className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">
          Welcome to Nexify Store
        </h1>
        <p className="text-gray-600">
          A modern multi-vendor eCommerce platform
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">
          Latest Products
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product: any) => (
            <div
              key={product.id}
              className="card bg-base-100 shadow hover:shadow-lg transition"
            >
              <div className="card-body">
                <h3 className="card-title">{product.name}</h3>
                <p>Price: ৳{product.price}</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-sm btn-primary">
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
