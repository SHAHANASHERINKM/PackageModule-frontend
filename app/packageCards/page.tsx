"use client";
import { useEffect, useState } from "react";
import "./packageCard.css";
import { useRouter } from "next/navigation";
import { FaRegHeart, FaHeart } from 'react-icons/fa';

interface Package {
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
    has_discount: boolean;
    total_fee: string;
    discount_type: string;
    discount_value: string;
  };
  price: number;
  cover_image: string | null;
  description: string;
}

const PackageCards: React.FC = () => {
  const [published, setPublished] = useState<Package[]>([]);
  const [drafted, setDrafted] = useState<Package[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [filter, setFilter] = useState<"all" | "free" | "paid">("all");
  const [searchTerm, setSearchTerm] = useState<string>(""); // Search term state
  const router = useRouter();

  function parseDescription(desc: string): string {
    try {
      const parsed = JSON.parse(desc);

      if (Array.isArray(parsed) && parsed.every((el) => typeof el === "string")) {
        return parsed.join("");
      }

      if (Array.isArray(parsed) && parsed[0]?.children) {
        return parsed
          .map((block) => block.children?.map((c: any) => c.text).join("")).join("<br>");
      }

      if (typeof parsed === "string") {
        return parsed;
      }

      return "";
    } catch (err) {
      return desc;
    }
  }

  useEffect(() => {
    fetch("http://localhost:3000/package/packages")
      .then((res) => res.json())
      .then((data: Package[]) => {
        const validPackages = data.filter(pkg => pkg !== null && typeof pkg === "object");
        setPublished(validPackages.filter(pkg => pkg.is_published));
        setDrafted(validPackages.filter(pkg => !pkg.is_published));
      })
      .catch((err) => console.error("Error fetching packages:", err));
  }, []);

  const handleAddToWishlist = (pkg: Package) => {
    const isAlreadyInWishlist = wishlist.includes(pkg.package_id);
  
    setWishlist((prev) =>
      isAlreadyInWishlist
        ? prev.filter((id) => id !== pkg.package_id)
        : [...prev, pkg.package_id]
    );
  
    // Show the alert message
    if (!isAlreadyInWishlist) {
      alert(`Package ${pkg.name} added to wishlist!`);
    } else {
      alert(`Package ${pkg.name} removed from wishlist!`);
    }
  };

  const renderCards = (packages: Package[]) =>
    packages.map((pkg) => {
      const imageSrc =
        pkg.cover_image &&
        pkg.cover_image !== "null" &&
        pkg.cover_image.trim() !== ""
          ? pkg.cover_image
          : "/default-coverpage.jpg";

      return (
        <div className="package-card" key={pkg.package_id}>
          <div className="card-image-wrapper">
            <div className="absolute top-2 right-2 z-10 flex items-center justify-end gap-2">
              {pkg.is_free && <div className="free-tag">FREE</div>}
              <button
                className="wishlist-btns p-1 rounded-full"
                onClick={() => handleAddToWishlist(pkg)}
              >
                {wishlist.includes(pkg.package_id) ? (
                  <FaHeart className="wish text-green-500 text-xl" />
                ) : (
                  <FaRegHeart className=" text-xl opacity-80 hover:text-green-500" />
                )}
              </button>
            </div>
            <img src={imageSrc} alt="Package Cover" className="card-image" />
          </div>

          <div className="card-content">
            <h3 className="card-title">{pkg.name}</h3>
            <p className="card-instructor">
              <span className="label-text">Instructor:</span>{" "}
              <span className="content-text">{pkg.instructor?.name || "Unknown"}</span>
            </p>

            <div
              className="card-description-html"
              dangerouslySetInnerHTML={{
                __html: parseDescription(pkg.description),
              }}
            />

{pkg.feeDetails && !pkg.is_free && (
  <div className="card-price">
    {pkg.feeDetails.has_discount && Number(pkg.feeDetails.discount_value) > 0 ? (
      <>
        <span className="discounted-price">
          ₹
          {pkg.feeDetails.discount_type === "percent"
            ? Math.round(
                Number(pkg.feeDetails.total_fee) -
                (Number(pkg.feeDetails.total_fee) * Number(pkg.feeDetails.discount_value)) / 100
              )
            : Math.round(
                Number(pkg.feeDetails.total_fee) - Number(pkg.feeDetails.discount_value)
              )}
        </span>
        <span className="original-price">
          <s>₹{pkg.feeDetails.total_fee}</s>
        </span>
      </>
    ) : (
      <span>₹{pkg.feeDetails.total_fee}</span>
    )}
  </div>
)}


            <button
              className="details-btn"
              onClick={() => router.push(`/packageCards/more-details/${pkg.package_id}`)}
            >
              More Details
            </button>
          </div>
        </div>
      );
    });

  const filteredPublished = filter === "all"
    ? published
    : published.filter((pkg) => (filter === "free" ? pkg.is_free : !pkg.is_free));

  const filteredDrafted = filter === "all"
    ? drafted
    : drafted.filter((pkg) => (filter === "free" ? pkg.is_free : !pkg.is_free));

  // Filter based on the search term
  const filteredPackages = (packages: Package[]) => {
    return packages.filter(pkg =>
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="package-sections-container">
      <div className="header">
      <div className="search-and-filter-section">
        <div className="search-bar-container">
          <input
            type="text"
            className="search-bar"
            placeholder="Search for packages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-dropdown-container">
          <label htmlFor="filter" className="filter-label">Filter by:</label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value as "all" | "free" | "paid")}
            className="filter-dropdown"
          >
            <option value="all">All</option>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
        </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">📦 Published Packages</h2>
        <div className="package-grid">
          {filteredPackages(filteredPublished).length > 0 ? renderCards(filteredPackages(filteredPublished)) : <p>No published packages available.</p>}
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">📝 Drafted Packages</h2>
        <div className="package-grid">
          {filteredPackages(filteredDrafted).length > 0 ? renderCards(filteredPackages(filteredDrafted)) : <p>No drafted packages found.</p>}
        </div>
      </div>
    </div>
  );
};

export default PackageCards;
