import React, { useState, useRef, forwardRef, useEffect } from 'react';
import previewVideo from './assets/hushMeet-CGzQG0sJ.mp4';
import './Roles.css';

const ROLES = [
  'Full-Stack Developer',
  'AI Integrator',
  'UI/UX Designer',
  'Mobile Apps',
];

const Roles = forwardRef(function Roles(props, ref) {
  const vidRef = useRef(null);
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [activeRole, setActiveRole] = useState(null);

  const setMergedRef = (el) => {
    sectionRef.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  };

  useEffect(() => {
    const vid = vidRef.current;
    if (!vid) return;
    vid.muted = true;
    vid.defaultMuted = true;
    vid.playsInline = true;
  }, []);

  const updatePos = (clientX, clientY) => {
    const vid = vidRef.current;
    const sec = sectionRef.current;
    if (!vid || !sec) return;
    const rect = sec.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Check if mobile screen
    if (window.innerWidth <= 768) {
      vid.style.transform = `translate(${rect.width * 0.5}px, ${y}px) translate(-50%, -50%)`;
    } else {
      vid.style.transform = `translate(${x}px, ${y}px) translate(18px, 24px)`;
    }
  };

  const handleRoleTouch = (e, role) => {
    const t = e.touches[0];
    if (t) {
      updatePos(t.clientX, t.clientY);
      setActiveRole(role);
      setVisible(true);
      vidRef.current?.play().catch(() => {});
    }
  };

  return (
    <section className="roles-section" id="roles" ref={setMergedRef}>
      <p className="roles-eyebrow">02 — SPECIALIZATIONS &amp; ROLES</p>
      <ul
        className="roles-list"
        onMouseEnter={(e) => {
          updatePos(e.clientX, e.clientY);
          setVisible(true);
        }}
        onMouseLeave={() => {
          setVisible(false);
          setActiveRole(null);
        }}
        onMouseMove={(e) => updatePos(e.clientX, e.clientY)}
      >
        {ROLES.map((role) => (
          <li
            className={`roles-item ${activeRole === role ? 'is-active' : ''}`}
            key={role}
            tabIndex={0}
            onTouchStart={(e) => handleRoleTouch(e, role)}
            onClick={() => {
              setActiveRole(role);
              setVisible((v) => !v);
              vidRef.current?.play().catch(() => {});
            }}
          >
            {role}
          </li>
        ))}
      </ul>

      <video
        ref={vidRef}
        className={`roles-cursor-vid ${visible ? 'is-visible' : ''}`}
        src={previewVideo}
        autoPlay
        loop
        muted
        playsInline
        webkit-playsinline="true"
        preload="auto"
        aria-hidden="true"
      />
    </section>
  );
});

export default Roles;
