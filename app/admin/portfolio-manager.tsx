"use client";

import { FormEvent, useEffect, useState } from "react";

type Item = { id: number; slug: string; title: string; type: string; year: string; heroImage: string; videoId: string; galleryImages: string; description: string; credits: string; sortOrder: number };
type Draft = Omit<Item, "id" | "galleryImages"> & { galleryImages: string };

const emptyDraft: Draft = { slug: "", title: "", type: "Film", year: "—", heroImage: "/assets/project-blue-room.png", videoId: "", galleryImages: "", description: "", credits: "", sortOrder: 0 };
const toDraft = (item: Item): Draft => ({ ...item, galleryImages: JSON.parse(item.galleryImages || "[]").join("\n") });

export default function PortfolioManager({ administrator }: { administrator: string }) {
  const [items, setItems] = useState<Item[]>([]);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [status, setStatus] = useState("Loading collection…");

  async function load() {
    const response = await fetch("/api/admin/portfolio", { cache: "no-store" });
    if (!response.ok) { setStatus("Unable to load the collection."); return; }
    setItems(await response.json()); setStatus("");
  }
  useEffect(() => {
    let active = true;
    fetch("/api/admin/portfolio", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data: Item[]) => { if (active) { setItems(data); setStatus(""); } })
      .catch(() => { if (active) setStatus("Unable to load the collection."); });
    return () => { active = false; };
  }, []);

  function update(field: keyof Draft, value: string) { setDraft((current) => ({ ...current, [field]: field === "sortOrder" ? Number(value) : value })); }
  function reset() { setDraft(emptyDraft); setEditingId(null); setStatus(""); }
  function edit(item: Item) { setDraft(toDraft(item)); setEditingId(item.id); setStatus(""); window.scrollTo({ top: 0, behavior: "smooth" }); }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus("Saving…");
    const body = { ...draft, galleryImages: draft.galleryImages.split("\n").map((url) => url.trim()).filter(Boolean) };
    const response = await fetch(editingId ? `/api/admin/portfolio/${editingId}` : "/api/admin/portfolio", { method: editingId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!response.ok) { const result = await response.json().catch(() => ({})); setStatus(result.error || "Unable to save this project."); return; }
    await load(); reset(); setStatus(editingId ? "Project updated." : "Project created.");
  }

  async function remove(item: Item) {
    if (!window.confirm(`Delete “${item.title}”? This cannot be undone.`)) return;
    setStatus("Deleting…");
    const response = await fetch(`/api/admin/portfolio/${item.id}`, { method: "DELETE" });
    if (!response.ok) { setStatus("Unable to delete this project."); return; }
    if (editingId === item.id) reset(); await load(); setStatus("Project deleted.");
  }

  return <div className="admin-grid"><section className="admin-intro"><p className="overline">Signed in as</p><h1>{administrator}</h1><p>Every entry uses the same public project template. Image fields accept public URLs or the included placeholder paths; gallery stills are one URL per line.</p></section><section className="editor"><div className="editor-heading"><p className="overline">{editingId ? "Edit project" : "New project"}</p>{editingId ? <button type="button" onClick={reset}>Cancel</button> : null}</div><form onSubmit={submit}><label>Title<input required value={draft.title} onChange={(event) => update("title", event.target.value)} /></label><label>Slug<input required pattern="[a-z0-9]+(-[a-z0-9]+)*" value={draft.slug} onChange={(event) => update("slug", event.target.value)} /><small>Lowercase, hyphenated URL: e.g. quiet-river</small></label><div className="form-row"><label>Type<input value={draft.type} onChange={(event) => update("type", event.target.value)} /></label><label>Year<input value={draft.year} onChange={(event) => update("year", event.target.value)} /></label><label>Order<input type="number" value={draft.sortOrder} onChange={(event) => update("sortOrder", event.target.value)} /></label></div><label>Hero image URL<input required value={draft.heroImage} onChange={(event) => update("heroImage", event.target.value)} /></label><label>YouTube video ID <input value={draft.videoId} onChange={(event) => update("videoId", event.target.value)} /><small>Use only the video ID, not the full URL. Leave blank if the project has no video.</small></label><label>Gallery still URLs<textarea rows={5} value={draft.galleryImages} onChange={(event) => update("galleryImages", event.target.value)} /></label><label>Project description<textarea rows={4} value={draft.description} onChange={(event) => update("description", event.target.value)} /></label><label>Credits<textarea rows={3} value={draft.credits} onChange={(event) => update("credits", event.target.value)} /></label><div className="form-actions"><button className="admin-primary" type="submit">{editingId ? "Save changes" : "Create project"} ↗</button><output aria-live="polite">{status}</output></div></form></section><section className="collection"><div className="collection-head"><p className="overline">Collection</p><span>{items.length} items</span></div>{items.map((item) => <article className="admin-item" key={item.id}><img src={item.heroImage} alt="" /><div><p>{item.type} · {item.year}</p><h2>{item.title}</h2><code>/works/{item.slug}</code></div><div className="item-actions"><button type="button" onClick={() => edit(item)}>Edit</button><button type="button" onClick={() => void remove(item)}>Delete</button></div></article>)}</section></div>;
}
