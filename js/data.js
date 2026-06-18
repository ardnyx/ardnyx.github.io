// ═══════════════════════════════════════════════════════════════
//  PORTFOLIO DATA
//  ─────────────────────────────────────────────────────────────
//  To add a new item: add an object to the relevant array below.
//  To reorder: simply move objects up/down within their array.
//  To pin/feature a writeup: set `pinned: true` on that entry.
// ═══════════════════════════════════════════════════════════════

// ── SITE INFO (fill in your personal details) ────────────────
const SITE = {
  name: "Dann Leyesa",                   // ← Your display name
  title: "Cybersecurity Enthusiast & Developer",  // ← Tagline
  bio: `A brief paragraph about yourself, your interests, and what drives you. 
        Mention your focus areas — cybersecurity, reverse engineering, 
        software development — and what you're currently working on.`,
  // Social / contact links — leave url empty or remove to hide
  socials: [
    { platform: "github",   url: "https://github.com/ardnyx",  label: "GitHub" },
    { platform: "linkedin", url: "https://www.linkedin.com/in/dann-leyesa-1a01b8280/",                            label: "LinkedIn" },
    { platform: "email",    url: "",                            label: "Email" },
    // Add more: { platform: "twitter", url: "...", label: "Twitter" },
  ],
};

// ── SKILLS ───────────────────────────────────────────────────
// Grouped by domain. Reorder groups or items freely.
const SKILLS = [
  {
    category: "Cybersecurity",
    items: ["Reverse Engineering", "CTF Competitions", "Malware Analysis", "Digital Forensics", "OSINT", "Steganography"],
  },
  {
    category: "Development",
    items: ["Python", "JavaScript", "HTML/CSS", "Django", "Git"],
  },
  {
    category: "DevOps & Tools",
    items: ["Docker", "CI/CD", "GitHub Actions", "Linux", "IDA Pro", "GDB/pwndbg"],
  },
];

// ── PROJECTS ─────────────────────────────────────────────────
// Software/dev work. Displayed as cards in a responsive grid.
// Reorder by moving objects. Filter tags should match exactly.
const PROJECTS = [
  {
    title: "Modded Tetris",
    description: "A custom-made tetris with different game modes; chromatic cascade, reversed flex, time trial, flashlight, and classic. Built with vanilla HTML, CSS, and JS.",
    tags: ["Web Development", "Vanilla JS"],
    links: [
      { label: "GitHub", url: "https://github.com/ardnyx/tetris" },
    ],
    image: "images/tetris.png",
    accent: "#BF40BF",
  },
  {
    title: "Payroll System",
    description: "Developed and deployed a web-based comprehensive payroll system for a local beauty & personal care business with around 60 employees; in compliance with Academic Service Learning.",
    tags: ["Web Development", "CI/CD", "Django"],
    links: [],
    images: ["images/asl_1.png", "images/asl_2.png", "images/asl_3.png"],
    accent: "#DC7FD4",
    details: `
      <h4>Role & Contributions</h4>
      <ul>
        <li>Project management and task delegation</li>
        <li>UI design with Figma</li>
        <li>Deployment via Docker to GitHub Container Registry</li>
        <li>CI/CD pipeline with GitHub Actions for seamless updates</li>
      </ul>
      <h4>Skills Learned</h4>
      <ul>
        <li>GitHub Container Registry</li>
        <li>CI/CD</li>
        <li>Containerization (Docker)</li>
        <li>Django</li>
        <li>Project Management</li>
        <li>Figma</li>
      </ul>
    `,
  },
];

// ── CTF & WRITEUPS ───────────────────────────────────────────
// Set `pinned: true` to feature a writeup at the top.
// Only the first WRITEUP_INITIAL_COUNT (see main.js) unpinned
// items show by default; the rest are behind "Show more".
const WRITEUPS = [
  {
    title: "CTF Writeups Collection",
    description: "Compilation of detailed documentation of solutions for various CTF challenges. Focused on reverse engineering and low-level debugging using IDA for disassembly and GDB with pwndbg for debugging.",
    tags: ["Reverse Engineering", "CTF", "Debugging"],
    links: [
      { label: "GitHub", url: "https://github.com/ardnyx/ctf-writeups" },
    ],
    images: ["images/first_branches.png", "images/strlen.png"],
    accent: "#e8845a",
    pinned: true,   // ← This writeup will always show at the top
  },
  // ── Add more writeups here ──
  // {
  //   title: "Challenge Name",
  //   description: "Brief description of the challenge and your approach.",
  //   tags: ["Category"],
  //   links: [{ label: "Writeup", url: "..." }],
  //   accent: "#5b9bd5",
  //   pinned: false,
  // },
];

// ── ACHIEVEMENTS ─────────────────────────────────────────────
// Competitions, awards, certifications.
// `placement` is optional — used for badges (e.g. "3rd", "1st").
const ACHIEVEMENTS = [
  {
    title: "IT Skills Olympics 2024",
    description: "2nd runner up in cybersecurity CTF; with over 60 participating partner colleges and universities. Tested vocabulary and basic knowledge in cybersecurity with a focus on computer networking, reconnaissance, and Metasploit exploitation.",
    tags: ["Cybersecurity", "CTF"],
    placement: "3rd",
    image: "images/makati_ctf.png",
    accent: "#DAEC55",
  },
  {
    title: "Hack The Beat: CTF 2025",
    description: "Participant with over 20 competing teams from different schools around Metro Manila. Challenges included cryptography, OSINT, reverse engineering, and audio-based forensics. Focused and excelled in OSINT and digital forensics.",
    tags: ["Cybersecurity", "CTF"],
    image: "images/jissa_ctf.png",
    accent: "#D60000",
    details: `
      <h4>Skills Learned</h4>
      <ul>
        <li>Steganography tools: binwalk, Steghide, foremost</li>
        <li>OSINT Techniques</li>
      </ul>
    `,
  },
  // ── Add certifications here ──
  // {
  //   title: "CompTIA Security+",
  //   description: "...",
  //   tags: ["Certification"],
  //   placement: null,
  //   accent: "#5b9bd5",
  // },
];

// ── SECTION ORDER ────────────────────────────────────────────
// Controls the order of sections on the page.
// Reorder this array to rearrange entire sections.
const SECTION_ORDER = [
  "hero",
  "about",
  "projects",
  "writeups",
  "achievements",
  "contact",
];
