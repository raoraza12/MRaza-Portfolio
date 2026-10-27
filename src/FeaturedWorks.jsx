import React, { useRef, useState, useEffect } from 'react';
import nexusImg from './assets/projects/nexus-ai-book.png';
import cloudWarehouseImg from './assets/projects/cloud-data-warehouse.jpg';
import drakeImg from './assets/projects/drakewears.png';
import earthyImg from './assets/projects/earthyelectronics.png';
import healthImg from './assets/projects/healthmate.png';
import saltImg from './assets/projects/saltnpepper.png';
import cloudImg from './assets/projects/saylani-hackathon-cloud.png';

const PROJECTS = [
  {
    id: 'nexus-ai-book',
    title: 'Nexus AI Book',
    desc: 'Intelligent book reading platform with neural context exploration, interactive sidebar syntheses, and real-time comprehension dialogue.',
    stack: 'Next.js • TypeScript • Supabase • Python AI',
    liveUrl: 'https://nexus-ai-book.vercel.app',
    githubUrl: 'https://github.com/raoraza12/Nexus-Ai-book',
    img: nexusImg,
    size: 'big',
    side: 'left',
  },
  {
    id: 'cloud-data-warehouse',
    title: 'Cloud Data Warehouse',
    desc: 'Enterprise ETL pipeline and 3D cyber-forensic operations center with real-time biometric telemetry ingestion, data cleaning, automated warehousing, and CFO analytics.',
    stack: 'Python • Cloud Data Pipeline • SQL • 3D Telemetry • Fast Stream Ingestion',
    liveUrl: 'https://cfo-dashboard.vercel.app',
    img: cloudWarehouseImg,
    size: 'half',
    side: 'left',
  },
  {
    id: 'drakewears',
    title: 'Drake Wears',
    desc: 'High-fashion apparel storefront engineered with smooth Lenis inertia physics, interactive cart drawer, and high-performance Postgres backend.',
    stack: 'React • Node.js • Express • PostgreSQL • Prisma • Lenis',
    liveUrl: 'https://drakewears.com',
    githubUrl: 'https://github.com/raoraza12/drakewears',
    img: drakeImg,
    size: 'half',
    side: 'right',
  },
  {
    id: 'earthy-electronics',
    title: 'Earthy Electronics',
    desc: 'Eco-conscious electronics marketplace with carbon-neutral metrics, Google Gemini AI integration, real-time web scrapers, and Framer Motion.',
    stack: 'React • Node.js • Express • Gemini AI • MySQL • Puppeteer',
    liveUrl: 'https://earthyelectronics.com',
    githubUrl: 'https://github.com/raoraza12/earthy-electronics',
    img: earthyImg,
    size: 'half',
    side: 'left',
  },
  {
    id: 'healthmate',
    title: 'HealthMate Telemetry',
    desc: 'Patient telemetry dashboard and telemedicine management portal featuring Google Gemini AI diagnostics, MongoDB persistence, and Cloudinary.',
    stack: 'React • Node.js • Express • MongoDB • Gemini AI • Tailwind',
    liveUrl: 'https://healthmate-frontend-five.vercel.app/',
    githubUrl: 'https://github.com/raoraza12/HealthMate',
    img: healthImg,
    size: 'half',
    side: 'right',
  },
  {
    id: 'salt-and-pepper',
    title: 'Salt & Pepper',
    desc: 'Fine-dining culinary ordering system with interactive dish customization, wine-pairing recommendations, and table reservation scheduling.',
    stack: 'HTML5 Semantic • Modern CSS3 • JavaScript • Vercel',
    liveUrl: 'https://salt-and-pepper-flax.vercel.app',
    githubUrl: 'https://github.com/raoraza12/SALT-AND-PEPPER',
    img: saltImg,
    size: 'big',
    side: 'left',
  },
  {
    id: 'indus-weave-hr',
    title: 'Indus Weave HR Pipeline',
    desc: 'Saylani Cloud Hackathon enterprise forensic HR telemetry & star-schema data warehouse. Automated ETL across 470k+ records, 22/22 automated test suites, and 3D cyber-operations center.',
    stack: 'Python • SQLite Star-Schema • 3D Telemetry • Data Quality • Three.js',
    liveUrl: 'https://github.com/raoraza12/saylani-Hackthon-Cloud',
    githubUrl: 'https://github.com/raoraza12/saylani-Hackthon-Cloud',
    img: cloudImg,
    size: 'big',
    side: 'left',
  },
];

function SlideCard({ project }) {
  const slideRef = useRef(null);

  useEffect(() => {
    const el = slideRef.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-in');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        el.classList.toggle('is-in', entry.isIntersecting);
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const visitUrl = project.liveUrl || project.githubUrl;

  return (
    <article
      ref={slideRef}
      className={`proj-slide proj-slide--${project.size} proj-slide--from-${project.side}`}
    >
      <img src={project.img} alt={project.title} loading="lazy" draggable="false" />
      <div className="proj-info">
        <span className="proj-line" aria-hidden="true" />
        <h3 className="proj-name">{project.title}</h3>
        <p className="proj-desc">{project.desc}</p>
        <div className="proj-links">
          {visitUrl && (
            <a href={visitUrl} target="_blank" rel="noreferrer">
              Visit ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function FeaturedWorks() {
  const sectionRef = useRef(null);

  return (
    <section ref={sectionRef} className="fw-section" id="projects" aria-label="Featured Works">
      <h2 className="fw-heading">Featured Works</h2>

      <div className="fw-projects">
        <SlideCard project={PROJECTS[0]} />

        <div className="proj-row">
          <SlideCard project={PROJECTS[1]} />
          <SlideCard project={PROJECTS[2]} />
        </div>

        <div className="proj-row">
          <SlideCard project={PROJECTS[3]} />
          <SlideCard project={PROJECTS[4]} />
        </div>

        <SlideCard project={PROJECTS[5]} />
      </div>
    </section>
  );
}
