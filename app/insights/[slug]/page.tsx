import { AIMatterApp } from "../../ui/AIMatterApp";

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <AIMatterApp initialSlug={slug} />;
}
