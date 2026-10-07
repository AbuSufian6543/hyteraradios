import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/components/account/profile-form";
import { AvatarUploader } from "@/components/account/avatar-uploader";
import { StorePageHeader } from "@/components/layout/store-page-header";

export const dynamic = "force-dynamic";

export default async function AccountProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/account/login");
  }

  const profile = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      avatarUrl: true,
      phone: true,
      addressLine1: true,
      addressLine2: true,
      addressCity: true,
      addressState: true,
      addressPostal: true,
      addressCountry: true,
    },
  });

  if (!profile) {
    redirect("/account/login");
  }

  return (
    <>
      <StorePageHeader
        eyebrow="Your account"
        title="My Profile"
        description="Keep your contact details and default shipping address up to date."
      >
        <Link
          href="/account"
          className="mt-4 inline-flex text-sm font-medium text-blue-600 hover:underline"
        >
          &larr; Back to account
        </Link>
      </StorePageHeader>
    <div className="container-page py-10">
      <div className="space-y-6">
        <AvatarUploader
          avatarUrl={profile.avatarUrl}
          name={profile.name}
          email={profile.email}
        />
        <ProfileForm defaults={profile} />
      </div>
    </div>
    </>
  );
}
