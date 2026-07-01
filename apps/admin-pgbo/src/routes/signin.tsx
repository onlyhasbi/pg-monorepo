import { useIsMounted } from "@repo/hooks/useIsMounted";
import { requireGuest } from "@repo/lib/auth";
import { portalLockoutOptions, portalUnlockedOptions } from "@repo/lib/portalOptions";
import { authDealerQueryOptions } from "@repo/lib/queryOptions";
import { PortalGate } from "@repo/ui/auth/PortalGate";
import SignInForm from "@repo/ui/auth/SignInForm";
import { Card, CardContent } from "@repo/ui/ui/card";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MessageCircle, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";

const MotionCard = motion.create(Card);

export const Route = createFileRoute("/signin")({
	beforeLoad: () => requireGuest(),
	component: LoginPage,
});

function LoginPage() {
	const isMounted = useIsMounted();
	const navigate = useNavigate();

	const { data: authData } = useQuery(authDealerQueryOptions());
	const user = authData?.user;
	const token = authData?.token;

	const { data: isUnlocked } = useQuery(portalUnlockedOptions());
	const { data: lockoutExpiry } = useQuery(portalLockoutOptions());
	const lockoutTime = lockoutExpiry && lockoutExpiry > Date.now() ? lockoutExpiry : 0;

	const effectiveIsUnlocked = isMounted ? isUnlocked : undefined;
	const effectiveLockoutTime = isMounted ? lockoutTime : 0;

	useEffect(() => {
		if (isMounted && token && user) {
			navigate({ to: "/overview", replace: true });
		}
	}, [isMounted, token, user, navigate]);

	if (isMounted && token && user) {
		return (
			<div className="relative min-h-dvh flex flex-col items-center justify-center bg-slate-50">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-rose-50/50 via-slate-50 to-slate-50 pointer-events-none" />
				<div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-rose-500 animate-spin" />
			</div>
		);
	}

	const containerVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
		},
	};

	return (
		<div className="relative min-h-dvh flex flex-col items-center justify-center bg-slate-50 overflow-hidden px-6 font-sans">
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-rose-50/50 via-slate-50 to-slate-50 pointer-events-none" />
			<div className="absolute -top-24 -left-24 w-96 h-96 bg-rose-500/3 rounded-full blur-[100px] pointer-events-none" />

			<motion.div
				initial="hidden"
				animate="visible"
				variants={containerVariants}
				className="relative z-10 w-full max-w-5xl flex flex-col items-center gap-8 md:gap-10"
			>
				<AnimatePresence mode="wait">
					{!effectiveIsUnlocked ? (
						<PortalGate key="secret-gate" />
					) : (
						<MotionCard
							key="auth-content"
							initial={{ opacity: 0, filter: "blur(8px)" }}
							animate={{ opacity: 1, filter: "blur(0px)" }}
							className="bg-white rounded-[var(--radius-card)] overflow-hidden shadow-2xl shadow-slate-200/40 border-none ring-0 max-w-lg mx-auto w-full"
						>
							<CardContent className="p-0 flex flex-col h-full">
								<div className="p-6 sm:px-10 pb-8 pt-10">
									<SignInForm />

									<div className="mt-6 text-center text-sm text-slate-500">
										Belum punya akun?{" "}
										<Link to="/signup" className="text-red-600 font-bold hover:underline">
											Daftar Sekarang
										</Link>
									</div>
								</div>

								<AuthFooter />
							</CardContent>
						</MotionCard>
					)}
				</AnimatePresence>

				<AuthSecurityNote lockoutTime={effectiveLockoutTime} isUnlocked={effectiveIsUnlocked} />
			</motion.div>
		</div>
	);
}

function AuthFooter() {
	return (
		<div className="p-4 sm:p-5 pt-3 border-t border-slate-50 flex flex-col items-center gap-3 bg-transparent">
			<a
				href="https://wa.me/628979901844"
				target="_blank"
				rel="noopener noreferrer"
				className="flex items-center gap-2"
			>
				<div className="p-1.5 bg-emerald-50 rounded-full">
					<MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
				</div>
				<span className="text-[9px] text-slate-400 tracking-wider">
					Butuh Bantuan? Hubungi Admin
				</span>
			</a>
			<div className="flex items-center gap-3 text-[9px] text-slate-300">
				<Link
					to="/legal"
					search={{ tab: "terms" }}
					className="hover:text-slate-500 transition-colors no-underline"
				>
					Syarat & Ketentuan
				</Link>
				<span>•</span>
				<Link
					to="/legal"
					search={{ tab: "privacy" }}
					className="hover:text-slate-500 transition-colors no-underline"
				>
					Privasi
				</Link>
			</div>
		</div>
	);
}

function AuthSecurityNote({
	lockoutTime,
	isUnlocked,
}: {
	lockoutTime: number;
	isUnlocked: boolean | undefined;
}) {
	return (
		<AnimatePresence>
			{!lockoutTime && !isUnlocked && (
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0 }}
					className="flex flex-col items-center gap-3 mt-4"
				>
					<div className="flex items-center justify-center gap-2 opacity-30 text-[9px] text-slate-500">
						<ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Portal Keamanan Terpusat Public
						Gold
					</div>
					<div className="flex items-center gap-3 text-[9px] text-slate-300 opacity-40">
						<Link
							to="/legal"
							search={{ tab: "terms" }}
							className="hover:text-slate-500 transition-colors no-underline"
						>
							Syarat & Ketentuan
						</Link>
						<span>•</span>
						<Link
							to="/legal"
							search={{ tab: "privacy" }}
							className="hover:text-slate-500 transition-colors no-underline"
						>
							Privasi
						</Link>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
