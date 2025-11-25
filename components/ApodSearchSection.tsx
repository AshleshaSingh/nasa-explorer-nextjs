"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Button,
  Spinner,
  Image,
} from "@heroui/react";
import type { ApodResponse} from "@/types/nasa";
import type { ApodFormData } from "@/types/apod";

import { ErrorCard } from "@/components/error";

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
      return; // don't continue
    }

    setLoading(true); // turn on spinner

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
            />

            {/* submit button */}
            <Button
              type="submit"
              color="primary"
              isDisabled={loading} // can't double-click while loading
              className="md:w-auto w-full"
            >
              {/* show the spinner while loading */}
              {loading ? (
                <div className="flex items-center gap-2">
                  <Spinner size="sm" />
                  <span>Loading...</span>
                </div>
              ) : (
                "Get APOD"
              )}
            </Button>
          </form>

          {/* error UI using the universal card */}
          {error && (
            <div className="mt-4">
                <ErrorCard message = {error} />
            </div>
          )}
        </CardBody>
      </Card>

      {/* loading state, show big centered spinner */}
      {loading && !result && (
        <Card>
          <CardBody className="flex items-center justify-center py-10">
            <Spinner size="lg" />
          </CardBody>
        </Card>
      )}

      {/* empty state/before any search */}
      {!loading && !error && !result && (
        <Card>
          <CardBody className="text-sm text-default-500">
            No APOD loaded yet — choose a date and hit submit!
          </CardBody>
        </Card>
      )}

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
