"use client";

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
import type { ApodResponse} from "@/types/nasa";
import type { ApodFormData } from "@/types/apod";
import { ApodSkeleton } from "./ApodSkeleton";
import { ApodEmptyCard } from "./ApodEmptyCard";
import { ApodErrorCard } from "./ApodErrorCard";


export function ApodSearchSection() { // this function stores whatever the user typed into the form (date).
  const [form, setForm] = useState<ApodFormData>({ date: "" });
  // UI states
  const [loading, setLoading] = useState(false); // controls spinner + disabling button
  const [error, setError] = useState<string | null>(null); // error message display
  const [result, setResult] = useState<ApodResponse | null>(null); // APOD result from backend

  //  update the date field
  const handleDateChange = (value: string) => {
    setForm({ date: value });
  };

  // front-end validation before sending to backend
  const validateForm = (data: ApodFormData): string | null => {
    if (!form.date) return "Please select a date.";
    return null; // no issues
  };

  // when the user hits the submit button
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // stops the page from reloading
    setError(null);
    setResult(null);

    // run validation before calling backend
    const validationError = validateForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true); // turn on skeleton loading state

    try {
      // send a request to backend route at /api/apod
      const res = await fetch(`/api/apod?date=${form.date}`);

      // read backend's response
      const json = await res.json();
      if (!json.ok) { setError(json.error); return; }
      const apod = Array.isArray(json.data) ? json.data[0] : json.data;
      setResult(apod);
    } catch (err) {
      // internet issue or fetch error
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false); // hide spinner
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
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row gap-3 items-stretch md:items-end"
          >
            {/* controlled date input using HeroUI */}
            <Input
              type="date"
              label="Date"
              value={form.date}
              onValueChange={handleDateChange}
              isRequired // adds a * and required styling
              variant="bordered"
              className="md:max-w-xs"
              max={new Date().toISOString().split("T")[0]} // can't pick future
            />

            {/* submit button 
            UPDATED SUBMIT BUTTON
            To remove spinner inside "Get APOD" button and let skeleton handle visual loading instead
            Button now disables while loading and lets users focus on skeleton content instead of spinner inside button*/}
            <Button
              type="submit"
              color="primary"
              isDisabled={loading} // can't double-click while loading
              className="md:w-auto w-full"
            >
              Get APOD
            </Button>
          </form>
        </CardBody>
      </Card>

      {/* Loading Skeleton */}
      {loading && !result && <ApodSkeleton />}

      {/* Branded Empty State */}
      {!loading && !error && !result && <ApodEmptyCard />}

      {/* Branded Error State */}
      {error && <ApodErrorCard message={error} />}

      {/* results card: shows NASA APOD data */}
      {result && (
        <Card>
          <CardHeader className="flex flex-col items-start gap-1">
            <h2 className="text-lg font-semibold">{result.title}</h2>
            <p className="text-xs text-default-400">
              {result.date}
            </p>
          </CardHeader>

          <CardBody className="flex flex-col gap-4">
            {/* NASA returns image, show it */}
            {result.media_type === "image" ? (
              <Image
                src={result.url}
                alt={result.title}
                className="max-h-[450px] object-contain"
              />
            ) : (
              // if video, show it embedded in the webpage
              <div className="relative w-full aspect-video">
                <iframe
                  src={result.url}
                  title={result.title}
                  allowFullScreen
                  className="w-full h-full rounded-lg"
                />
              </div>
            )}

            {/* explanation text */}
            <p className="text-sm leading-relaxed">{result.explanation}</p>
          </CardBody>

          {/* HD image button, show only if NASA returns an HD link */}
          {result.hdurl && (
            <CardFooter>
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
