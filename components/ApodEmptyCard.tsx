"use client";
import React from "react";
import {Card, CardBody} from "@heroui/react";

// Branded Empty State Card
export function ApodEmptyCard() {
  return (
    <Card className="border-dashed border-2 border-primary">
      <CardBody className="flex flex-col items-center justify-center gap-4 py-10 text-center">
        <p className="text-lg font-medium text-default-700">
          No APOD loaded yet.
        </p>
        <p className="text-sm text-default-500">
          Pick a date above and hit submit!
        </p>
      </CardBody>
    </Card>
  );
}