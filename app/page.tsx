// app/page.tsx
"use client";

// The homepage displays a simple NASA-themed introduction
// and clear navigation buttons for APOD Search + Image Search.

import { Link } from "@heroui/link";
import { Button, Card, CardBody } from "@nextui-org/react";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      {/* Title */}
      <h1 className="text-4xl font-bold tracking-tight">🌌 NASA Explorer</h1>

      {/* Subtitle */}
      <p className="text-base text-default-500 mt-3 max-w-md">
        Explore NASA’s Astronomy Picture of the Day and the NASA Image Library.
        Search breathtaking images of galaxies, nebulae, planets, and space
        missions.
      </p>

      {/* Navigation Section */}
      <div className="flex gap-4 mt-8 flex-col sm:flex-row">
        <Link href="/apod">
          <Button className="px-6" color="primary" variant="shadow">
            🚀 APOD – Picture of the Day
          </Button>
        </Link>

        <Link href="/images">
          <Button className="px-6" color="secondary" variant="bordered">
            🪐 NASA Image Search
          </Button>
        </Link>
      </div>

      {/* Footer message */}
      <Card className="mt-10 border border-default-200 w-full max-w-md bg-default-50">
        <CardBody className="text-sm text-default-600">
          This project is part of CSU Web Engineering — API Integration + UI +
          Testing + Deployment.
        </CardBody>
      </Card>
    </main>
  );
}
