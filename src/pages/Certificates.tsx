// src/pages/Certificates.tsx
import { useState } from "react";
import { certificates, type Certificate } from "../data/certificates.ts";

const FILTERS: { key: "all" | Certificate["category"]; label: string }[] = [
  { key: "all", label: "All" },
  { key: "kubernetes", label: "Kubernetes" },
  { key: "cloud", label: "Cloud" },
  { key: "iac", label: "IaC" },
  { key: "devops", label: "DevOps" },
];

export default function Certificates() {
  const [filter, setFilter] = useState<"all" | Certificate["category"]>("all");
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false); // 👈 Top vs All

  const topCertificates = certificates.filter((c) => c.isTop);

  const baseList = showAll ? certificates : topCertificates;

  const filteredCertificates = baseList.filter((cert) => {
    const matchesCategory = filter === "all" || cert.category === filter;
    const matchesSearch =
      cert.title.toLowerCase().includes(search.toLowerCase()) ||
      cert.issuer.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-black min-h-screen text-white py-24 px-6">
      {/* TITLE */}
      <h1 className="text-5xl font-bold text-center mb-6 tracking-tight">
        Professional Certifications
      </h1>

      {/* SUBTEXT */}
      <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto text-lg">
        Curated certifications that reflect my core strengths in Kubernetes,
        cloud, and infrastructure automation.
      </p>

      {/* PREP BANNER */}
      <div className="max-w-5xl mx-auto mb-16 text-center">
        <div className="inline-block bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-black px-10 py-4 rounded-full font-black text-lg tracking-widest shadow-2xl">
          🚧 Currently preparing — AWS Solutions Architect Associate 🚧
        </div>
      </div>

      {/* SEARCH */}
      <div className="max-w-4xl mx-auto mb-10 text-center">
        <input
          type="text"
          placeholder="Search certifications..."
          className="bg-black border border-gray-700 px-6 py-3 rounded-xl w-full md:w-1/2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* FILTERS + TOGGLE */}
      <div className="max-w-4xl mx-auto mb-14 flex flex-col gap-6 items-center">
        {/* Filters */}
        <div className="flex justify-center gap-4 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`px-6 py-2 rounded-full text-sm font-semibold tracking-wide transition ${
                filter === f.key
                  ? "bg-white text-black"
                  : "bg-gray-900 border border-gray-700 hover:bg-gray-800"
              }`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Top vs All toggle */}
        <button
          onClick={() => setShowAll((prev) => !prev)}
          className="text-sm font-semibold text-blue-400 hover:text-blue-300 underline underline-offset-4"
        >
          {showAll ? "Show only top certifications" : "View all certifications"}
        </button>
      </div>

      {/* SECTION LABEL */}
      <div className="max-w-5xl mx-auto mb-6">
        <p className="text-gray-500 text-sm tracking-widest uppercase">
          {showAll ? "All Certifications" : "Top Certifications"}
        </p>
      </div>

      {/* CERTIFICATE CARDS */}
      <div className="max-w-5xl mx-auto space-y-12">
        {filteredCertificates.map((cert) => (
          <div
            key={cert.id}
            className="bg-gray-900 p-10 rounded-3xl border border-gray-800 shadow-2xl hover:shadow-[0_0_40px_rgba(59,130,246,0.35)] transition"
          >
            <div className="flex justify-between items-start flex-wrap gap-4">
              <h2 className="text-2xl font-bold tracking-wide">
                {cert.badge} {cert.title}
              </h2>
              <span className="text-gray-400 text-sm font-semibold">
                {cert.date}
              </span>
            </div>

            <p className="text-gray-400 mt-3 text-sm">
              Issuer: <span className="font-medium">{cert.issuer}</span>
            </p>

            {cert.id && (
              <p className="text-gray-500 text-xs mt-1 tracking-wide">
                Certificate ID: {cert.id}
              </p>
            )}

            {/* DESCRIPTION / NOTES */}
            {cert.notes && (
              <p className="mt-6 text-gray-300 text-sm leading-relaxed">
                {cert.notes}
              </p>
            )}

            {/* ACTIONS */}
            <div className="flex flex-wrap gap-4 mt-8">
              {cert.credlyLink && (
                <a
                  href={cert.credlyLink}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-2xl text-sm font-bold text-white tracking-wide transition shadow-lg"
                >
                  🔗 View Credly Badge
                </a>
              )}

              {cert.prepNotesLink && (
                <a
                  href={cert.prepNotesLink}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-2xl text-sm font-bold text-white tracking-wide transition shadow-lg"
                >
                  📄 View Prep Notes
                </a>
              )}
            </div>
          </div>
        ))}

        {/* Empty state */}
        {filteredCertificates.length === 0 && (
          <p className="text-center text-gray-500 mt-16">
            No certifications found for this filter/search.
          </p>
        )}
      </div>
    </div>
  );
}




