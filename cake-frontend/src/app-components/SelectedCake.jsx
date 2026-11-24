import cakeData from "@/utils/cakeData";

const SelectedCake = ({ id }) => {
  const cake = cakeData.cakeTypes.find((cake) => cake.id == id);
  if (!cake) {
    return <div />;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      <div className="relative">
        <img
          src={cake.image}
          alt={cake.name}
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="text-lg font-bold text-green-600">
            LKR {cake.basePrice}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{cake.name}</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">{cake.description}</p>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Available Flavors
          </h3>
          <div className="flex flex-wrap gap-2">
            {cake.flavors.map((flavor, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200"
              >
                {flavor}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedCake;
