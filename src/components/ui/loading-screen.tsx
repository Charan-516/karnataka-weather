'use client'

export default function LoadingScreen() {
  const letters = ['L', 'O', 'A', 'D', 'I', 'N', 'G'];

  return (
    <div className='scene'>

      {/* Big 3D Spinning Cube */}
      <div className='big-wrap'>
        <div className='big-cube'>
          <div className='core' />
          <div className='sw sw-front'><div className='face f-c' /></div>
          <div className='sw sw-back'><div className='face f-c' /></div>
          <div className='sw sw-right'><div className='face f-p' /></div>
          <div className='sw sw-left'><div className='face f-p' /></div>
          <div className='sw sw-top'><div className='face f-i' /></div>
          <div className='sw sw-bottom'><div className='face f-i' /></div>
        </div>
        <div className='floor' />
      </div>

      {/* LOADING — Z-wave fade + glow */}
      <div className='wrapper-grid'>
        {letters.map((letter, i) => (
          <div
            key={i}
            className='cube'
            style={{ animationDelay: `${i * 0.38}s` }}
          >
            {/* Pass the SAME delay to l-front so glowFade stays in sync with zapFade */}
            <div
              className='l l-front'
              style={{ animationDelay: `${i * 0.38}s` }}
            >
              {letter}
            </div>
            <div className='l l-back' />
            <div className='l l-right' />
            <div className='l l-left' />
            <div className='l l-top' />
            <div className='l l-bottom' />
          </div>
        ))}
      </div>

      <p className='subtitle'>Preparing your experience, please wait&hellip;</p>

      <style>{`
        .scene {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 96px;
          padding: 56px 24px 48px;
          width: 100%;
          height: 100%;
          overflow: hidden;
          perspective: 1200px;
        }

        /* ── Big cube ─────────────────────── */
        .big-wrap {
          position: relative;
          width: 96px;
          height: 96px;
          display: flex;
          align-items: center;
          justify-content: center;
          transform-style: preserve-3d;
        }
        .big-cube {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          animation: cubeSpin 8s linear infinite;
        }
        .core {
          position: absolute;
          inset: 0;
          margin: auto;
          width: 32px;
          height: 32px;
          background: #06b6d4;
          border-radius: 50%;
          filter: blur(7px);
          animation: pulseFast 2s ease-in-out infinite;
        }
        .sw {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          transform-style: preserve-3d;
        }
        /* Each face is locked to its correct cube-face position (translateZ = half of 96px = 48px).
           The breathe effect is now pure opacity — no Z movement so the faces never
           protrude and no large-box artefact appears. */
        .sw .face {
          width: 100%;
          height: 100%;
          position: absolute;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          animation: breathe 3s ease-in-out infinite;
        }
        .f-c { background: rgba(6,182,212,0.12); border: 2px solid #22d3ee; }
        .f-p { background: rgba(139,92,246,0.12); border: 2px solid #a78bfa; }
        .f-i { background: rgba(79,70,229,0.12);  border: 2px solid #818cf8; }

        /* Faces are positioned by translateZ only — fixed, not animated. */
        .sw-front  { transform: rotateY(0deg)   translateZ(48px); }
        .sw-back   { transform: rotateY(180deg)  translateZ(48px); }
        .sw-right  { transform: rotateY(90deg)   translateZ(48px); }
        .sw-left   { transform: rotateY(-90deg)  translateZ(48px); }
        .sw-top    { transform: rotateX(90deg)   translateZ(48px); }
        .sw-bottom { transform: rotateX(-90deg)  translateZ(48px); }

        .floor {
          position: absolute;
          bottom: -24px;
          width: 90px;
          height: 28px;
          background: rgba(6,182,212,0.18);
          filter: blur(12px);
          border-radius: 50%;
          animation: shadowBreathe 3s ease-in-out infinite;
        }

        /* ── Letter cubes ─────────────────── */
        .wrapper-grid {
          display: flex;
          gap: 0;
          perspective: 700px;
          perspective-origin: 50% 50%;
        }
        .cube {
          position: relative;
          width: 40px;
          height: 40px;
          transform-style: preserve-3d;
          animation: zapFade 3s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite both;
        }
        .l {
          position: absolute;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          font-weight: 900;
          font-family: 'Courier New', monospace;
        }

        /* Front face — letter + glow.
           animationDelay is set inline via JS (same value as parent .cube)
           so glowFade is perfectly in sync with zapFade. */
        .l-front {
          transform: translateZ(20px);
          background-color: rgba(207,250,254,0.85);
          border-top: 2px solid #22d3ee;
          border-bottom: 2px solid #22d3ee;
          border-left: 1px solid #22d3ee;
          border-right: 1px solid #22d3ee;
          color: #0e7490;
          animation: glowFade 3s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite both;
        }

        /* Other faces — subtle but visible to preserve cube shape */
        .l-back {
          transform: rotateY(180deg) translateZ(20px);
          background-color: rgba(6,182,212,0.06);
          border: 1px solid rgba(6,182,212,0.15);
        }
        .l-right {
          transform: rotateY(90deg) translateZ(20px);
          background-color: rgba(14,116,144,0.12);
          border-top: 2px solid #0891b2;
          border-bottom: 2px solid #0891b2;
          border-left: 1px solid #0891b2;
          border-right: 1px solid #0891b2;
        }
        .l-left {
          transform: rotateY(-90deg) translateZ(20px);
          background-color: rgba(14,116,144,0.08);
          border-top: 2px solid #0891b2;
          border-bottom: 2px solid #0891b2;
          border-left: 1px solid #0891b2;
          border-right: 1px solid #0891b2;
        }
        .l-top {
          transform: rotateX(90deg) translateZ(20px);
          background-color: rgba(103,232,249,0.25);
          border: 1px solid #67e8f9;
        }
        .l-bottom {
          transform: rotateX(-90deg) translateZ(20px);
          background-color: rgba(6,182,212,0.06);
          border: 1px solid rgba(6,182,212,0.12);
        }

        .subtitle {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          color: #6b9ead;
          letter-spacing: 0.18em;
          margin-top: 0;
        }

        /* ── Keyframes ────────────────────── */
        @keyframes cubeSpin {
          0%   { transform: rotateX(0deg)   rotateY(0deg); }
          100% { transform: rotateX(360deg) rotateY(360deg); }
        }

        /* Breathe is now opacity-only — no translateZ so no box protrusion. */
        @keyframes breathe {
          0%, 100% { opacity: 0.85; }
          50%       { opacity: 0.25; }
        }

        @keyframes pulseFast {
          0%, 100% { transform: scale(0.8); opacity: 0.5; }
          50%       { transform: scale(1.2); opacity: 1; }
        }
        @keyframes shadowBreathe {
          0%, 100% { transform: scale(1);   opacity: 0.5; }
          50%       { transform: scale(1.6); opacity: 0.2; }
        }
        @keyframes zapFade {
          0%   { transform: translateZ(-2px); opacity: 0; }
          12%  { transform: translateZ(8px);  opacity: 1; }
          30%  { transform: translateZ(16px) translateY(-1px); opacity: 1; }
          50%  { transform: translateZ(8px);  opacity: 1; }
          65%  { transform: translateZ(-2px); opacity: 0; }
          100% { transform: translateZ(-2px); opacity: 0; }
        }
        @keyframes glowFade {
          0%   { box-shadow: none; }
          12%  { box-shadow: 0 0 6px 2px rgba(34,211,238,0.5), 0 0 20px 4px rgba(34,211,238,0.3); }
          30%  { box-shadow: 0 0 10px 4px rgba(34,211,238,0.7), 0 0 30px 8px rgba(34,211,238,0.4); }
          50%  { box-shadow: 0 0 6px 2px rgba(34,211,238,0.5), 0 0 20px 4px rgba(34,211,238,0.3); }
          65%  { box-shadow: none; }
          100% { box-shadow: none; }
        }
      `}</style>
    </div>
  );
}
