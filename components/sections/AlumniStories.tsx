'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';

type AlumniStoryItem = {
	id: string;
	name: string;
	role: string;
	testimonial: string;
	type: 'video' | 'quote' | 'text';
	video_url: string | null;
	thumbnail_url: string | null;
	avatar_url: string | null;
	is_featured: boolean;
};

type AlumniStoriesProps = {
	title?: string;
	subtitle?: string;
	items?: AlumniStoryItem[];
};

const REELS_PAGE_SIZE = 4;

const toEmbedUrl = (videoUrl: string | null): string | null => {
	if (!videoUrl) return null;
	const watchParam = 'watch?v=';
	const idx = videoUrl.indexOf(watchParam);
	if (idx !== -1) {
		const id = videoUrl.slice(idx + watchParam.length).split('&')[0];
		return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`;
	}
	return videoUrl;
};

export default function AlumniStoriesSection({
	title,
	subtitle,
	items,
}: AlumniStoriesProps) {
	if (!items || items.length === 0) return null;

	const [startIndex, setStartIndex] = useState(0);
	const [pageSize, setPageSize] = useState(REELS_PAGE_SIZE);
	const [loaded, setLoaded] = useState<Record<string, boolean>>({});
	const [activeId, setActiveId] = useState<string | null>(null);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		const query = window.matchMedia('(min-width: 640px)');
		const apply = () => setPageSize(query.matches ? REELS_PAGE_SIZE : 1);
		apply();
		query.addEventListener('change', apply);
		return () => query.removeEventListener('change', apply);
	}, []);

	const normalizedItems = useMemo(() => {
		if (!items || items.length === 0) return [] as AlumniStoryItem[];
		return items;
	}, [items]);

	const total = normalizedItems.length;
	const safePageSize = total === 0 ? 0 : Math.min(pageSize, total);
	const visibleReels =
		total === 0 || safePageSize === 0
			? []
			: normalizedItems
					.slice(startIndex, startIndex + safePageSize)
					.concat(
						startIndex + safePageSize > total
								? normalizedItems.slice(0, (startIndex + safePageSize) % total)
								: []
					);

	const featured = useMemo(() => {
		if (!normalizedItems.length) return null;
		const explicit = normalizedItems.find(item => item.is_featured && item.type === 'video');
		const firstVideo = normalizedItems.find(item => item.type === 'video');
		return explicit ?? firstVideo ?? normalizedItems[0];
	}, [normalizedItems]);

	const activeItem = useMemo(() => {
		if (!activeId) return featured;
		return normalizedItems.find(item => item.id === activeId) ?? featured;
	}, [activeId, featured, normalizedItems]);

	const handleNext = () => {
		if (!total) return;
		setStartIndex(prev => (prev + safePageSize) % total);
	};

	const handlePrev = () => {
		if (!total) return;
		setStartIndex(prev => (prev - safePageSize + total) % total);
	};

	const markLoaded = (id: string) => {
		setLoaded(prev => ({ ...prev, [id]: true }));
	};

	const truncate = (text: string, maxChars = 80) => {
		if (!text) return '';
		return text.length > maxChars ? `${text.slice(0, maxChars).trim()}...` : text;
	};

	return (
		<section className={componentsTheme.alumniStories.sectionWrapper}>
			<div className={componentsTheme.alumniStories.card}>
				<SectionHeader
					eyebrow="Alumni Stories"
					title={title ?? 'What our Alumni says...'}
					subtitle={subtitle ?? 'More alumni moments'}
				/>

				<div className={componentsTheme.alumniStories.layoutGrid}>
					{/* Left: main video */}
					<div>
						<div className={componentsTheme.alumniStories.mainVideoWrapper}>
							{activeItem && activeItem.type === 'video' && toEmbedUrl(activeItem.video_url) ? (
								<iframe
									src={toEmbedUrl(activeItem.video_url) ?? ''}
									title={activeItem.testimonial || activeItem.name}
									className={componentsTheme.alumniStories.mainIframe}
									loading="lazy"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
									allowFullScreen
								/>
							) : (
								<div className="flex h-full w-full items-center justify-center text-sm text-slate-500">
									Video coming soon
								</div>
							)}
						</div>
						{activeItem && (
							<div className="mt-4 flex items-start gap-3">
								{activeItem.avatar_url && (
									<img
										src={activeItem.avatar_url}
										alt={activeItem.name}
										className="h-10 w-10 flex-shrink-0 rounded-full object-cover ring-2 ring-accent/30"
									/>
								)}
								<div>
									<p className="text-sm font-semibold text-slate-900">
										{activeItem.name}
									</p>
									{activeItem.role && (
										<p className="text-xs text-slate-500">{activeItem.role}</p>
									)}
									{activeItem.testimonial && (
										<p className="mt-2 text-sm text-slate-700">
											{activeItem.testimonial}
										</p>
									)}
								</div>
							</div>
						)}
					</div>

					{/* Right: reels-style thumbnails from API items */}
					<div>
						<div className="mb-2 flex items-center justify-between gap-3">
							<p className={componentsTheme.alumniStories.reelsTitle}>
								{subtitle ?? 'MORE ALUMNI MOMENTS'}
							</p>
							<div className="inline-flex items-center gap-2 text-xs">
								<button
									type="button"
									onClick={handlePrev}
									className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
									aria-label="Previous alumni videos"
								>
									<ChevronLeft className="h-4 w-4" />
								</button>
								<button
									type="button"
									onClick={handleNext}
									className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
									aria-label="Next alumni videos"
								>
									<ChevronRight className="h-4 w-4" />
								</button>
							</div>
						</div>

						<div className={componentsTheme.alumniStories.reelsGrid}>
							{visibleReels.map(item => {
								const isActive = activeItem?.id === item.id;
								const thumbLoaded = loaded[item.id];

								return (
									<button
										key={item.id}
										type="button"
										onClick={() => setActiveId(item.id)}
										className={componentsTheme.alumniStories.reelItem}
									>
										{!thumbLoaded && (
											<div className={componentsTheme.alumniStories.reelSkeleton} />
										)}
										{item.type === 'video' && item.thumbnail_url ? (
											// pakai thumbnail YouTube sebagai background via img tag
											<img
												src={item.thumbnail_url}
												alt={item.testimonial || item.name}
												className={componentsTheme.alumniStories.reelVideo}
												onLoad={() => markLoaded(item.id)}
											/>
										) : (
											<div className={componentsTheme.alumniStories.reelVideo}>
												<div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
													Video coming soon
												</div>
											</div>
										)}
										<div className="mt-2 text-left">
											<p className="text-xs font-semibold text-slate-900 line-clamp-1">
												{item.name}
											</p>
											<p className="text-[11px] text-slate-500 line-clamp-1">
												{item.role}
											</p>
											{item.testimonial && (
												<p className="mt-1 text-[11px] text-slate-600 line-clamp-2">
													{truncate(item.testimonial, 90)}
												</p>
											)}
										</div>
										{isActive && (
											<span className="mt-1 inline-block rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
												Now playing
											</span>
										)}
									</button>
								);
							})}
												</div>
					</div>
				</div>
			</div>
		</section>
	);
}
