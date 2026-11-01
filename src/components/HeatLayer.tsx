"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/*
  WebGL pass over the fire film: the current film frame (a 2D canvas) is
  uploaded as a texture and displaced by rising, noise-driven heat shimmer —
  strongest just above the coals, fading toward the top of frame. Sparks are
  GPU points that rise from the coal bed with drag and flicker out.
*/

const vert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const frag = /* glsl */ `
  precision highp float;
  uniform sampler2D uFrame;
  uniform float uTime;
  uniform float uIntensity;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }

  void main() {
    // heat rises: noise field scrolls upward, shimmer strongest mid-frame above the grill
    float band = smoothstep(0.05, 0.45, vUv.y) * (1.0 - smoothstep(0.7, 1.0, vUv.y));
    vec2 q = vec2(vUv.x * 9.0, vUv.y * 5.0 - uTime * 1.4);
    float n = noise(q) + 0.5 * noise(q * 2.3 + 7.0);
    vec2 offset = vec2(n - 0.75, (noise(q + 3.1) - 0.5) * 0.6) * 0.0045 * band * uIntensity;
    vec3 col = texture2D(uFrame, vUv + offset).rgb;
    // faint breathing of the coal light
    col *= 1.0 + 0.035 * sin(uTime * 2.1 + vUv.x * 3.0) * smoothstep(0.55, 0.0, vUv.y) * uIntensity;
    gl_FragColor = vec4(col, 1.0);
  }
`;

function FilmPlane({ source, dirty }: { source: HTMLCanvasElement; dirty: RefObject<boolean> }) {
  const texture = useMemo(() => {
    const t = new THREE.CanvasTexture(source);
    t.colorSpace = THREE.SRGBColorSpace;
    t.minFilter = THREE.LinearFilter;
    t.generateMipmaps = false;
    return t;
  }, [source]);
  const uniforms = useMemo(
    () => ({ uFrame: { value: texture }, uTime: { value: 0 }, uIntensity: { value: 1 } }),
    [texture]
  );
  useFrame((_, dt) => {
    uniforms.uTime.value += Math.min(dt, 0.05);
    if (dirty.current) {
      texture.needsUpdate = true;
      dirty.current = false;
    }
  });
  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial vertexShader={vert} fragmentShader={frag} uniforms={uniforms} depthTest={false} />
    </mesh>
  );
}

const SPARKS = 90;
function Sparks() {
  const { viewport } = useThree();
  const ref = useRef<THREE.Points>(null);
  const state = useMemo(() => {
    const pos = new Float32Array(SPARKS * 3);
    const vel = new Float32Array(SPARKS * 2);
    const life = new Float32Array(SPARKS);
    const reset = (i: number, initial = false) => {
      // emitted from the coal bed: lower-left to centre of frame
      pos[i * 3] = (Math.random() * 0.9 - 0.75) * viewport.width * 0.5;
      pos[i * 3 + 1] = (-0.55 + Math.random() * 0.15) * viewport.height * 0.5 + (initial ? Math.random() * viewport.height * 0.8 : 0);
      pos[i * 3 + 2] = 0;
      const u = viewport.height * 0.3; // ortho camera: units are CSS pixels
      vel[i * 2] = (Math.random() - 0.5) * 0.15 * u;
      vel[i * 2 + 1] = (0.35 + Math.random() * 0.7) * u;
      life[i] = initial ? Math.random() : 1;
    };
    for (let i = 0; i < SPARKS; i++) reset(i, true);
    return { pos, vel, life, reset };
  }, [viewport.width, viewport.height]);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(state.pos, 3));
    g.setAttribute("alpha", new THREE.BufferAttribute(state.life, 1));
    return g;
  }, [state]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uSize: { value: 3.2 * Math.min(window.devicePixelRatio, 1.5) } },
        vertexShader: /* glsl */ `
          attribute float alpha; varying float vA; uniform float uSize;
          void main(){ vA = alpha; gl_PointSize = uSize * (0.6 + alpha); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: /* glsl */ `
          varying float vA;
          void main(){ float d = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.0, d) * vA;
            gl_FragColor = vec4(1.0, 0.55 + 0.3 * vA, 0.18, a); }`,
      }),
    []
  );

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const { pos, vel, life, reset } = state;
    for (let i = 0; i < SPARKS; i++) {
      vel[i * 2] += (Math.random() - 0.5) * 0.6 * viewport.height * 0.3 * dt; // turbulent drift
      vel[i * 2 + 1] *= 1 - 0.25 * dt; // drag
      pos[i * 3] += vel[i * 2] * dt;
      pos[i * 3 + 1] += vel[i * 2 + 1] * dt;
      life[i] -= dt * (0.35 + (i % 7) * 0.05);
      if (life[i] <= 0 || pos[i * 3 + 1] > viewport.height * 0.5) reset(i);
    }
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.alpha.needsUpdate = true;
  });

  return <points ref={ref} geometry={geometry} material={material} frustumCulled={false} />;
}

export default function HeatLayer({
  source,
  dirty,
  active,
  onReady,
}: {
  source: RefObject<HTMLCanvasElement | null>;
  dirty: RefObject<boolean>;
  active: boolean;
  onReady: () => void;
}) {
  const [canvasEl, setCanvasEl] = useState<HTMLCanvasElement | null>(null);
  useEffect(() => setCanvasEl(source.current), [source]);
  if (!canvasEl) return null;
  return (
    <Canvas
      aria-hidden="true"
      className="!absolute inset-0"
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      orthographic
      camera={{ zoom: 1, position: [0, 0, 10] }}
      onCreated={() => onReady()}
    >
      <FilmPlane source={canvasEl} dirty={dirty} />
      <Sparks />
    </Canvas>
  );
}
