"use client";

import React from "react";
import { Card, CardBody, CardHeader, Button } from "@nextui-org/react";

// reusable error UI to be dropped inside any page/form when something goes wrong.
interface ErrorCardProps {
  message: string; // main error text
  title?: string; // optional header text
  onRetry?: () => void; // optional retry callback
}


export function ErrorCard({ message, title = "Something went wrong", onRetry }: ErrorCardProps) {
  return (
    <Card className="border border-danger-300 bg-danger-50" shadow="none">
      <CardHeader className="text-sm font-semibold text-danger-700">
        {title}
      </CardHeader>
      <CardBody className="flex flex-col gap-3 text-sm text-danger-700">
        <p>{message}</p>
        {onRetry && (
          <Button
            size="sm"
            variant="flat"
            color="danger"
            className="self-start"
            onPress={onRetry}
          >
            Try again
          </Button>
        )}
      </CardBody>
    </Card>
  );
}
