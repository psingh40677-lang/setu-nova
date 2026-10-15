import Marketplace from "../../marketplace.jsx";

export default async function SectionPage({ params, searchParams }) {
  const { section, slug = [] } = await params;
  const query = await searchParams;
  return <Marketplace initialPath={[section, ...slug]} initialSearch={query?.q || ""} initialCategory={query?.category || ""} initialOrderFilter={query?.orderId || ""} initialEditId={query?.edit || ""} />;
}
