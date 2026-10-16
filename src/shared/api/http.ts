import axios from "axios";
import { ZodError } from "zod";

export const http = axios.create({ timeout: 15_000 });

export const handleApiError = (error: unknown): string => {
  if (error instanceof ZodError) {
    return "Invalid response from data source.";
  }

  if (axios.isAxiosError(error)) {
    if (error.response?.status === 429) {
      return "Request limit reached. Try again later.";
    }
    if (!error.response) {
      return "Connection failed. Please try again.";
    }
    return "Could not load data. Please try again.";
  }

  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
};
