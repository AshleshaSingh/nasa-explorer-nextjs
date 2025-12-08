"use client";
import {Card, CardBody} from "@heroui/react";
import React from "react";

// Skeleton Loader Component
// To replace small button spinner and large card spinner
// Skeleton includes placeholders for title, data, image, explanation and div structures

export function ApodSkeleton() {
  return (
    <Card>
      <CardBody className="flex flex-col gap-6 animate-pulse py-6">
        {/* title skeleton */}
        <div className="h-6 w-48 bg-default-300 rounded-md" />
        {/* date skeleton */}
        <div className="h-4 w-32 bg-default-200 rounded-md" />
        {/* image skeleton */}
        <div className="w-full h-[350px] bg-default-300 rounded-xl" />
        {/* explanation skeleton */}
        <div className="flex flex-col gap-2">
          <div className="h-4 w-full bg-default-200 rounded-md" />
          <div className="h-4 w-5/6 bg-default-200 rounded-md" />
          <div className="h-4 w-4/6 bg-default-200 rounded-md" />
        </div>
      </CardBody>
    </Card>
  );
}