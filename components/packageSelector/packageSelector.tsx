"use client";
import React, { useEffect, useState } from "react";
import "./packageSelector.css";

export interface Package {
  package_id: number;
  name: string;
  is_free: boolean;
  is_published: boolean;
  instructor: {
    user_id: number;
    name: string;
    email: string;
    role: string;
    description: string;
  };
  feeDetails: {
    fee_id: number;
    total_fee: string;
    discount_percentage: string;
  };
  price: number;
  cover_image: string | null;
  description: string;
}

interface Props {
  defaultSelected?: Package[];
  onSelectPackages: (packages: Package[]) => void;
  onClose: () => void;
}

const PackageSelector: React.FC<Props> = ({
  defaultSelected = [],
  onSelectPackages,
  onClose,
}) => {
  const [searchText, setSearchText] = useState("");
  const [allPackages, setAllPackages] = useState<Package[]>([]);
  const [selectedPackages, setSelectedPackages] = useState<Package[]>(
    defaultSelected
  );

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch("http://localhost:3000/package/published");
        const data = await res.json();
        setAllPackages(data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };

    fetchPackages();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleSelect = (pkg: Package) => {
    if (!selectedPackages.find((p) => p.package_id === pkg.package_id)) {
      setSelectedPackages([...selectedPackages, pkg]);
    }
    setSearchText("");
  };

  const handleRemove = (id: number) => {
    setSelectedPackages((prev) =>
      prev.filter((pkg) => pkg.package_id !== id)
    );
  };

  const handleDone = () => {
    onSelectPackages(selectedPackages);
    onClose();
  };

  const filteredPackages = allPackages.filter((pkg) =>
    pkg.name.toLowerCase().startsWith(searchText.toLowerCase())
  );

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Select Packages</h2>

        <input
          type="text"
          placeholder="Search packages..."
          value={searchText}
          onChange={handleChange}
        />

        {searchText && (
        <ul className="dropdown">
            {filteredPackages.length > 0 ? (
            filteredPackages.map((pkg) => (
                <li key={pkg.package_id} onClick={() => handleSelect(pkg)}>
                {pkg.name}
                </li>
            ))
            ) : (
            <li className="no-match">No matches found</li>
            )}
        </ul>
        )}

        <div className="selected-tags">
          {selectedPackages.map((pkg) => (
            <div key={pkg.package_id} className="tag">
              {pkg.name}
              <button onClick={() => handleRemove(pkg.package_id)}>✖</button>
            </div>
          ))}
        </div>

        <div className="actions">
          <button onClick={handleDone}>Done</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default PackageSelector;
