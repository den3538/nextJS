"use client";

import { useEffect, useState } from "react";
import { Board, Column } from "../models/models.types";

export function useBoards(initialBoard?: Board | null) {
  const [error, setError] = useState<string | null>(null);

  const board = initialBoard;
  const columns = board?.columns ?? [];

  async function moveJob(
    jobApplicationId: string,
    newColumnId: string,
    newOrder: string,
  ) {}

  return { board, columns, error, moveJob };
}
