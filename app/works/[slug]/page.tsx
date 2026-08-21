import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPortfolioItem, parseGalleryImages } from "../../portfolio";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const work = await getPortfolioItem((await params).slug);
  if (!work) return {};
  return { title: `${work.title} — Mona Moradi`, description: work.description || `${work.type} project by Mona Moradi.`, openGraph: { title: `${work.title} — Mona Moradi`, images: [{ url: work.heroImage }] }, twitter: { title: `${work.title} — Mona Moradi`, images: [work.heroImage] } };
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const work = await getPortfolioItem((await params).slug);
  if (!work) notFound();
  const stills = parseGalleryImages(work.galleryImages);
  return <main className="project"><header className="nav"><Link href="/" className="brand">Mona Moradi</Link><div className="mark" aria-hidden="true"><i /><i /><b /><b /><b /><b /><b /></div><nav aria-label="Primary"><Link href="/#works">← Work</Link><Link href="/#about">□ About</Link><Link href="/#contact">○ Contact</Link></nav></header><div className="layout"><aside className="info"><p className="overline">{work.type}</p><h1>{work.title}</h1><p className="year">[{work.year}]</p><dl><div><dt>Type</dt><dd>{work.type}</dd></div><div><dt>Role</dt><dd>Details to be added</dd></div></dl><details open={Boolean(work.description)}><summary>Project description <span>⌄</span></summary><p>{work.description || "Project description to be added."}</p></details><details open={Boolean(work.credits)}><summary>Credits <span>⌄</span></summary><p>{work.credits || "Credits to be added."}</p></details></aside><section className="media">{work.videoId ? <div className="player"><iframe src={`https://www.youtube-nocookie.com/embed/${work.videoId}?rel=0&modestbranding=1`} title={`${work.title} video`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /><p>Video supplied by the project manager.</p></div> : null}{stills.length ? <div className="stills">{stills.map((still, index) => <figure key={still}><img src={still} alt={`Project still ${index + 1} for ${work.title}`} loading={index === 0 ? "eager" : "lazy"} /><figcaption>Project still {String(index + 1).padStart(2, "0")}</figcaption></figure>)}</div> : null}</section></div></main>;
}
