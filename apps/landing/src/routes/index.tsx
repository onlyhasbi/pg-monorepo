import { createFileRoute } from "@tanstack/react-router";
import { AppLink as Link } from "@repo/lib/router-wrappers";
import { useQuery } from "@tanstack/react-query";
import { agentsListQueryOptions } from "@repo/lib/queryOptions";
import { OptimizedImage } from "@repo/ui/ui/optimized-image";
import { useEffect, useRef, useState, useMemo } from "react";

const ADMIN_PGBO_URL = import.meta.env.DEV
  ? "http://localhost:3003/signin"
  : "https://admin.mypublicgold.id/signin";

export const Route = createFileRoute("/")({
  component: LandingHomePage,
});

function LandingHomePage() {
  const { data: agents } = useQuery(agentsListQueryOptions());

  return (
    <div className="relative min-h-dvh flex flex-col items-center justify-center bg-slate-950 overflow-hidden px-6">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Floating 3D Network Orbs (behind logo) */}
      {agents && agents.length > 0 && <FloatingOrbs agents={agents} />}

      {/* Center Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* 5G Logo — Click to go to Admin PGBO */}
        <a
          href={ADMIN_PGBO_URL}
          className="group relative flex items-center justify-center cursor-pointer"
        >
          <div className="absolute inset-0 bg-red-600/20 rounded-3xl blur-2xl scale-110 group-hover:bg-red-600/30 group-hover:scale-125 transition-all duration-700" />
          <div className="relative p-4 bg-[#000856] rounded-3xl shadow-[0_0_30px_rgba(220,38,38,0.15)] border border-white/10 group-hover:border-red-500/30 group-hover:scale-105 transition-all duration-500">
            <OptimizedImage
              src="https://mypublicgold.com/5g/logo/logo_gold.png"
              alt="5G Associates"
              width={72}
              height={72}
              priority
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
            />
          </div>
        </a>
      </div>
    </div>
  );
}

interface Agent {
  pageid: string;
  nama_panggilan: string | null;
  foto_profil_url: string | null;
}

function FloatingOrbs({ agents }: { agents: Agent[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayAgents, setDisplayAgents] = useState<Agent[]>([]);

  // Randomize and pick max 10 agents on mount
  useEffect(() => {
    // Filter out any invalid empty agents first
    const validAgents = agents.filter(
      (a) => a.pageid && a.pageid.trim() !== "",
    );
    const shuffled = [...validAgents].sort(() => Math.random() - 0.5);
    setDisplayAgents(shuffled.slice(0, 15));
  }, [agents]);

  // Generate 3D sphere points using Fibonacci sphere algorithm
  const sphereData = useMemo(() => {
    const n = displayAgents.length;
    if (n === 0) return { points: [], lines: [] };

    const points = [];
    for (let i = 0; i < n; i++) {
      const phi = Math.acos(1 - (2 * i + 1) / n);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      points.push({
        x: Math.cos(theta) * Math.sin(phi),
        y: Math.sin(theta) * Math.sin(phi),
        z: Math.cos(phi),
      });
    }

    const lines: [number, number][] = [];
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const p1 = points[i];
        const p2 = points[j];
        // Connect points that are relatively close in 3D space
        const dist3d = Math.sqrt(
          Math.pow(p1.x - p2.x, 2) +
            Math.pow(p1.y - p2.y, 2) +
            Math.pow(p1.z - p2.z, 2),
        );
        if (dist3d < 1.6) {
          lines.push([i, j]);
        }
      }
    }
    return { points, lines };
  }, [displayAgents]);

  const rotationRef = useRef({ y: 0, x: 0 });
  const isDraggingRef = useRef(false);
  const previousMouseRef = useRef({ x: 0, y: 0 });
  const dragDistanceRef = useRef(0);
  const velocityRef = useRef({ y: 0.003, x: 0.001 });

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    dragDistanceRef.current = 0;
    previousMouseRef.current = { x: e.clientX, y: e.clientY };
    velocityRef.current = { x: 0, y: 0 };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - previousMouseRef.current.x;
    const deltaY = e.clientY - previousMouseRef.current.y;

    dragDistanceRef.current += Math.abs(deltaX) + Math.abs(deltaY);

    const rotSpeed = 0.005;
    rotationRef.current.y += deltaX * rotSpeed;
    rotationRef.current.x -= deltaY * rotSpeed; // Invert Y for natural drag

    velocityRef.current = { y: deltaX * rotSpeed, x: -deltaY * rotSpeed };
    previousMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  useEffect(() => {
    if (displayAgents.length === 0) return;

    let animationFrameId: number;

    const updatePositions = () => {
      const container = containerRef.current;
      if (!container) return;

      const orbs = container.querySelectorAll(".orb-node");
      const lines = container.querySelectorAll(".network-line");

      const w = window.innerWidth;
      const h = window.innerHeight;
      const radius = Math.min(w, 800) * 0.35;
      const centerX = w / 2;
      const centerY = h / 2;

      // Handle inertia and default rotation speed
      if (!isDraggingRef.current) {
        // Ease back to default automatic spin (0.003 y, 0.001 x)
        velocityRef.current.y += (0.003 - velocityRef.current.y) * 0.02;
        velocityRef.current.x += (0.001 - velocityRef.current.x) * 0.02;
      }

      rotationRef.current.y += velocityRef.current.y;
      rotationRef.current.x += velocityRef.current.x;

      const cosY = Math.cos(rotationRef.current.y);
      const sinY = Math.sin(rotationRef.current.y);
      const cosX = Math.cos(rotationRef.current.x);
      const sinX = Math.sin(rotationRef.current.x);

      // Project 3D points to 2D
      const projected = sphereData.points.map((p) => {
        // Rotate Y
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.z * cosY + p.x * sinY;
        // Rotate X
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.y * sinX;

        const scale = (z2 + 2) / 2.5; // Scale mapping based on depth
        const opacity = Math.max(0.2, (z2 + 1.5) / 2.5);

        return {
          x: centerX + x1 * radius,
          y: centerY + y2 * radius,
          z: z2,
          scale: Math.max(0.4, scale),
          opacity,
          blur: z2 < -0.2 ? Math.abs(z2) * 3 : 0,
        };
      });

      // Update DOM Nodes
      orbs.forEach((el, i) => {
        const pt = projected[i];
        if (!pt) return;
        const domEl = el as HTMLElement;
        domEl.style.transform = `translate3d(-50%, -50%, 0) scale(${pt.scale})`;
        domEl.style.left = `${pt.x}px`;
        domEl.style.top = `${pt.y}px`;
        domEl.style.zIndex = Math.floor(pt.z * 100).toString();
        domEl.style.filter = pt.blur > 0 ? `blur(${pt.blur}px)` : "none";
        domEl.style.opacity = pt.opacity.toString();
      });

      // Update SVG Lines
      sphereData.lines.forEach((pair, idx) => {
        const p1 = projected[pair[0]];
        const p2 = projected[pair[1]];
        const lineEl = lines[idx] as SVGLineElement;
        if (p1 && p2 && lineEl) {
          lineEl.setAttribute("x1", p1.x.toString());
          lineEl.setAttribute("y1", p1.y.toString());
          lineEl.setAttribute("x2", p2.x.toString());
          lineEl.setAttribute("y2", p2.y.toString());
          // Average z depth for line opacity
          const avgZ = (p1.z + p2.z) / 2;
          lineEl.style.opacity = Math.max(0.05, (avgZ + 1.5) / 4).toString();
        }
      });

      animationFrameId = requestAnimationFrame(updatePositions);
    };

    updatePositions();

    return () => cancelAnimationFrame(animationFrameId);
  }, [displayAgents, sphereData]);

  if (displayAgents.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 overflow-hidden pointer-events-auto cursor-grab active:cursor-grabbing touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* 3D Network Connection Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {sphereData.lines.map((_, idx) => (
          <line
            key={idx}
            className="network-line transition-opacity duration-75"
            stroke="url(#lineGradient)"
            strokeWidth={1.5}
            style={{ opacity: 0 }}
          />
        ))}
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>

      {/* Floating Orbs */}
      {displayAgents.map((agent) => (
        <div
          key={agent.pageid}
          className="orb-node pointer-events-auto absolute transition-opacity duration-75 group"
          title={agent.nama_panggilan || agent.pageid}
          style={{ opacity: 0, width: "64px", height: "64px" }}
        >
          <Link
            to="/$pgcode"
            params={{ pgcode: agent.pageid }}
            className="block w-full h-full relative"
            onClick={(e) => {
              if (dragDistanceRef.current > 10) {
                e.preventDefault();
              }
            }}
          >
            <div className="relative w-full h-full rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-red-500/80 transition-all duration-300 shadow-xl shadow-black/50 group-hover:shadow-red-500/30 group-hover:scale-110">
              {agent.foto_profil_url ? (
                <OptimizedImage
                  src={agent.foto_profil_url}
                  alt={agent.nama_panggilan || agent.pageid}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover pointer-events-none"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white/60 text-sm font-bold pointer-events-none">
                  {(agent.nama_panggilan || agent.pageid)
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}
              {/* Glow overlay */}
              <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/20 transition-colors duration-300 rounded-full pointer-events-none" />
            </div>
            {/* Tooltip */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
              <span className="px-3 py-1 bg-slate-900/90 text-slate-100 text-[11px] font-medium rounded-lg border border-slate-700 backdrop-blur-sm shadow-xl">
                {agent.nama_panggilan || agent.pageid}
              </span>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
