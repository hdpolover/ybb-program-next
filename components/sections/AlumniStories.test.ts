// components/sections/AlumniStories.test.ts
import { describe, expect, it } from 'vitest';
import { toEmbedUrl } from './AlumniStories';

describe('toEmbedUrl', () => {
	it.each([
		['https://youtube.com/shorts/dQw4w9WgXcQ', 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1&playsinline=1'],
		['https://www.instagram.com/reel/C9abc/', 'https://www.instagram.com/p/C9abc/embed'],
		['https://www.tiktok.com/@ybb/video/7301234567890123456', 'https://www.tiktok.com/embed/v2/7301234567890123456'],
		[
			'https://www.facebook.com/reel/1234567890',
			'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1234567890&show_text=false',
		],
		[
			'https://www.facebook.com/watch/?v=555',
			'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fwatch%2F%3Fv%3D555&show_text=false',
		],
	])('embeds %s', (url, embed) => {
		expect(toEmbedUrl(url)).toBe(embed);
	});

	it('does not embed a non-video facebook page', () => {
		expect(toEmbedUrl('https://www.facebook.com/ybbfoundation')).toBeNull();
	});
});

describe('toEmbedUrl host checks', () => {
	it('does not read a facebook reel as instagram or a facebook watch link as youtube', () => {
		expect(toEmbedUrl('https://www.facebook.com/reel/1')).toContain('facebook.com/plugins/video.php');
		expect(toEmbedUrl('https://www.facebook.com/watch?v=1')).toContain('facebook.com/plugins/video.php');
	});
});
