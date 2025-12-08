"use client";

import React from "react";
import { Card, CardBody, Button } from "@nextui-org/react";

export function ImageSearchErrorCard({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <Card className="border border-danger-200 bg-danger-50 rounded-xl">
      <CardBody className="flex flex-col items-center text-center gap-3 py-8 px-4">
        <h3 className="text-sm font-semibold text-danger-700">
          Unable to load images
        </h3>

        <p className="text-xs text-danger-600 max-w-sm">{message}</p>

        <Button
          color="danger"
          variant="flat"
          size="sm"
          onPress={onRetry}
          className="mt-2"
        >
          Retry
        </Button>
      </CardBody>
    </Card>
  );
}
