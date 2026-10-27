import React, { useState, useEffect, useRef } from 'react';
import './ChatModal.css';
import razaImg from './assets/raza_hero.jpg';

const INITIAL_MESSAGES = [
  {
    id: 'm-1',
    sender: 'bot',
    text: "Salam! 👋 Main M Raza Rajput ka AI Portfolio Representative hoon. Main yahan Raza Rajput ki profile, unke full-stack expertise, aur featured projects ke baray me guide karne ke liye integrate kiya gaya hoon. Aap Raza ke baray me kya jaanna chahte hain?",
    time: 'Just now',
  },
];

const QUICK_PILLS = [
  { label: '👤 Raza Rajput kon hain?', query: 'Raza Rajput ke baray me detail do' },
  { label: '🚀 Featured Projects', query: 'Raza ke featured projects kon se hain?' },
  { label: '⚡ Core Tech Stack', query: 'Raza ka tech stack aur skills kya hain?' },
  { label: '🎓 Education & Background', query: 'Raza ki education aur background kya hai?' },
  { label: '💼 Services & Freelance', query: 'Raza kya services offer karte hain?' },
  { label: '📧 Direct Contact', query: 'Raza se rabta kaise karein?' },
];

function renderFormattedText(text) {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, lineIdx) => {
    const parts = line.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g);
    return (
      <React.Fragment key={lineIdx}>
        {parts.map((part, partIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={partIdx} style={{ color: '#ffffff', fontWeight: 700 }}>
                {part.slice(2, -2)}
              </strong>
            );
          }
          const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
          if (linkMatch) {
            return (
              <a
                key={partIdx}
                href={linkMatch[2]}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: '#ff8533',
                  textDecoration: 'underline',
                  fontWeight: 600,
                  wordBreak: 'break-all',
                }}
              >
                {linkMatch[1]} ↗
              </a>
            );
          }
          return part;
        })}
        {lineIdx < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
}

const STORAGE_KEY = 'raza_visitor_chat_history';

export default function ChatModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (_) {}
    return INITIAL_MESSAGES;
  });
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Sync each conversation update to this device's private localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (_) {}
  }, [messages]);

  const handleClearHistory = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {}
    setMessages(INITIAL_MESSAGES);
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
      // Freeze Lenis background scroll while chat modal is open
      if (window.__lenis) {
        window.__lenis.stop();
      }
      setTimeout(() => inputRef.current?.focus(), 250);
    }
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
      // Resume Lenis smooth scroll when chat modal closes
      if (window.__lenis) {
        window.__lenis.start();
      }
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const getTimeString = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const generateReply = (userText) => {
    const text = userText.trim();
    const lower = text.toLowerCase();

    // 0. Specific Project Queries
    if (/\b(nexus|ai book|nexus-ai)\b/i.test(lower)) {
      return {
        text: "📚 **Nexus AI Book** Raza ka flagship AI-native reading project hai!\n\n• **Core Concept:** Intelligent reading platform jo neural context exploration, interactive sidebar syntheses aur real-time comprehension dialogue provide karta hai.\n• **Tech Stack:** Next.js (App Router), TypeScript, Supabase, Python AI backend.\n• **Live Experience:** [nexus-ai-book.vercel.app](https://nexus-ai-book.vercel.app)\n• **GitHub Repository:** [github.com/raoraza12/Nexus-Ai-book](https://github.com/raoraza12/Nexus-Ai-book)",
        showEmailAction: false,
      };
    }

    if (/\b(warehouse|cloud data warehouse|saylani|hackathon|indus|forensic|telemetry)\b/i.test(lower)) {
      return {
        text: "☁️ **Cloud Data Warehouse (Saylani Cloud Hackathon)**:\n\n• **Core Concept:** Enterprise ETL pipeline aur 3D cyber-forensic operations center jo 470,000+ biometric telemetry records par automated cleaning, star-schema warehousing aur real-time CFO analytics handle karta hai.\n• **Tech Stack:** Python, SQLite Star-Schema, Three.js 3D telemetry, Data Quality test suites (22/22 automated suites).\n• **Live Dashboard:** [cfo-dashboard.vercel.app](https://cfo-dashboard.vercel.app)\n• **GitHub:** [github.com/raoraza12/saylani-Hackthon-Cloud](https://github.com/raoraza12/saylani-Hackthon-Cloud)",
        showEmailAction: false,
      };
    }

    if (/\b(drake|drakewears|fashion|clothing|storefront)\b/i.test(lower)) {
      return {
        text: "🛍️ **Drake Wears**:\n\n• **Core Concept:** Luxury fashion streetwear e-commerce platform jisme silky-smooth Lenis inertia scroll physics, interactive slide-out cart drawer, aur high-throughput Postgres transactional engine shamil hai.\n• **Tech Stack:** React, Node.js, Express, PostgreSQL, Prisma ORM, Lenis.\n• **Live Site:** [drakewears.com](https://drakewears.com)\n• **GitHub:** [github.com/raoraza12/drakewears](https://github.com/raoraza12/drakewears)",
        showEmailAction: false,
      };
    }

    if (/\b(earthy|electronics|marketplace|eco|carbon)\b/i.test(lower)) {
      return {
        text: "⚡ **Earthy Electronics**:\n\n• **Core Concept:** Eco-conscious electronics marketplace jo carbon-neutral metrics, Google Gemini AI product analysis, automated web scrapers aur smooth micro-interactions deliver karta hai.\n• **Tech Stack:** React, Node.js, Express, Gemini AI, MySQL, Puppeteer, Framer Motion.\n• **Live Site:** [earthyelectronics.com](https://earthyelectronics.com)\n• **GitHub:** [github.com/raoraza12/earthy-electronics](https://github.com/raoraza12/earthy-electronics)",
        showEmailAction: false,
      };
    }

    if (/\b(healthmate|health|medical|telemedicine|patient|doctor)\b/i.test(lower)) {
      return {
        text: "🩺 **HealthMate Telemetry**:\n\n• **Core Concept:** Advanced patient telemetry dashboard aur telemedicine portal jisme Google Gemini AI automated diagnostics, Cloudinary medical document storage, aur secure doctor-patient appointments hain.\n• **Tech Stack:** React, Node.js, Express, MongoDB, Gemini AI, Tailwind CSS, Cloudinary.\n• **Live Demo:** [healthmate-frontend-five.vercel.app](https://healthmate-frontend-five.vercel.app/)\n• **GitHub:** [github.com/raoraza12/HealthMate](https://github.com/raoraza12/HealthMate)",
        showEmailAction: false,
      };
    }

    if (/\b(salt|pepper|restaurant|food|dining|culinary)\b/i.test(lower)) {
      return {
        text: "🍽️ **Salt & Pepper**:\n\n• **Core Concept:** Fine-dining interactive culinary ordering platform jisme live dish customization, sommelier wine-pairings, aur automated table reservations integrated hain.\n• **Tech Stack:** Semantic HTML5, Modern CSS3 Architecture, Vanilla JavaScript, Vercel.\n• **Live Experience:** [salt-and-pepper-flax.vercel.app](https://salt-and-pepper-flax.vercel.app)\n• **GitHub:** [github.com/raoraza12/SALT-AND-PEPPER](https://github.com/raoraza12/SALT-AND-PEPPER)",
        showEmailAction: false,
      };
    }

    // 1. Direct instruction to generate arbitrary code for the visitor right now (NOT asking what Raza codes)
    if (/\b(write code for me|generate code|make me an app|code likh do|mera code banao|script bana do|kuch code likho)\b/i.test(lower)) {
      return {
        text: "Main Raza Rajput ka portfolio AI assistant hoon — main yahan Raza ke credentials, projects aur skills ko represent karne ke liye integrate kiya gaya hoon. Custom software, full-stack web platforms aur AI systems Raza Rajput khud develop karte hain! Agar aap unke sath project develop karwana chahte hain to direct email (raoraza5417@gmail.com) bhej kar requirements discuss kar sakte hain.",
        showEmailAction: true,
      };
    }

    // 2. Greetings (Salam, Hi, Hello, Wassup)
    if (/\b(salam|assalam|aslam|slam|aoa|assalamualaikum|assalam[ -]?o[ -]?alaikum|asalamu[ -]?alaikum)\b/i.test(lower)) {
      return {
        text: "Walaikum Assalam! 👋 Khush aamdeed! Main M Raza Rajput ka dedicated AI Portfolio Representative hoon.\n\nMain yahan Raza ki profile, technical expertise, projects aur background ke baray me complete guide karne ke liye hazir hoon. Aap Raza ke baray me kya jaanna chahte hain?",
        showEmailAction: false,
      };
    }

    if (/\b(wassup|wazzup|what'?s up|sup|yo|hey|heyy|heyyy|hi|hello|hiya|howdy)\b/i.test(lower)) {
      return {
        text: "Hey there! 🙌 Main M Raza Rajput ka AI portfolio representative hoon.\n\nAap mujh se Raza ke projects, technical skills, background, ya collaboration ke baray me kuch bhi pooch sakte hain. Main aapki kya madad kar sakta hoon?",
        showEmailAction: false,
      };
    }

    if (/\b(how are you|how r u|kese ho|kaise ho|kya haal|kya hal|sub theek|sab theek|sab kaisa)\b/i.test(lower)) {
      return {
        text: "Alhamdulillah, bilkul zabardast! 🚀 Raza ke projects aur portfolio full operational hain. Aap batayein, Raza Rajput ke kis project, skill ya background ke baray me discuss karna chahte hain?",
        showEmailAction: false,
      };
    }

    // 3. Education / Qualifications / Background / Hackathons
    if (/\b(education|study|studies|degree|qualification|qualifications|university|college|school|parhai|parha|background|credential|credentials|hackathon)\b/i.test(lower)) {
      return {
        text: "🎓 **M Raza Rajput — Education & Technical Background**:\n\n• **Core Discipline:** Computer Science & Modern Software Engineering with deep specialization in Web Architecture, Cloud Computing & Applied AI.\n• **Saylani Cloud Hackathon:** Enterprise star-schema data warehouse aur real-time telemetry ETL pipeline architect ki, jisme 470k+ records aur automated test suites build kiye.\n• **Continuous Mastery:** Modern TypeScript/JavaScript ecosystem, Python AI development, 3D web technologies (Three.js/GSAP), aur scalable database engineering me proven track record.",
        showEmailAction: false,
      };
    }

    // 4. Experience / Track Record / Seniority
    if (/\b(experience|tajarba|history|track record|years|seniority|kitna time|past work)\b/i.test(lower)) {
      return {
        text: "💼 **M Raza Rajput — Experience & Track Record**:\n\n• **Full-Stack Engineering:** High-performance web applications, scalable REST/GraphQL APIs, aur secure database architectures (Postgres, Prisma, MongoDB, Supabase) successfully build kiye hain.\n• **AI Systems & Agents:** Google Gemini AI, OpenAI API, aur agentic workflows ko real-world platforms (medical diagnostics, smart book comprehension, automated scrapers) me deploy kiya hai.\n• **Kinetic UI/UX Mastery:** Lenis scroll physics, Three.js 3D telemetry, aur GSAP micro-animations ke zariye award-standard digital experiences create karte hain.\n• **Enterprise & Hackathons:** Saylani Cloud Hackathon me forensic HR telemetry warehouse across 470,000+ data rows deliver kiya.",
        showEmailAction: false,
      };
    }

    // 5. Tech Stack & Skills (specific topic before general profile)
    if (/\b(stack|tech|technology|technologies|skills|skill|frontend|backend|framework|frameworks|languages|language|database|databases|python|react|node|next|three|gsap|tailwind|sql|mongodb|postgres)\b/i.test(lower)) {
      return {
        text: "⚡ **M Raza Rajput — Core Tech Stack & Tools**:\n\n" +
          "• **Frontend:** Next.js (App Router), React 18/19, TypeScript, JavaScript (ES6+), HTML5/CSS3\n" +
          "• **Kinetic UI & 3D:** Three.js, GSAP (ScrollTrigger), Lenis Inertia Physics, Tailwind CSS, Framer Motion\n" +
          "• **Backend & APIs:** Node.js, Express.js, Python (FastAPI/Scripts), RESTful APIs, GraphQL\n" +
          "• **Databases & ORM:** PostgreSQL, Prisma ORM, Supabase, MongoDB (Mongoose), MySQL, SQLite\n" +
          "• **AI & Automation:** Google Gemini AI, OpenAI API, LangChain, Agentic Workflows, Puppeteer\n" +
          "• **DevOps & Tools:** Git, GitHub, Vercel, Cloudinary, Vite",
        showEmailAction: false,
      };
    }

    // 6. Projects & Portfolio Works (General)
    if (/\b(project|projects|work|works|portfolio|showcase|kya banaya|kaam|apps)\b/i.test(lower)) {
      return {
        text: "🚀 **M Raza Rajput ke Key Featured Projects**:\n\n" +
          "1. 📚 **Nexus AI Book:** Intelligent reading platform with neural context exploration (Next.js • TypeScript • Supabase • Python AI).\n" +
          "2. ☁️ **Cloud Data Warehouse (Saylani Cloud Hackathon):** Forensic HR telemetry ETL warehouse across 470k+ records with 3D Cyber Operations Center.\n" +
          "3. 🛍️ **Drake Wears:** Luxury fashion storefront with Lenis physics & Postgres backend.\n" +
          "4. ⚡ **Earthy Electronics:** Eco-conscious marketplace with Google Gemini AI scrapers.\n" +
          "5. 🩺 **HealthMate Telemetry:** Patient telemetry dashboard with Gemini AI medical diagnostics.\n" +
          "6. 🍽️ **Salt & Pepper:** Fine dining ordering & table reservation system.\n\n" +
          "Aap kisi specific project (e.g. *Nexus AI Book* ya *Cloud Data Warehouse*) ke baray me detail pooch sakte hain!",
        showEmailAction: false,
      };
    }

    // 7. Services & Capabilities
    if (/\b(services|service|kya kar sakte|kya kar sakta|offer|capabilities|specialty|specialization|solutions|solution)\b/i.test(lower)) {
      return {
        text: "⚡ **Services Offered by M Raza Rajput**:\n\n" +
          "1. 🌐 **Custom Full-Stack Web Platforms:** Production-grade Next.js, React, Node.js & Python apps with ultra-fast APIs and secure databases.\n" +
          "2. 🤖 **AI Agents & Integrations:** Custom LLM bots, Gemini/OpenAI pipelines, context-aware RAG search, automated scrapers.\n" +
          "3. ✨ **Kinetic UI/UX & Interactive 3D:** Interactive Three.js graphics, GSAP animations, Lenis smooth scrolling, premium micro-interactions.\n" +
          "4. 📱 **Mobile & Progressive Web Apps:** 100% responsive, high-framerate mobile web experiences.\n" +
          "5. ☁️ **Cloud Data Pipelines & Warehouses:** Star-schema ETL data systems, automated data cleaning, real-time analytics dashboards.",
        showEmailAction: true,
      };
    }

    // 8. Who is Raza / Details / Bio / Profile / Overview
    // Catches: "raza kay baray main detail do", "raza k baray me batao", "raza kon hai", "who is raza", "details", "info about raza", etc.
    if (
      /\b(who is raza|who are you|raza kon|raza kaun|about raza|introduce|introduction|bio|profile|biography|kuch batao|detail|details|info|information)\b/i.test(lower) ||
      (/\braza\b/i.test(lower) && /\b(batao|bataiye|baray|bare|kaun|kon|kya|hai|karta|profile|tajarba|summary|sab|detail|details|info)\b/i.test(lower))
    ) {
      return {
        text: "👤 **M Raza Rajput — Complete Profile Overview**:\n\n" +
          "• **Identity:** Full Stack Developer, AI Integrator, UI/UX Designer & Mobile App Engineer based in Karachi, Pakistan (available for global remote projects).\n" +
          "• **Philosophy:** *“Not just websites — I build intelligence, systems, interfaces & products.”*\n" +
          "• **Key Specializations:**\n" +
          "  1. 🌐 **Full-Stack Platforms:** Next.js 14/15, React, Node.js, Express, Python, PostgreSQL, Prisma, Supabase, MongoDB.\n" +
          "  2. 🤖 **AI Integration & Agents:** Gemini AI, OpenAI API, LangChain, autonomous workflows, intelligent scraping.\n" +
          "  3. ✨ **Kinetic Motion & 3D UI:** GSAP, Three.js, Lenis inertia physics, fluid variable typography.\n" +
          "• **Flagship Projects:** Nexus AI Book, Cloud Data Warehouse (Saylani Cloud Hackathon), Drake Wears, Earthy Electronics, HealthMate Telemetry, Salt & Pepper.\n" +
          "• **Availability:** High-impact client contracts, architecture consultations, aur freelance collaborations.\n\n" +
          "Aap mujh se Raza ke projects, tech stack ya direct contact ke baray me mazeed specific sawalat pooch sakte hain!",
        showEmailAction: false,
      };
    }

    // 10. Pricing, Rates, Hiring & Freelance
    if (/\b(hire|freelance|contract|cost|pricing|price|rate|budget|charges|available|availability|paisa|kitna|pese|fees|fee|job|remote)\b/i.test(lower)) {
      return {
        text: "💼 **Hiring & Freelance Availability**:\n\n" +
          "Raza selective high-impact freelance projects, technical consultations, aur architecture contracts ke liye available hain!\n\n" +
          "• **Engagement Models:** Fixed-price project milestones ya monthly dedicated contract.\n" +
          "• **Pricing:** Project scope, features aur timeline ke mutabiq customize hota hai.\n\n" +
          "Apne project ki requirements discuss karne ke liye aap Raza ko direct email bhej sakte hain:",
        showEmailAction: true,
      };
    }

    // 11. Contact, Email, Socials & WhatsApp
    if (/\b(email|mail|contact|rabta|phone|number|whatsapp|call|reach|inbox|linkedin|github|instagram|social|socials)\b/i.test(lower)) {
      return {
        text: "📬 **M Raza Rajput se Rabta Karein**:\n\n" +
          "• 📧 **Email:** raoraza5417@gmail.com\n" +
          "• 🐙 **GitHub:** [github.com/raoraza12](https://github.com/raoraza12)\n" +
          "• 💼 **LinkedIn:** [linkedin.com/in/raoraza12](https://linkedin.com/in/raoraza12)\n" +
          "• 📸 **Instagram:** [@supraa_main](https://www.instagram.com/supraa_main)\n\n" +
          "Aap neeche diye gaye button par click karke direct email compose kar sakte hain!",
        showEmailAction: true,
      };
    }

    // 12. Thanks & Compliments
    if (/\b(thanks|thank you|shukriya|jazakallah|dhanyawad|great|awesome|cool|zabardast|nice|good job|bohat khoob|shabash)\b/i.test(lower)) {
      return {
        text: "Bohat shukriya! It's always a pleasure. 😊 Agar koi mazeed sawal ho ya koi project start karna ho, to main hamesha hazir hoon! 🚀",
        showEmailAction: false,
      };
    }

    // 13. Smart Helpful Fallback (Polite & Informative, NO instant deflection!)
    return {
      text: "M Raza Rajput aik Full Stack Engineer & AI Integrator hain jo high-performance web platforms, AI agents aur interactive 3D digital experiences build karte hain.\n\nAap mujh se Raza ke baray me ye pooch sakte hain:\n• 👤 Unki profile, background aur experience\n• 🚀 Featured projects (Nexus AI Book, Cloud Data Warehouse, Drake Wears, etc.)\n• ⚡ Core tech stack aur technical skills\n• 💼 Services aur freelance availability\n\nAap Raza ke baray me kya detail jaanna chahte hain? 😊",
      showEmailAction: false,
    };
  };

  const handleSend = (textToSend) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      time: getTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = generateReply(text);
      const botMsg = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: reply.text,
        time: getTimeString(),
        showEmailAction: reply.showEmailAction,
        originalQuery: text,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 700);
  };

  const handlePillClick = (query) => {
    handleSend(query);
  };

  const handleScrollToContact = () => {
    onClose();
    setTimeout(() => {
      const contactEl = document.getElementById('contact');
      if (window.__lenis) {
        window.__lenis.scrollTo(contactEl || document.body.scrollHeight, { duration: 1.4 });
      } else {
        contactEl?.scrollIntoView({ behavior: 'smooth' });
      }
    }, 200);
  };

  return (
    <div
      className="chat-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      data-lenis-prevent="true"
    >
      <div
        className="chat-modal-window"
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        data-lenis-prevent="true"
      >
        {/* Header */}
        <header className="chat-header">
          <div className="chat-header-profile">
            <div className="chat-avatar-wrap">
              <img src={razaImg} alt="M Raza Rajput" className="chat-avatar-img" />
              <span className="chat-status-dot" title="Online" />
            </div>
            <div className="chat-header-info">
              <div className="chat-header-name">
                M Raza Rajput
                <span className="chat-header-badge">Online</span>
              </div>
              <span className="chat-header-status">Full Stack Architect & AI Integrator</span>
            </div>
          </div>

          <div className="chat-header-actions">
            <button
              type="button"
              className="chat-clear-btn"
              onClick={handleClearHistory}
              title="Clear conversation history on this device"
              aria-label="Clear chat history"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"/>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
              </svg>
            </button>
            <button
              type="button"
              className="chat-close-btn"
              onClick={onClose}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>
        </header>

        {/* Message Thread */}
        <div
          className="chat-messages"
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
        >
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-bubble-wrap ${msg.sender}`}>
              <div className="chat-bubble">{renderFormattedText(msg.text)}</div>
              <span className="chat-time">{msg.time}</span>

              {msg.showEmailAction && (
                <div className="chat-action-card">
                  <a
                    href={`mailto:raoraza5417@gmail.com?subject=Let's Connect&body=${encodeURIComponent(
                      msg.originalQuery || ''
                    )}`}
                    className="chat-action-btn chat-action-btn-email"
                  >
                    ✉ Send Email to Raza
                  </a>
                  <button
                    type="button"
                    className="chat-action-btn chat-action-btn-secondary"
                    onClick={handleScrollToContact}
                  >
                    View Contact Section ↓
                  </button>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="chat-bubble-wrap bot">
              <div className="chat-typing" aria-label="Raza is typing">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}

          {/* Quick pills after initial message */}
          {messages.length === 1 && !isTyping && (
            <div className="chat-pills-container">
              <span className="chat-pills-label">Quick topics:</span>
              <div className="chat-pills-list">
                {QUICK_PILLS.map((pill, i) => (
                  <button
                    key={i}
                    type="button"
                    className="chat-pill-btn"
                    onClick={() => handlePillClick(pill.query)}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <footer className="chat-footer">
          <form
            className="chat-input-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              ref={inputRef}
              type="text"
              className="chat-input-field"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              aria-label="Type message"
            />
            <button
              type="submit"
              className="chat-send-btn"
              disabled={!inputValue.trim()}
              aria-label="Send message"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
          <div className="chat-footer-caption">
            Direct Email: raoraza5417@gmail.com
          </div>
        </footer>
      </div>
    </div>
  );
}
