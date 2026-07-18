import { memo, useEffect, useState } from "react";

const GoldParticlesComponent = () => {
	const [particles, setParticles] = useState<
		Array<{ id: number; style: React.CSSProperties }>
	>([]);

	useEffect(() => {
		// Generate lightweight particles only on client-side to prevent hydration mismatch
		const newParticles = Array.from({ length: 30 }).map((_, i) => {
			const size = Math.random() * 3 + 1; // 1px to 4px
			const left = Math.random() * 100;
			const top = Math.random() * 100;
			const duration = Math.random() * 10 + 15; // 15s to 25s
			const delay = Math.random() * 5;
			const tx = (Math.random() - 0.5) * 100; // Drift X up to -50px or +50px
			const ty = (Math.random() - 0.5) * 100; // Drift Y up to -50px or +50px

			return {
				id: i,
				style: {
					width: `${size}px`,
					height: `${size}px`,
					left: `${left}%`,
					top: `${top}%`,
					animation: `gold-drift ${duration}s ease-in-out infinite alternate both ${delay}s`,
					willChange: "transform, opacity",
					"--tx": `${tx}px`,
					"--ty": `${ty}px`,
				} as React.CSSProperties,
			};
		});
		setParticles(newParticles);
	}, []);

	return (
		<div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
			<style>
				{`
					@keyframes gold-drift {
						0% {
							transform: translate(0, 0) scale(1);
							opacity: 0;
						}
						50% {
							opacity: 0.6;
							transform: translate(calc(var(--tx) / 2), calc(var(--ty) / 2)) scale(1.5);
						}
						100% {
							transform: translate(var(--tx), var(--ty)) scale(1);
							opacity: 0;
						}
					}
				`}
			</style>
			{particles.map((p) => (
				<div
					key={p.id}
					className="absolute rounded-full bg-gradient-to-tr from-[#FCD34D] to-[#FEF3C7] shadow-[0_0_8px_rgba(252,211,77,0.4)]"
					style={p.style}
				/>
			))}
		</div>
	);
};

export const GoldParticles = memo(GoldParticlesComponent);
