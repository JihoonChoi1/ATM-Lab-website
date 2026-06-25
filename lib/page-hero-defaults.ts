// Default hero copy for the pages with an editable {Section}PageMeta singleton.
// Single source of truth, imported by both the public page (fallback when no
// row exists yet) and the admin meta editor (pre-fills the form), so the page
// renders identically until someone edits it. Values transcribe the previously
// hardcoded JSX verbatim — "\n" marks a line break the public hero renders as
// <br/>, and " " is the non-breaking space the markup used (&nbsp;).
export const PAGE_HERO_DEFAULTS = {
  members: {
    heroHeadline: "The people behind ATM Lab.",
    heroParagraph:
      "A small principal investigator–led group of postdoctoral researchers, graduate students, and undergraduate interns advancing thermal management research — alongside alumni now working in industry, national labs, and academia.",
  },
  projects: {
    heroHeadline: "Funded research,\nin flight and shipped.",
    heroParagraph:
      "A snapshot of the grants currently driving the lab's experimental work, alongside completed contracts that produced the apparatus, surfaces, and devices we still build on.",
  },
  publications: {
    heroHeadline: "The lab's\npublished record.",
    heroParagraph:
      "Peer-reviewed journal articles, conference papers, and patents produced by ATM Lab and our collaborators. Filter by category and year.",
  },
  lectures: {
    heroHeadline: "Courses taught\nby the lab.",
    heroParagraph:
      "Undergraduate and graduate courses on heat transfer, phase-change phenomena, and experimental thermal-fluid mechanics — taught at Ajou University's Department of Mechanical Engineering.",
  },
  board: {
    heroHeadline: "News & moments\nfrom the lab.",
    heroParagraph:
      "Press coverage, awards, and grant announcements alongside photos from conferences, kickoff meetings, and lab events. Korean titles are preserved verbatim from the legacy site.",
  },
} as const;
