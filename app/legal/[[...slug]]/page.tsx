import { format, formatDistanceToNow, isAfter, subDays } from "date-fns";
import { createRelativeLink } from "fumadocs-ui/mdx";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { source } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";

function _formatLastModified(date: Date | string | undefined): string {
  if (!date) return "Unknown";

  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const sevenDaysAgo = subDays(now, 7);

  if (isAfter(dateObj, sevenDaysAgo)) {
    return formatDistanceToNow(dateObj, { addSuffix: true });
  }

  const currentYear = now.getFullYear();
  const dateYear = dateObj.getFullYear();

  if (dateYear === currentYear) {
    return format(dateObj, "MMMM do");
  } else {
    return format(dateObj, "MMMM do, yyyy");
  }
}

export default async function Page(props: PageProps<"/legal/[[...slug]]">) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDXContent = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <div>
        {page.data.effective && (
          <p style={{ fontSize: "0.875em" }}>
            <strong>Effective Date:</strong>{" "}
            {format(page.data.effective, "MMMM do, yyyy")}
          </p>
        )}
        <p style={{ fontSize: "0.875em" }}>
          <strong>Last modified:</strong>{" "}
          {_formatLastModified(page.data.lastModified)}
        </p>
      </div>
      <hr />
      <DocsBody>
        <MDXContent
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(
  props: PageProps<"/legal/[[...slug]]">,
): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
