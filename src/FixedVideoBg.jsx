import React, { useState, useEffect, useRef } from 'react';
import heroVdo from './assets/hero_vdo-BiUQ78eI.mp4';

export default function FixedVideoBg() {
  const [active, setActive] = useState(false);
  const rafRef = useRef(0);
  const vidRef = useRef(null);

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
        vid.play().catch(() => {});
      }
    };

    ['touchstart', 'touchend', 'scroll', 'click', 'pointerdown'].forEach((evt) => {
      window.addEventListener(evt, tryPlay, { passive: true });
    });

    return () => {
      ['touchstart', 'touchend', 'scroll', 'click', 'pointerdown'].forEach((evt) => {
        window.removeEventListener(evt, tryPlay);
      });
    };
  }, []);

  useEffect(() => {
    if (!active) return;
    const vid = vidRef.current;
    const diveVid = document.querySelector('.dive-video');
    if (vid && diveVid) {
      try {
        vid.currentTime = diveVid.currentTime;
      } catch (_) {}
    }
    vid?.play().catch(() => {});
  }, [active]);

  useEffect(() => {
    const update = () => {
      const dive = document.querySelector('.dive-section');
      if (dive) {
        const p = parseFloat(getComputedStyle(dive).getPropertyValue('--dive-progress')) || 0;
        const rect = dive.getBoundingClientRect();
        const inView = rect.bottom > window.innerHeight;
        setActive(p > 0.06 && inView);
      }
      rafRef.current = 0;
    };

    const onScroll = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className={`fvb-root ${active ? 'is-active' : ''}`} aria-hidden="true">
      <video
        ref={vidRef}
        className="fvb-video"
        src={heroVdo}
        autoPlay
        loop
        muted
        playsInline
        webkit-playsinline="true"
        preload="auto"
      />
      <div className="fvb-grad" />
    </div>
  );
}
