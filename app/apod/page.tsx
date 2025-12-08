// import APOD search UI
import { ApodSearchSection } from "@/components/ApodSearchSection";

export default function ApodPage() {
  return (
    <main className="flex flex-col items-center justify-center px-4 py-8 md:py-10">
      {/* adding APOD Form UI */}
      <section className="w-full max-w-4xl mt-12">
        <ApodSearchSection />
      </section>
    </main>
  );
}
