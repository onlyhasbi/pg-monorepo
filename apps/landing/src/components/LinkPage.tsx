import { getCloudinaryUrl } from "@repo/lib/images";
import { goldPricesQueryOptions } from "@repo/lib/queryOptions";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { BookOpen, ChevronDown, Globe, MessageCircle } from "lucide-react";
import { useState } from "react";
import { SOCIAL_DOMAINS } from "../constants";
import { GoldParticles } from "./GoldParticles";
import { FacebookIcon, InstagramIcon, TiktokIcon, VerifiedBadge } from "./icons";

export function LinkPage({ pgcode, pgbo }: { pgcode: string; pgbo: any }) {
	const navigate = useNavigate();
	const [linksOpen, setLinksOpen] = useState(false);

	const displayName = pgbo?.nama_panggilan || pgbo?.nama_lengkap || "Agent";
	const avatarUrl = pgbo?.foto_profil_url
		? getCloudinaryUrl(pgbo.foto_profil_url, { width: 200 })
		: null;

	const socials = [
		{
			label: "Website",
			href: `/${pgcode}`,
			icon: <Globe size={18} />,
		},
		pgbo?.sosmed_facebook && {
			label: "Facebook",
			href: pgbo.sosmed_facebook.startsWith("http")
				? pgbo.sosmed_facebook
				: `${SOCIAL_DOMAINS.FACEBOOK}${pgbo.sosmed_facebook}`,
			icon: <FacebookIcon />,
		},
		pgbo?.sosmed_instagram && {
			label: "Instagram",
			href: pgbo.sosmed_instagram.startsWith("http")
				? pgbo.sosmed_instagram
				: `${SOCIAL_DOMAINS.INSTAGRAM}${pgbo.sosmed_instagram.replace(/^@/, "")}`,
			icon: <InstagramIcon />,
		},
		pgbo?.sosmed_tiktok && {
			label: "TikTok",
			href: pgbo.sosmed_tiktok.startsWith("http")
				? pgbo.sosmed_tiktok
				: `${SOCIAL_DOMAINS.TIKTOK}${pgbo.sosmed_tiktok.replace(/^@/, "")}`,
			icon: <TiktokIcon />,
		},
	].filter(Boolean) as { label: string; href: string; icon: React.ReactNode }[];

	const handleRegisterClick = (type: "dewasa" | "anak") => {
		if (pgbo?.pageid) {
			localStorage.setItem("ref_pageid", pgbo.pageid);
		}
		navigate({
			to: "/register",
			search: { type, lang: "id" },
		});
	};

	const formatWaLink = (phone?: string) => {
		if (!phone) return "#";
		let clean = phone.replace(/\D/g, "");
		if (clean.startsWith("0")) clean = `62${clean.substring(1)}`;
		return `${SOCIAL_DOMAINS.WHATSAPP}${clean}`;
	};

	const { data: goldPrices } = useQuery(goldPricesQueryOptions());

	const formatPrice = (priceStr?: string | null) => {
		if (!priceStr) return "...";
		const num = parseInt(priceStr.replace(/[^0-9]/g, ""), 10);
		if (Number.isNaN(num)) return priceStr;
		return new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0,
		}).format(num);
	};

	return (
		<div className="min-h-[100dvh] bg-black flex flex-col p-6 relative font-sans text-white overflow-x-hidden">
			<div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-screen bg-[radial-gradient(circle_at_50%_15%,_rgba(30,30,30,0.8)_0%,_#000000_60%)] pointer-events-none z-0" />
			<GoldParticles />

			<main className="relative z-10 w-full max-w-[420px] mx-auto flex-1 flex flex-col items-center justify-center">
				<div className="flex flex-col items-center text-center mt-8 mb-8 w-full">
					<div className="mb-4">
						<div className="w-[160px] h-[160px] rounded-full overflow-hidden bg-[#111111] border-2 border-white/5 shadow-[0_8px_24px_rgba(0,0,0,0.4)] flex items-center justify-center">
							{avatarUrl ? (
								<img
									src={avatarUrl}
									alt={displayName}
									className="w-full h-full object-cover"
									width={160}
									height={160}
								/>
							) : (
								<div className="text-4xl font-medium text-zinc-400">
									{displayName.charAt(0).toUpperCase()}
								</div>
							)}
						</div>
					</div>

					<h1 className="text-2xl font-semibold tracking-[-0.02em] m-0 mb-2 text-white inline-flex items-center justify-center">
						{displayName}
						<VerifiedBadge />
					</h1>
					<p className="text-[15px] text-white/75 leading-[1.6] font-normal tracking-[0.01em] m-0 mb-5 max-w-[95%]">
						Mulai tabungan emas Anda hari ini
						<br />
						bersama Public Gold Indonesia, Gratis!
					</p>

					{socials.length > 0 && (
						<div className="flex gap-2 justify-center">
							{socials.map((s) => (
								<a
									key={s.label}
									href={s.href}
									target="_blank"
									rel="noopener noreferrer"
									className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-400 transition-colors duration-200 ease-in hover:text-white hover:bg-white/10 no-underline"
									title={s.label}
								>
									{s.icon}
								</a>
							))}
						</div>
					)}
				</div>

				<div
					className={`grid transition-all duration-300 ease-in-out w-full ${
						!linksOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
					}`}
				>
					<div className="overflow-hidden">
						<div className="w-full mb-8">
							<button
								type="button"
								onClick={() => handleRegisterClick("dewasa")}
								className="w-full h-14 rounded-[14px] bg-white text-black text-base font-medium tracking-[-0.01em] border-none flex items-center justify-center gap-2.5 cursor-pointer transition-colors duration-200 ease-in hover:bg-[#E5E5E5] shadow-[0_4px_12px_rgba(255,255,255,0.1)] outline-none appearance-none mb-3"
							>
								<img
									src="/dewasa.webp"
									alt=""
									className="w-7 h-7 rounded-full object-cover object-top shrink-0"
								/>
								Daftar Akun Dewasa
							</button>

							<button
								type="button"
								onClick={() => handleRegisterClick("anak")}
								className="w-full h-14 rounded-[14px] bg-white text-black text-base font-medium tracking-[-0.01em] border-none flex items-center justify-center gap-2.5 cursor-pointer transition-colors duration-200 ease-in hover:bg-[#E5E5E5] shadow-[0_4px_12px_rgba(255,255,255,0.1)] outline-none appearance-none"
							>
								<img
									src="/anak.webp"
									alt=""
									className="w-7 h-7 rounded-full object-cover object-top shrink-0"
								/>
								Daftar Akun Anak
							</button>
						</div>
					</div>
				</div>

				<div className="w-full mb-8 flex flex-col">
					<button
						type="button"
						onClick={() => setLinksOpen(!linksOpen)}
						className="w-full bg-transparent border-none flex items-center justify-between py-4 cursor-pointer text-zinc-400 text-xs font-semibold tracking-[0.05em] uppercase outline-none border-b border-b-white/10 hover:text-zinc-300 transition-colors"
					>
						QUICK LINKS
						<ChevronDown
							size={16}
							className={`transition-transform duration-300 ease-in-out ${
								linksOpen ? "rotate-180" : "rotate-0"
							}`}
						/>
					</button>

					<div
						className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
							linksOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
						}`}
					>
						<div className="overflow-hidden">
							<div className="w-full bg-transparent border-none pt-2">
								<a
									href={formatWaLink(pgbo?.no_telpon)}
									target="_blank"
									rel="noreferrer"
									className={`w-full h-14 bg-transparent text-white text-[15px] font-medium tracking-[-0.01em] flex items-center justify-start px-4 gap-3 cursor-pointer transition-colors duration-200 hover:bg-white/10 no-underline ${
										pgbo?.link_group_edukasi ? "border-b border-b-white/10" : ""
									}`}
								>
									<MessageCircle size={20} />
									<span>Konsultasi Sekarang</span>
								</a>

								{pgbo?.link_group_edukasi && (
									<a
										href={pgbo.link_group_edukasi}
										target="_blank"
										rel="noreferrer"
										className="w-full h-14 bg-transparent text-white text-[15px] font-medium tracking-[-0.01em] flex items-center justify-start px-4 gap-3 cursor-pointer transition-colors duration-200 hover:bg-white/10 no-underline"
									>
										<BookOpen size={20} />
										<span>Join Group Edukasi</span>
									</a>
								)}

								<div className="w-full bg-transparent border-none px-4 pt-6 pb-3 flex flex-row items-center justify-between">
									<div className="flex flex-col items-center gap-1">
										<span className="text-[11px] text-zinc-400 uppercase tracking-[0.05em] font-semibold">
											Harga per gram
										</span>
										<span className="text-base font-bold text-white">
											{formatPrice(goldPrices?.poe?.[1]?.price)}
										</span>
									</div>
									<div className="w-[1px] h-8 bg-white/10" />
									<div className="flex flex-col items-center gap-1">
										<span className="text-[11px] text-zinc-400 uppercase tracking-[0.05em] font-semibold">
											{goldPrices?.poe?.[0]?.label ?? "300rb"} per gram
										</span>
										<span className="text-base font-bold text-white">
											{formatPrice(goldPrices?.poe?.[0]?.price)}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}

export function LinkPageSkeleton() {
	return (
		<div className="min-h-[100dvh] bg-black flex flex-col p-6 relative font-sans text-white overflow-x-hidden">
			<div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-screen bg-[radial-gradient(circle_at_50%_15%,_rgba(30,30,30,0.8)_0%,_#000000_60%)] pointer-events-none z-0" />
			<div className="relative z-10 w-full max-w-[420px] mx-auto flex-1 flex flex-col items-center justify-center">
				<div className="w-[140px] h-7 bg-[#111111] rounded-full mb-8" />
				<div className="w-[160px] h-[160px] bg-[#111111] rounded-full mb-4" />
				<div className="w-[120px] h-7 bg-[#111111] rounded mb-2" />
				<div className="w-[200px] h-4 bg-[#111111] rounded mb-8" />
				<div className="w-full h-14 bg-[#111111] rounded-[14px] mb-3" />
				<div className="w-full h-14 bg-[#111111] rounded-[14px] mb-8" />
			</div>
			<div className="w-[120px] h-4 bg-[#111111] rounded mt-6 mx-auto" />
		</div>
	);
}
