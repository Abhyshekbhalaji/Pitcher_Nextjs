import { z } from "zod";

export const formSchema = z.object({
  // Title validation
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long.")
    .max(100, "Title cannot exceed 100 characters."),

  // Description validation
  description: z
    .string()
    .min(20, "Description must be at least 20 characters.")
    .max(1000, "Description cannot exceed 1000 characters."),

  // Category validation
  category: z
    .string()
    .min(3, "Category must be at least 3 characters.")
    .max(40, "Category cannot exceed 40 characters."),

  // Image URL validation
  link: z
    .string()
    .url("The link must be a valid URL.")
    .refine(async (url) => {
      try {
        const res = await fetch(url, { method: "HEAD" });
        const contentType = res.headers.get("content-type");
        if (!res.ok || !contentType?.startsWith("image/")) {
          return false;
        }
        return true;
      } catch {
        return false; // Network or other errors
      }
    }, {
      message: "The link must point to a valid image.",
    }),

  // Pitch validation
  pitch: z
    .string()
    .min(10, "Pitch must be at least 10 characters long.")
});

