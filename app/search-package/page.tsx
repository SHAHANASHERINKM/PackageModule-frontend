"use client";
import React, { useState } from "react";
import PackageSelector, { Package } from "@components/packageSelector/packageSelector";
import "./search-package.css";

export default function PackageSelectionPage() {
  const [showSelector, setShowSelector] = useState(false);
  const [selectedPackages, setSelectedPackages] = useState<Package[]>([]);

  const handleSelectPackages = (packages: Package[]) => {
    setSelectedPackages(packages);
  };

  return (
    <div  className="main-container">
      <h1>Course Package Setup</h1>
      <button onClick={() => setShowSelector(true)}>Select Packages</button>

      {selectedPackages.length > 0 && (
        <ul>
          {selectedPackages.map((pkg) => (
            <li key={pkg.package_id}>{pkg.name}</li>
          ))}
        </ul>
      )}

      {showSelector && (
        <PackageSelector
          onSelectPackages={handleSelectPackages}
          defaultSelected={selectedPackages}
          onClose={() => setShowSelector(false)}
        />
      )}
    </div>
  );
}
