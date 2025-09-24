import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function extractRedirectTarget(content) {
  const match = content.match(/redirect\(["']([^"']+)["']\)/);
  return match ? match[1] : null;
}

function pathExistsInContent(targetPath) {
  // Remove leading slash and split path
  const pathParts = targetPath.replace(/^\//, "").split("/");
  let currentPath = join(process.cwd(), "content", "docs");

  for (let i = 0; i < pathParts.length; i++) {
    const part = pathParts[i];
    if (part === "legal") continue; // Skip the base route part

    // For the last part, try both with and without .mdx extension
    if (i === pathParts.length - 1) {
      const filePath = join(currentPath, `${part}.mdx`);
      const dirPath = join(currentPath, part);
      return existsSync(filePath) || existsSync(dirPath);
    }

    currentPath = join(currentPath, part);

    if (!existsSync(currentPath)) {
      return false;
    }

    // Must be a directory for intermediate parts
    const stat = statSync(currentPath);
    if (!stat.isDirectory()) {
      return false;
    }
  }

  return true;
}

function _getLatestVersion(docType) {
  const docPath = join(process.cwd(), "content", "docs", docType);
  if (!existsSync(docPath)) return null;

  const items = readdirSync(docPath, { withFileTypes: true });
  const versionDirs = items
    .filter((item) => item.isDirectory() && item.name.startsWith("v"))
    .map((item) => item.name)
    .sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }),
    );

  return versionDirs.length > 0 ? versionDirs[versionDirs.length - 1] : null;
}

function _getDocumentName(docType) {
  // Map document types to their main file names
  const docNames = {
    "terms-of-service": "terms",
    "privacy-policy": "privacy-policy",
  };
  return docNames[docType] || docType;
}

describe("Content Validation", () => {
  it("should have content directory structure", () => {
    const contentDir = join(process.cwd(), "content", "docs");
    expect(existsSync(contentDir)).toBe(true);

    // Check that we have some MDX files
    const files = readdirSync(contentDir, { recursive: true });
    const mdxFiles = files.filter(
      (file) => typeof file === "string" && file.endsWith(".mdx"),
    );
    expect(mdxFiles.length).toBeGreaterThan(0);
  });
});

describe("Redirect Validation", () => {
  const redirects = [
    {
      name: "terms",
      filePath: "app/legal/terms/page.tsx",
    },
    {
      name: "terms-of-service",
      filePath: "app/legal/terms-of-service/page.tsx",
    },
    {
      name: "privacy-policy",
      filePath: "app/legal/privacy-policy/page.tsx",
    },
  ];

  redirects.forEach(({ name, filePath }) => {
    it(`should have valid ${name} redirect`, () => {
      const fullPath = join(process.cwd(), filePath);
      expect(existsSync(fullPath)).toBe(true);

      const content = readFileSync(fullPath, "utf-8");
      const target = extractRedirectTarget(content);
      expect(target).toBeTruthy();

      // Verify the target path exists in the content structure
      expect(pathExistsInContent(target)).toBe(true);
    });

    it(`should redirect ${name} to latest version`, () => {
      // Skip 'terms' since it redirects to 'terms-of-service'
      if (name === "terms") return;

      const fullPath = join(process.cwd(), filePath);
      const content = readFileSync(fullPath, "utf-8");
      const target = extractRedirectTarget(content);

      const latestVersion = _getLatestVersion(name);
      const docName = _getDocumentName(name);
      const expectedTarget = `/legal/${name}/${latestVersion}/${docName}`;

      expect(target).toBe(expectedTarget);
    });
  });
});
