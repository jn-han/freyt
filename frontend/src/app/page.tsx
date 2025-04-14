"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Store = {
  _id: string;
  name: string;
  location: string;
};

export default function Home() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleStoreSelect = (storeId: string) => {
    localStorage.setItem("storeId", storeId);
    router.push(`/dashboard/${storeId}`);
  };

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await fetch("http://localhost:8080/stores");
        const data = await res.json();
        console.log("Fetched store data:", data); // 👈 DEBUG LOG

        // Check if data is an array or wrapped in an object
        if (Array.isArray(data)) {
          setStores(data);
        } else if (Array.isArray(data.stores)) {
          setStores(data.stores);
        } else {
          console.error("Unexpected store response format:", data);
          setStores([]);
        }
      } catch (error) {
        console.error("Failed to fetch stores:", error);
        setStores([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Select Your Store</h1>

      {loading ? (
        <p>Loading stores...</p>
      ) : (
        <ul className="space-y-4">
          {stores.map((store) => (
            <li
              key={store._id}
              className="p-4 border rounded hover:bg-gray-100 cursor-pointer"
              onClick={() => handleStoreSelect(store._id)}
            >
              <p className="text-lg font-semibold">{store.name}</p>
              <p className="text-sm text-gray-600">{store.location}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
