import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function getVersionFolders(docType) {
  const docPath = join(process.cwd(), "content", "docs", docType);
  if (!existsSync(docPath)) return [];

  const items = readdirSync(docPath, { withFileTypes: true });
  return items
    .filter((item) => item.isDirectory() && item.name.startsWith("v"))
    .map((item) => item.name);
}

function getVersionTitle(docType, version) {
  const metaPath = join(
    process.cwd(),
    "content",
    "docs",
    docType,
    version,
    "meta.json",
  );
  if (!existsSync(metaPath)) return null;

  try {
    const meta = JSON.parse(readFileSync(metaPath, "utf-8"));
    return meta.title || null;
  } catch {
    return null;
  }
}

describe("Latest Version Validation", () => {
  const docTypes = ["terms-of-service", "privacy-policy"];

  docTypes.forEach((docType) => {
    describe(`${docType}`, () => {
      it("should have only one folder with '(latest)' in its name", () => {
        const versionFolders = getVersionFolders(docType);
        const latestFolders = versionFolders.filter((version) => {
          const title = getVersionTitle(docType, version);
          return title?.includes("(latest)");
        });

        expect(latestFolders.length).toBe(1);
      });

      it("should have '(latest)' on the highest version folder", () => {
        const versionFolders = getVersionFolders(docType);
        const sortedVersions = versionFolders.sort((a, b) =>
          a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }),
        );

        const highestVersion = sortedVersions[sortedVersions.length - 1];
        const highestTitle = getVersionTitle(docType, highestVersion);

        expect(highestTitle).toContain("(latest)");
      });
    });
  });
});
