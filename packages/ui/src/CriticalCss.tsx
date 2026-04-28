/**
 * Critical CSS component that renders inline styles in the <head>.
 * This ensures the fastest possible FCP (First Contentful Paint) by providing
 * basic layout, fonts, and hero skeletons before external CSS loads.
 */
export const CriticalCss = () => {
  return (
    <style>
      {`
        /* 1. Global Reset & Base */
        *, *::before, *::after { box-sizing: border-box; }
        html { 
          font-family: "Geist Variable", -apple-system, system-ui, sans-serif; 
          -webkit-font-smoothing: antialiased;
          text-size-adjust: 100%;
        }
        body { 
          margin: 0; 
          background-color: #ffffff; 
          color: #1e293b;
          overflow-x: hidden;
        }

        /* 2. Header Skeleton - Khusus untuk First Paint */
        .pg-header-shell {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 40rem;
          width: 100%;
          position: relative;
          background-color: #ffffff;
          overflow: hidden;
        }
        @media (min-width: 768px) {
          .pg-header-shell { flex-direction: row; min-height: 50rem; }
        }

        .pg-hero-pattern {
          position: absolute;
          inset: 0;
          opacity: 0.4;
          pointer-events: none;
          background-size: 20px 20px;
          background-image: radial-gradient(#9ca3af 1px, transparent 1px);
          -webkit-mask-image: radial-gradient(ellipse at center, transparent 20%, black);
          mask-image: radial-gradient(ellipse at center, transparent 20%, black);
        }

        .pg-profile-skeleton {
          width: 16rem; height: 16rem;
          border-radius: 9999px;
          background: #f1f5f9;
          z-index: 10;
          position: relative;
        }
        @media (min-width: 768px) {
          .pg-profile-skeleton { width: 20rem; height: 20rem; }
        }

        /* 3. Animation Keyframes */
        @keyframes pg-ripple { 
          0% { transform: scale(1); opacity: 0.5; } 
          100% { transform: scale(1.25); opacity: 0; } 
        }
        @keyframes pg-float { 
          0%, 100% { transform: translateY(0); } 
          50% { transform: translateY(-8px); } 
        }
      `}
    </style>
  );
};
