// app/package-page/[id]/page.tsx
import { redirect } from "next/navigation";

export default function PackageRootPage({ params }: { params: { id: string } }) {
    redirect(`/teaching-page/package-page/${params.id}/intended-learners`);

}
