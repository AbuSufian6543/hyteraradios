import { describe, expect, it } from "vitest";
import { backupErrorMessage, databaseUrlForPgTools } from "./backup";

describe("databaseUrlForPgTools", () => {
  it("strips Prisma schema query param", () => {
    expect(
      databaseUrlForPgTools(
        "postgresql://postgres:postgres@db:5432/radio_store?schema=public",
      ),
    ).toBe("postgresql://postgres:postgres@db:5432/radio_store");
  });

  it("preserves URLs without query params", () => {
    expect(
      databaseUrlForPgTools("postgresql://postgres:postgres@db:5432/radio_store"),
    ).toBe("postgresql://postgres:postgres@db:5432/radio_store");
  });
});

describe("backupErrorMessage", () => {
  it("returns rebuild hint when pg_dump is missing", () => {
    expect(backupErrorMessage(new Error("pg_dump not found"))).toBe(
      "Backup tools not installed. Rebuild the Docker image.",
    );
  });

  it("returns generic message for other failures", () => {
    expect(backupErrorMessage(new Error("pg_dump exited with code 1"))).toBe(
      "Backup failed. Check server logs.",
    );
  });
});
