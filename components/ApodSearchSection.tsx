"use client";

import React from "react";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Button,
  Image,
} from "@heroui/react";
import type { ApodResponse } from "@/types/nasa";
import { apodFormSchema, type ApodFormData } from "@/types/apod";
import { ApodSkeleton } from "./ApodSkeleton";
import { ApodEmptyCard } from "./ApodEmptyCard";
import { ApodErrorCard } from "./ApodErrorCard";
import { useCustomToast } from "@/app/hooks/useCustomToast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

/**
 * Astronomy Picture of the Day search section.
 *
 * This component:
 *  - stores whatever the user typed into the form (date)
 *  - validates the date on the client (Zod + React Hook Form)
 *  - calls the /api/apod endpoint
 *  - displays loading, empty, error, and result states
 *  - shows toast notifications for success/error
 */
export function ApodSearchSection() {
  const { showSuccess, showError } = useCustomToast();
  
  // UI states
  const [loading, setLoading] = useState(false); // controls spinner + disabling button
  const [error, setError] = useState<string | null>(null); // error message display from backend/network
  const [result, setResult] = useState<ApodResponse | null>(null); // APOD result from backend

  // Clamp the date input to today (no future dates).
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  // React Hook Form setup using the Zod schema for the APOD form.
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ApodFormData>({
    resolver: zodResolver(apodFormSchema), // connect Zod validation
    mode: "onChange", // validate as the user types/changes the date
    defaultValues: {
      date: "",
    },
  });

  // submit handler (only called when the form is valid according to Zod)
  const onSubmit = async (data: ApodFormData) => {
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/apod?date=${data.date}`);
      const json = await res.json();

      if (!json.ok) {
        // Show appropriate error toast based on error type
        if (json.error.includes("API") || json.error.includes("fetch")) {
          showError("NASA API error. Please try again later.");
        } else if (json.error.includes("key") || json.error.includes("DEMO_KEY")) {
          showError("Invalid API key. Please check your configuration.");
        } else {
          showError(json.error);
        }
        setError(json.error || "Failed to load APOD. Please try again.");
        return;
      }

      const apod: ApodResponse = Array.isArray(json.data)
        ? json.data[0]
        : json.data;

      setResult(apod);
      showSuccess("APOD Loaded");
    } catch (err) {
      console.error(err);
      const errorMessage = "Network error. Please check your connection.";
      showError(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col gap-6 max-w-3xl mx-auto">
      {/* Form Card */}
      <Card>
        <CardHeader className="flex flex-col items-start gap-2">
          <h1 className="text-xl font-semibold">Astronomy Picture of the Day</h1>
          <p className="text-sm text-default-500">
            Pick a date to see NASA&apos;s daily picture.
          </p>
        </CardHeader>

        <CardBody>
          {/* form handling the date input */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col md:flex-row gap-3 items-stretch md:items-end"
          >
            {/* APOD date input (validated with Zod + RHF) */}
            <Input
              type="date"
              label="Date"
              isRequired
              variant="bordered"
              className="md:max-w-xs"
              min="1995-06-16"
              max={todayStr}
              // connect this field to React Hook Form
              {...register("date")}
              // show validation state + message
              isInvalid={!!errors.date}
              errorMessage={errors.date?.message}
            />

            {/* Submit button is disabled while loading OR when the form is invalid */}
            <Button
              type="submit"
              color="primary"
              className="md:w-auto w-full"
              isDisabled={loading || !isValid}
            >
              {loading ? "Loading..." : "Get APOD"}
            </Button>
          </form>
        </CardBody>
      </Card>

      {/* Loading Skeleton */}
      {loading && !result && <ApodSkeleton />}

      {/* Empty State (no result, no error, not loading) */}
      {!loading && !error && !result && <ApodEmptyCard />}

      {/* Branded Error State for backend/network issues */}
      {error && <ApodErrorCard message={error} />}

      {/* Result card: shows NASA APOD data */}
      {result && (
        <Card>
          <CardHeader className="flex flex-col items-start gap-1">
            <h2 className="text-lg font-semibold">{result.title}</h2>
            <p className="text-xs text-default-400">{result.date}</p>
          </CardHeader>

          <CardBody className="flex flex-col gap-4">
            {/* NASA returns image or video */}
            {result.media_type === "image" ? (
              <Image
                src={result.url}
                alt={result.title}
                className="max-h-[450px] object-contain"
              />
            ) : (
              <div className="relative w-full aspect-video">
                <iframe
                  src={result.url}
                  title={result.title}
                  allowFullScreen
                  className="w-full h-full rounded-lg"
                />
              </div>
            )}

            {/* Explanation text */}
            <p className="text-sm text-default-600 whitespace-pre-line">
              {result.explanation}
            </p>
          </CardBody>

          {/* Optional footer for HD image link */}
          {result.hdurl && (
            <CardFooter className="flex justify-end">
              <Button
                as="a"
                href={result.hdurl}
                target="_blank"
                rel="noreferrer"
                variant="flat"
                size="sm"
              >
                View HD Image
              </Button>
            </CardFooter>
          )}
        </Card>
      )}
    </section>
  );
}