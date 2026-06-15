/**
 * Video testimonials for the landing page.
 *
 * PLACEHOLDER DATA — the team will drop real video files into /public/testimonials/
 * and update the `videoSrc` / `posterSrc` paths below. Until then, cards render with
 * a poster placeholder and a tap-to-play state. The landing page reads from this
 * array, so adding/removing entries here is all that's needed.
 *
 * To add a real testimonial:
 *   1. Drop a vertical (9:16) mp4 into /public/testimonials/
 *   2. Drop a poster jpg/png into /public/testimonials/
 *   3. Add an entry below with name + subject.
 */

export interface VideoTestimonial {
  id: string;
  videoSrc: string | null; // null = not uploaded yet, card shows placeholder
  posterSrc: string | null;
  name: string;
  subject: string;
}

export const VIDEO_TESTIMONIALS: VideoTestimonial[] = [
  { id: "vt1", videoSrc: null, posterSrc: null, name: "Aarav S.", subject: "ICSE Class X · 92%" },
  { id: "vt2", videoSrc: null, posterSrc: null, name: "Diya M.", subject: "ICSE Class X · 88%" },
  { id: "vt3", videoSrc: null, posterSrc: null, name: "Kabir R.", subject: "ICSE Class X · 90%" },
  { id: "vt4", videoSrc: null, posterSrc: null, name: "Ananya P.", subject: "ICSE Class X · 95%" },
  { id: "vt5", videoSrc: null, posterSrc: null, name: "Vivaan T.", subject: "ICSE Class X · 87%" },
];
