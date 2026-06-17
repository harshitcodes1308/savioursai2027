"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/* -----------------------------------------------------------------------------
 * Three.js line-interference shader — adapted from a 21st.dev effect, re-themed
 * to the Saviours palette (cyan-dominant instead of full RGB). Fills its parent
 * container. Pauses under prefers-reduced-motion (renders a single frame).
 * -------------------------------------------------------------------------- */

export default function ShaderAnimation({ opacity = 0.55, speed = 0.04 }: { opacity?: number; speed?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const speedRef = useRef(speed);
  speedRef.current = speed;
  const ref = useRef<{
    renderer: THREE.WebGLRenderer;
    uniforms: { time: { value: number }; resolution: { value: THREE.Vector2 } };
    animationId: number;
    geometry: THREE.PlaneGeometry;
    material: THREE.ShaderMaterial;
  } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const vertexShader = `
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `;

    // Cyan-biased: the layered RGB line interference is remapped toward the
    // brand accent so it reads as flowing cyan light, not a rainbow.
    const fragmentShader = `
      #define TWO_PI 6.2831853072
      #define PI 3.14159265359

      precision highp float;
      uniform vec2 resolution;
      uniform float time;

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        float t = time * 0.18;
        float lineWidth = 0.0028;

        vec3 color = vec3(0.0);
        for(int j = 0; j < 3; j++){
          for(int i = 0; i < 7; i++){
            color[j] += lineWidth * float(i*i) / abs(fract(t - 0.012*float(j) + float(i)*0.012)*6.0 - length(uv) + mod(uv.x + uv.y, 0.25));
          }
        }

        // Remap to cyan: kill most red, keep green mid, blue full
        vec3 tint = vec3(0.08, 0.8, 1.0);
        vec3 finalColor = color * tint;

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const camera = new THREE.Camera();
    camera.position.z = 1;

    const scene = new THREE.Scene();
    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      time: { value: 1.0 },
      resolution: { value: new THREE.Vector2() },
    };

    const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const onResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      uniforms.resolution.value.x = renderer.domElement.width;
      uniforms.resolution.value.y = renderer.domElement.height;
    };
    onResize();
    window.addEventListener("resize", onResize, false);

    ref.current = { renderer, uniforms, animationId: 0, geometry, material };

    let running = false;
    const animate = () => {
      if (!running) return;
      ref.current!.animationId = requestAnimationFrame(animate);
      uniforms.time.value += speedRef.current;
      renderer.render(scene, camera);
    };
    const start = () => {
      if (running) return;
      running = true;
      ref.current!.animationId = requestAnimationFrame(animate);
    };
    const stop = () => {
      running = false;
      if (ref.current) cancelAnimationFrame(ref.current.animationId);
    };

    // Only render while the section is on (or near) screen — saves the GPU
    // from running the shader off-screen, which keeps scrolling smooth.
    let io: IntersectionObserver | null = null;
    if (reduced) {
      renderer.render(scene, camera);
    } else {
      io = new IntersectionObserver(
        (entries) => entries.forEach((e) => (e.isIntersecting ? start() : stop())),
        { rootMargin: "200px" }
      );
      io.observe(container);
    }

    return () => {
      window.removeEventListener("resize", onResize);
      io?.disconnect();
      stop();
      if (ref.current) {
        if (container && ref.current.renderer.domElement.parentNode === container) {
          container.removeChild(ref.current.renderer.domElement);
        }
        ref.current.renderer.dispose();
        ref.current.geometry.dispose();
        ref.current.material.dispose();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "hidden", opacity }}
    />
  );
}
