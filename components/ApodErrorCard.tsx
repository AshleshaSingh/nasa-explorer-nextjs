"use client";
import React from "react";
import {Card, CardBody} from "@heroui/react";

// Branded Error Card
export function ApodErrorCard({ message }: { message: string }) {
  return (
    <Card className="border border-error-500 bg-error-50">
      <CardBody className="flex flex-col items-center justify-center gap-2 py-6 text-center">
        <div className="text-4xl text-error-500">Error</div>
        <p className="text-sm text-error-700 font-medium">
          Resubmit with a valid date.
        </p>
        <p className="text-xs text-error-600">{message}</p>
      </CardBody>
    </Card>
  );
}