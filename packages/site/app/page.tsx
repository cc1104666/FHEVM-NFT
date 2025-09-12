import { PrivateNFTDemo } from "@/components/PrivateNFTDemo";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="flex flex-col gap-8 items-center sm:items-start w-full px-3 md:px-0">
        <PrivateNFTDemo />
      </div>
    </main>
  );
}
