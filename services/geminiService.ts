// DEPRECATED
// All AI logic has been moved to the Backend AURA Engine (backend/services/aiService.ts)
// This file is kept to avoid breaking imports but should no longer be used.

import { Lesson } from "../types";

export const generateLessonContent = async (
  topic: string,
  materialText: string,
  userInterests: string[]
): Promise<Lesson> => {
  console.warn("Client-side generation is deprecated. Please use the backend API.");
  throw new Error("Client-side generation is disabled. Use the backend API.");
};