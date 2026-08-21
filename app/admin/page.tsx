import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePortfolioAdmin } from "./access";
import PortfolioManager from "./portfolio-manager";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requirePortfolioAdmin("/admin");
  if (!user) notFound();
  return <main className="admin-shell"><header className="admin-header"><Link href="/" className="brand">Mona Moradi</Link><span>Portfolio management</span><Link href="/" className="admin-exit">View site ↗</Link></header><PortfolioManager administrator={user.displayName} /></main>;
}
