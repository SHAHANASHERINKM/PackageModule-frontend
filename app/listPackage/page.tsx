"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./listpackage.css";
import ShareButton from '@components/shareButton/shareButton';

interface Package {
  package_id: number; // Ensure this matches your backend response
  name: string;
  is_free: boolean;
  language: string;
  duration: number; // Ensure duration is a number
}

const PackageTable: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:3000/package/packages") // Fetch data from backend
      .then((res) => res.json())
      .then((data) => setPackages(data))
      .catch((err) => console.error("Error fetching packages:", err));
  }, []);

  // Function to navigate to the edit page with "from=list"
  const handleEdit = (packageId: number) => {
    router.push(`/packagePage/edit/package/${packageId}?from=listPackage`);
  };

  const handleFeeDetails = (packageId: number) => {
    router.push(`listPackage/see-fee-details/${packageId}`);
  };

  const handlePackageDetails = (packageId: number) => {
    
    router.push(`listPackage/see-details/${packageId}`);
  };

  return (
    <div>
      <h2 className="title">Available Packages</h2>
      <table className="package-table">
        <thead>
          <tr>
            <th>Package Name</th>
            <th>Status</th>
            <th>Language</th>
            <th>Duration</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {packages.length > 0 ? (
            packages.map((pkg, index) => (
              <tr key={pkg.package_id || `package-${index}`}>
                <td>{pkg.name}</td>
                <td>{pkg.is_free ? "Free" : "Paid"}</td>
                <td>{pkg.language}</td>
                <td>{pkg.duration} months</td>
                <td>
                  <button 
                    className="edit-btn" 
                    onClick={() => handleEdit(pkg.package_id)}
                  >
                    Edit
                  </button>
                  <button className="fee-btn" onClick={() => handlePackageDetails(pkg.package_id)}>See  Details</button>
                  <button className="fee-btn" onClick={() => handleFeeDetails(pkg.package_id)}>See Fee Details</button>
                  <ShareButton packageId={pkg.package_id} />
                  
                  
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>No packages available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PackageTable;
