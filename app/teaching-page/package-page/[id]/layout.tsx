"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import Navbar from "@components/navbar/navbar";
import Footer from "@components/footer/footer";
import "./layout.css";
import { DirtyProvider, useDirty } from "./DirtyContext"; // <-- Import useDirty

type Props = {
  children: React.ReactNode;
  completedSteps?: {
    intended?: boolean;
    curriculum?: boolean;
    landing?: boolean;
    promotions?: boolean;
    pricing?: boolean;
    message?: boolean;
  };
};

function PackageLayoutInner({
  children,
  completedSteps = {},
}: Omit<Props, "isDataSaved" | "setIsDataSaved">) {
  const [stepStatus, setStepStatus] = useState(completedSteps);
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [userId, setUserId] = useState<number | null>(null);

  const { isDirty } = useDirty(); // <-- Use context

  // Fetch userId from sessionStorage once on component mount
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.user_id) {
        setUserId(Number(parsedUser.user_id));
      }
    }
  }, []);

  const linkClass = (route: string) =>
    `list-item ${pathname === route ? "active-purple" : ""}`;

  const handleNavigation = (event: React.MouseEvent, href: string) => {
    event.preventDefault();

    if (isDirty) {
      const confirmLeave = window.confirm(
        "You may have unsaved data. Are you sure you want to leave?"
      );
      if (confirmLeave) {
        router.push(href);
      }
    } else {
      router.push(href);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.returnValue =
          "You may have unsaved data. Are you sure you want to leave?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  const handleFinish = async () => {
    if (!id) {
      alert("Package ID is missing.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/package/${id}/package`);
      if (!res.ok) {
        alert("Failed to fetch package details.");
        return;
      }
      const data = await res.json();

      const missingIntendedLearners =
        !data.intendedLearners ||
        data.intendedLearners.length === 0 ||
        data.intendedLearners.some((il: any) => !il.id);
      const missingCourseLandingPage =
        !data.courseLandingPage || !data.courseLandingPage.id;
      const missingSuccessMessage =
        !data.successMessage || !data.successMessage.id;

      if (
        missingIntendedLearners ||
        missingCourseLandingPage ||
        missingSuccessMessage
      ) {
        alert(
          "You haven't completed the process. Please fill in all required sections."
        );
        return;
      }

      if (data.status === "published") {
        if (userId !== null) {
          alert("Package creation is successfully completed");
          router.push(`/your-courses/${userId}`);
        } else {
          alert("User ID missing");
        }
        return;
      }

      const confirmPublish = window.confirm(
        "Package creation is successfully completed. Do you want to publish now?"
      );

      // Call complete_status update API before publishing or routing
      await fetch(`http://localhost:3000/package/${id}/complete-status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (confirmPublish) {
        // Call the publish API
        const publishRes = await fetch(
          `http://localhost:3000/package/${id}/publish`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!publishRes.ok) {
          alert("Failed to publish the package.");
          return;
        }

        alert("Package published successfully!");
        router.push(`/your-courses/${userId}`);
      } else {
        alert("You can publish later.");
        if (userId !== null) {
          router.push(`/your-courses/${userId}`);
        } else {
          alert("User ID missing");
        }
      }
    } catch (error) {
      alert("An error occurred while fetching package details.");
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="layout-wrapper">
        <aside className="sidebar">
          <div>
            <h2>Plan your course</h2>
            <ul>
              <li>
                <Link
                  href={`/teaching-page/package-page/${id}/intended-learners`}
                  className={linkClass(
                    `/teaching-page/package-page/${id}/intended-learners`
                  )}
                  onClick={(e) =>
                    handleNavigation(
                      e,
                      `/teaching-page/package-page/${id}/intended-learners`
                    )
                  }
                >
                  <span
                    className={`step-indicator ${
                      stepStatus.intended ? "completed" : ""
                    } ${
                      pathname ===
                      `/teaching-page/package-page/${id}/intended-learners`
                        ? "active-purple"
                        : ""
                    }`}
                  />
                  Intended learners
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2>Create your content</h2>
            <ul>
              <li>
                <Link
                  href={`/package/${id}/curriculum`}
                  className={linkClass(`/package/${id}/curriculum`)}
                  onClick={(e) =>
                    handleNavigation(e, `/package/${id}/curriculum`)
                  }
                >
                  <span
                    className={`step-indicator ${
                      stepStatus.curriculum ? "completed" : ""
                    } ${
                      pathname === `/package/${id}/curriculum`
                        ? "active-purple"
                        : ""
                    }`}
                  />
                  Curriculum
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2>Publish your package</h2>
            <ul>
              <li>
                <Link
                  href={`/teaching-page/package-page/${id}/course-landing-page`}
                  className={linkClass(
                    `/teaching-page/package-page/${id}/course-landing-page`
                  )}
                  onClick={(e) =>
                    handleNavigation(
                      e,
                      `/teaching-page/package-page/${id}/course-landing-page`
                    )
                  }
                >
                  <span
                    className={`step-indicator ${
                      stepStatus.landing ? "completed" : ""
                    } ${
                      pathname ===
                      `/teaching-page/package-page/${id}/course-landing-page`
                        ? "active-purple"
                        : ""
                    }`}
                  />
                  Course landing page
                </Link>
              </li>

              <li>
                <Link
                  href={`/teaching-page/package-page/${id}/pricing`}
                  className={linkClass(
                    `/teaching-page/package-page/${id}/pricing`
                  )}
                  onClick={(e) =>
                    handleNavigation(e, `/teaching-page/package-page/${id}/pricing`)
                  }
                >
                  <span
                    className={`step-indicator ${
                      stepStatus.pricing ? "completed" : ""
                    } ${
                      pathname === `/teaching-page/package-page/${id}/pricing`
                        ? "active-purple"
                        : ""
                    }`}
                  />
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href={`/teaching-page/package-page/${id}/course-message`}
                  className={linkClass(
                    `/teaching-page/package-page/${id}/course-message`
                  )}
                  onClick={(e) =>
                    handleNavigation(
                      e,
                      `/teaching-page/package-page/${id}/course-message`
                    )
                  }
                >
                  <span
                    className={`step-indicator ${
                      stepStatus.message ? "completed" : ""
                    } ${
                      pathname ===
                      `/teaching-page/package-page/${id}/course-message`
                        ? "active-purple"
                        : ""
                    }`}
                  />
                  Course message
                </Link>
              </li>
            </ul>
          </div>

          {/* Finish button */}
          <div className="finish-button-wrapper" style={{ padding: "1rem" }}>
            <button
              onClick={handleFinish}
              style={{ backgroundColor: '#800080' }}
              className="bg-purple-900 hover:bg-purple-900 text-white font-bold py-2 px-4 rounded w-full"
            >
              Finish
            </button>
          </div>
        </aside>

        <main className="main-content">{children}</main>
      </div>

      <Footer />
    </>
  );
}

// Wrap the layout with DirtyProvider
export default function PackageLayout(props: Props) {
  return (
    <DirtyProvider>
      <PackageLayoutInner {...props} />
    </DirtyProvider>
  );
}
