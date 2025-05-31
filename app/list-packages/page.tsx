"use client";
import React, { useEffect, useState } from 'react';
import './list-packages.css';
import { useRouter } from 'next/navigation';
import ShareButton from '@components/shareButton/shareButton';

interface FeeDetails {
  total_fee?: number;
 
  
}

interface Package {
  package_id: number;
   is_free?: boolean;
  title: string;
  status: string;
  feeDetails?: FeeDetails;
  courseLandingPage?: {
    title:string;
  }
}

const PackageList: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
const router = useRouter();
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch('http://localhost:3000/package/packages');
        if (!res.ok) throw new Error('Failed to fetch packages');
        const data: Package[] = await res.json();
        setPackages(data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const handleEdit = (id: number) => {
    router.push(`/teaching-page/package-page/${id}`);
  };


  const handleDelete = async (id: number) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this package?");
  if (!confirmDelete) return;

  try {
    const res = await fetch(`http://localhost:3000/package/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (res.ok) {
      alert(data.message || "Package deleted successfully.");
      setPackages((prev) => prev.filter((pkg) => pkg.package_id !== id));
    } else {
      alert(data.message || "Failed to delete package.");
    }
  } catch (err) {
    alert("An error occurred while deleting the package.");
  }
};

  

  if (loading) return <p>Loading packages...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Packages</h1>
      <table className="table">
        <thead>
          <tr className="theadRow">
            <th className="th">Name</th>
            <th className="th">Status</th>
            <th className="th">Total Fee</th>
            <th className="th">Actions</th>
          </tr>
        </thead>
        <tbody>
          {packages.length === 0 && (
            <tr>
              <td colSpan={4} className="noPackages">
                No packages found.
              </td>
            </tr>
          )}
          {packages.map((pkg) => (
            <tr key={pkg.package_id} className="trRow">
              <td className="td">{pkg.courseLandingPage?.title ?? pkg.title}</td>
              <td className="td">{pkg.status}</td>
              <td className="td">
                {pkg.is_free
                  ? "Free"
                  : pkg.feeDetails?.total_fee !== undefined
                    ? `$${pkg.feeDetails.total_fee}`
                    : 'N/A'}
              </td>
              <td className="td actions">
                <button onClick={() => handleEdit(pkg.package_id)}>Edit</button>
                <button onClick={() => handleDelete(pkg.package_id)}>Delete</button>
                <ShareButton packageId={pkg.package_id} /> 
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PackageList;
