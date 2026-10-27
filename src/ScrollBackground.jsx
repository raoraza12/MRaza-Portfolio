import React, { useRef, useState, useEffect } from 'react';
import bgVideo from './assets/bgvideo-WLnX9sPP.mp4';
import './ScrollBackground.css';

export default function ScrollBackground({ zoomed = false }) {
  const rootRef = useRef(null);
  const vidRef = useRef(null);
  const rafRef = useRef(false);

  // On mobile (screen <= 768px), immediately reveal background so animations aren't covered by solid black
  const [revealed, setRevealed] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth <= 768 : false;
  });

  // Mobile autoplay guarantee: touch, scroll, pointer, or click triggers video play
  useEffect(() => {
    const vid = vidRef.current;
    if (!vid) return;

    vid.muted = true;
    vid.defaultMuted = true;
    vid.playsInline = true;
    vid.setAttribute('muted', '');
    vid.setAttribute('playsinline', '');
    vid.setAttribute('webkit-playsinline', 'true');

    const tryPlay = () => {
      if (vid.paused) {
        const p = vid.play();
        if (p !== undefined) {
          p.catch(() => {});
        }
      }
    };

    tryPlay();
    const events = ['touchstart', 'touchend', 'touchmove', 'scroll', 'click', 'pointerdown'];
    events.forEach((evt) => {
      window.addEventListener(evt, tryPlay, { passive: true });
    });

    const handleVisibility = () => {
      if (!document.hidden) tryPlay();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      events.forEach((evt) => {
        window.removeEventListener(evt, tryPlay);
      });
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const onUpdate = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? Math.min(1, Math.max(0, scrollY / total)) : 0;
      el.style.setProperty('--scroll-progress', progress.toFixed(4));

      const isMobile = window.innerWidth <= 768;
      const dive = document.querySelector('.dive-section');
      const diveProgress = dive
        ? parseFloat(getComputedStyle(dive).getPropertyValue('--dive-progress')) || 0
        : 1;

      // Reveal glowing animated background immediately on mobile or as scroll starts
      setRevealed(isMobile || diveProgress > 0.08 || scrollY > 100);
      rafRef.current = false;
    };

    const handleScroll = () => {
      if (!rafRef.current) {
        requestAnimationFrame(onUpdate);
        rafRef.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', onUpdate);
    onUpdate();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', onUpdate);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={`sb-root ${zoomed ? 'sb-zoomed' : ''} ${revealed ? 'sb-revealed' : ''}`}
      aria-hidden="true"
    >
      {/* GPU-accelerated Pure CSS Kinetic Aurora Mesh: Always animates 60fps on mobile even under battery saver */}
      <div className="sb-aurora-wrap">
        <div className="sb-aurora-blob sb-aurora-1" />
        <div className="sb-aurora-blob sb-aurora-2" />
        <div className="sb-aurora-blob sb-aurora-3" />
      </div>

      <video
        ref={vidRef}
        className="sb-video"
        src={bgVideo}
        autoPlay
        loop
        muted
        playsInline
        webkit-playsinline="true"
        preload="auto"
      />
      <div className="sb-wash" />
      <div className="sb-tint" />
      <div className="sb-grain-coarse" />
      <div className="sb-grain" />
      <div className="sb-vignette" />
      <div className="sb-cover" />
    </div>
  );
}
