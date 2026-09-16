import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getToolBySlug, TOOLS } from "@/lib/tools/registry";
import { ToolShell } from "@/components/tools/ToolShell";
import { ToolRouter } from "@/components/tools/ToolRouter";

export async function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return { title: "Tool nicht gefunden — ChicoCode" };
  return {
    title: `${tool.name} — ChicoCode Tools`,
    description: tool.description,
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  return (
    <ToolShell tool={tool}>
      <ToolRouter slug={slug} />
    </ToolShell>
  );
}
