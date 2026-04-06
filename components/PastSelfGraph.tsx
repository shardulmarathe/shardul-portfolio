"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Outfit } from "next/font/google";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import type { ForceGraphMethods, NodeObject } from "react-force-graph-3d";
import { getPastRole } from "@/lib/pastData";
import {
  buildPastGraphData,
  linkTouchesNode,
  LINK_DISTANCE,
  LINK_WIDTH_BASE,
  type PastGraphLinkEx,
  type PastGraphNodeData,
} from "@/lib/pastGraph";

const graphTooltipFont = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">
      Initializing 3D graph…
    </div>
  ),
});

const EASE = [0.22, 1, 0.36, 1] as const;

type HoveredPastNode = {
  id: string;
  slug: string;
  title: string;
  cardLines: [string, string];
  image?: string;
  imageFit?: "cover" | "contain";
};

type HoveredSupport = {
  id: string;
  label: string;
};

type GNode = NodeObject & PastGraphNodeData;

type GLink = PastGraphLinkEx & {
  source: string | GNode;
  target: string | GNode;
};

const CARD_W = 320;
const CARD_H_EST = 280;
const SUPPORT_W = 300;
const SUPPORT_H = 72;
const POS_THROTTLE_MS = 48;

function clampToContainer(
  anchorX: number,
  anchorY: number,
  mouseX: number,
  mouseY: number,
  viewportW: number,
  viewportH: number,
  cardW: number,
  cardH: number
): { left: number; top: number } {
  const vw = Math.max(viewportW, 320);
  const vh = Math.max(viewportH, 240);
  const m = 12;
  const cw = Math.min(cardW, vw - m * 2);
  const x = anchorX * 0.9 + mouseX * 0.1;
  const y = anchorY * 0.9 + mouseY * 0.1;

  let left = x - cw / 2;
  let top = y - cardH - 16;

  left = Math.min(Math.max(m, left), vw - cw - m);
  top = Math.min(Math.max(m, top), vh - cardH - m);

  return { left, top };
}

function nodeToHoveredPayload(n: GNode): HoveredPastNode | null {
  if (n.kind !== "anchor" || !n.slug) return null;
  const role = getPastRole(n.slug);
  if (!role) return null;
  return {
    id: n.id,
    slug: n.slug,
    title: role.title,
    cardLines: role.cardLines,
    image: role.image,
    imageFit: role.imageFit,
  };
}

export function PastSelfGraph() {
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<ForceGraphMethods | undefined>(undefined);
  const forcesConfigured = useRef(false);
  const viewInitialized = useRef(false);

  const hoveredNodeRef = useRef<HoveredPastNode | null>(null);
  const hoveredSupportRef = useRef<HoveredSupport | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const lastPosEmitRef = useRef(0);

  const [dims, setDims] = useState({ w: 320, h: 520 });
  const [hoveredNode, setHoveredNode] = useState<HoveredPastNode | null>(null);
  const [hoveredSupport, setHoveredSupport] = useState<HoveredSupport | null>(
    null
  );
  const [cardPos, setCardPos] = useState<{ left: number; top: number } | null>(
    null
  );
  const [supportPos, setSupportPos] = useState<{
    left: number;
    top: number;
  } | null>(null);

  const graphData = useMemo(() => buildPastGraphData(), []);

  useEffect(() => {
    hoveredNodeRef.current = hoveredNode;
  }, [hoveredNode]);

  useEffect(() => {
    hoveredSupportRef.current = hoveredSupport;
  }, [hoveredSupport]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setDims({ w: el.clientWidth, h: el.clientHeight });
    });
    ro.observe(el);
    setDims({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  const configureForces = useCallback(() => {
    const fg = fgRef.current;
    if (!fg || forcesConfigured.current) return;
    forcesConfigured.current = true;
    const linkForce = fg.d3Force("link") as
      | {
          distance?: (fn: (l: GLink) => number) => unknown;
          strength?: (fn: (l: GLink) => number) => unknown;
        }
      | undefined;
    linkForce?.distance?.((l) => {
      const L = l as GLink;
      const base = LINK_DISTANCE[L.strength];
      if (L.kind === "bb") return base * 1.1;
      if (L.kind === "bw") return base * 1.32;
      return base * 0.9;
    });
    linkForce?.strength?.((l) => {
      const L = l as GLink;
      const st = L.strength;
      if (L.kind === "bb") {
        return st === "strong" ? 0.34 : st === "medium" ? 0.22 : 0.13;
      }
      if (L.kind === "bw") return 0.19;
      return 0.1;
    });
    const charge = fg.d3Force("charge") as
      | { strength?: (n: number) => unknown }
      | undefined;
    charge?.strength?.(-310);
    const forceX = fg.d3Force("x") as { strength?: (n: number) => unknown } | undefined;
    const forceY = fg.d3Force("y") as { strength?: (n: number) => unknown } | undefined;
    const forceZ = fg.d3Force("z") as { strength?: (n: number) => unknown } | undefined;
    forceX?.strength?.(0.014);
    forceY?.strength?.(0.055);
    forceZ?.strength?.(0.05);
    fg.d3ReheatSimulation();
  }, []);

  const onEngineStop = useCallback(() => {
    const fg = fgRef.current;
    if (!fg) return;
    configureForces();
    if (!viewInitialized.current) {
      viewInitialized.current = true;
      fg.zoomToFit(900, 168);
      fg.cameraPosition({ x: 132, y: -32, z: 312 }, { x: 0, y: 0, z: 0 }, 1600);
      const ctrl = fg.controls() as {
        autoRotate?: boolean;
        autoRotateSpeed?: number;
        enableDamping?: boolean;
        dampingFactor?: number;
        minDistance?: number;
        maxDistance?: number;
      };
      ctrl.autoRotate = true;
      ctrl.autoRotateSpeed = 0.22;
      ctrl.enableDamping = true;
      ctrl.dampingFactor = 0.07;
      ctrl.minDistance = 165;
      ctrl.maxDistance = 620;
    }
  }, [configureForces]);

  const updateHoverPositions = useCallback(() => {
    const fg = fgRef.current;
    if (!fg) return;

    const hn = hoveredNodeRef.current;
    const hs = hoveredSupportRef.current;
    const targetId = hn?.id ?? hs?.id;
    if (!targetId) return;

    const n = graphData.nodes.find((x) => x.id === targetId) as GNode | undefined;
    if (n?.x === undefined || n.y === undefined || n.z === undefined) return;

    const canvas = fg.renderer()?.domElement;
    if (!canvas) return;

    const p = fg.graph2ScreenCoords(n.x, n.y, n.z);
    const anchorX = p.x;
    const anchorY = p.y;

    const { x: mx, y: my } = mouseRef.current;

    const now = performance.now();
    if (now - lastPosEmitRef.current < POS_THROTTLE_MS) return;
    lastPosEmitRef.current = now;

    if (hn) {
      const { left, top } = clampToContainer(
        anchorX,
        anchorY,
        mx,
        my,
        dims.w,
        dims.h,
        CARD_W,
        CARD_H_EST
      );
      setCardPos((prev) => {
        if (
          prev &&
          Math.abs(prev.left - left) < 2 &&
          Math.abs(prev.top - top) < 2
        ) {
          return prev;
        }
        return { left, top };
      });
      setSupportPos(null);
      return;
    }

    if (hs) {
      const { left, top } = clampToContainer(
        anchorX,
        anchorY,
        mx,
        my,
        dims.w,
        dims.h,
        SUPPORT_W,
        SUPPORT_H
      );
      setSupportPos((prev) => {
        if (
          prev &&
          Math.abs(prev.left - left) < 2 &&
          Math.abs(prev.top - top) < 2
        ) {
          return prev;
        }
        return { left, top };
      });
      setCardPos(null);
    }
  }, [graphData.nodes, dims.w, dims.h]);

  const onEngineTick = useCallback(() => {
    if (!hoveredNodeRef.current && !hoveredSupportRef.current) return;
    updateHoverPositions();
  }, [updateHoverPositions]);

  const hoverId = hoveredNode?.id ?? hoveredSupport?.id ?? null;

  const linkColor = useCallback(
    (link: object) => {
      const l = link as GLink;
      let alpha: number;
      if (l.kind === "bb") {
        alpha =
          l.strength === "strong" ? 0.5 : l.strength === "medium" ? 0.28 : 0.15;
      } else if (l.kind === "bw") {
        alpha =
          l.strength === "strong" ? 0.34 : l.strength === "medium" ? 0.22 : 0.14;
      } else {
        alpha =
          l.strength === "strong" ? 0.16 : l.strength === "medium" ? 0.11 : 0.07;
      }
      if (hoverId) {
        const hit = linkTouchesNode(l, hoverId);
        alpha = hit ? Math.min(0.82, alpha + 0.18) : alpha * 0.2;
      }
      return `rgba(34, 211, 238, ${alpha})`;
    },
    [hoverId]
  );

  const linkWidth = useCallback(
    (link: object) => {
      const l = link as GLink;
      let w: number;
      if (l.kind === "bb") {
        w = LINK_WIDTH_BASE[l.strength];
      } else if (l.kind === "bw") {
        w = l.strength === "strong" ? 0.95 : l.strength === "medium" ? 0.68 : 0.48;
      } else {
        w = l.strength === "strong" ? 0.42 : l.strength === "medium" ? 0.3 : 0.22;
      }
      if (hoverId && linkTouchesNode(l, hoverId)) w *= 1.22;
      return w;
    },
    [hoverId]
  );

  const nodeThreeObject = useCallback(
    (node: object) => {
      const n = node as GNode;
      const hovered = hoverId === n.id;

      if (n.kind === "support") {
        const baseR = 1.85 + n.val * 0.22;
        const r = baseR * (hovered ? 1.12 : 1);
        const group = new THREE.Group();
        const coreGeo = new THREE.SphereGeometry(r, 20, 20);
        const coreMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(hovered ? 0xf1f5f9 : 0xe2e8f0),
          emissive: new THREE.Color(hovered ? 0xbae6fd : 0x94a3b8),
          emissiveIntensity: hovered ? 0.45 : 0.22,
          metalness: 0.12,
          roughness: 0.45,
        });
        group.add(new THREE.Mesh(coreGeo, coreMat));
        const haloGeo = new THREE.SphereGeometry(r * 1.18, 16, 16);
        const haloMat = new THREE.MeshBasicMaterial({
          color: 0xcbd5e1,
          transparent: true,
          opacity: hovered ? 0.14 : 0.06,
          depthWrite: false,
        });
        group.add(new THREE.Mesh(haloGeo, haloMat));
        return group;
      }

      const baseR = 4.2 + n.val * 0.34;
      const r = baseR * (hovered ? 1.14 : 1);
      const group = new THREE.Group();
      const coreGeo = new THREE.SphereGeometry(r, 28, 28);
      const coreMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(hovered ? 0xa5f3fc : 0x22d3ee),
        emissive: new THREE.Color(hovered ? 0xecfeff : 0x06b6d4),
        emissiveIntensity: hovered ? 1.35 : 0.88,
        metalness: 0.2,
        roughness: 0.34,
      });
      group.add(new THREE.Mesh(coreGeo, coreMat));

      const haloGeo = new THREE.SphereGeometry(r * 1.26, 20, 20);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0x67e8f9,
        transparent: true,
        opacity: hovered ? 0.32 : 0.16,
        depthWrite: false,
      });
      group.add(new THREE.Mesh(haloGeo, haloMat));

      return group;
    },
    [hoverId]
  );

  const handleNodeHover = useCallback(
    (node: NodeObject | null) => {
      if (!node) {
        hoveredNodeRef.current = null;
        hoveredSupportRef.current = null;
        setHoveredNode(null);
        setHoveredSupport(null);
        setCardPos(null);
        setSupportPos(null);
        return;
      }
      const gn = node as GNode;
      if (gn.kind === "support") {
        hoveredNodeRef.current = null;
        setHoveredNode(null);
        setCardPos(null);
        const label = gn.label ?? gn.title;
        hoveredSupportRef.current = { id: gn.id, label };
        setHoveredSupport({ id: gn.id, label });
        lastPosEmitRef.current = 0;
        requestAnimationFrame(() => updateHoverPositions());
        return;
      }

      hoveredSupportRef.current = null;
      setHoveredSupport(null);
      setSupportPos(null);
      const payload = nodeToHoveredPayload(gn);
      if (!payload) {
        hoveredNodeRef.current = null;
        setHoveredNode(null);
        setCardPos(null);
        return;
      }
      hoveredNodeRef.current = payload;
      setHoveredNode(payload);
      lastPosEmitRef.current = 0;
      requestAnimationFrame(() => updateHoverPositions());
    },
    [updateHoverPositions]
  );

  return (
    <div
      ref={wrapRef}
      className="relative mx-auto h-[min(78vh,820px)] min-h-[640px] w-[min(95%,1200px)] max-w-[1200px] overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[inset_0_0_80px_-20px_rgba(34,211,238,0.06)] backdrop-blur-md"
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        if (hoveredNodeRef.current || hoveredSupportRef.current) {
          lastPosEmitRef.current = 0;
          updateHoverPositions();
        }
      }}
    >
      <ForceGraph3D
        ref={fgRef}
        width={dims.w}
        height={dims.h}
        graphData={graphData}
        backgroundColor="rgba(0,0,0,0)"
        showNavInfo={false}
        controlType="orbit"
        enableNodeDrag={false}
        showPointerCursor
        nodeId="id"
        linkSource="source"
        linkTarget="target"
        nodeRelSize={1}
        nodeVal={1}
        nodeOpacity={1}
        nodeThreeObject={nodeThreeObject}
        nodeThreeObjectExtend={false}
        linkColor={linkColor}
        linkWidth={linkWidth}
        linkOpacity={1}
        linkDirectionalParticles={0}
        d3AlphaDecay={0.022}
        d3VelocityDecay={0.5}
        warmupTicks={100}
        cooldownTicks={160}
        onEngineStop={onEngineStop}
        onEngineTick={onEngineTick}
        onNodeHover={handleNodeHover}
        onNodeClick={(node) => {
          const gn = node as GNode;
          if (gn.kind !== "anchor" || !gn.slug) return;
          router.push(`/past/${gn.slug}`);
        }}
      />

      <AnimatePresence mode="wait">
        {hoveredNode && cardPos ? (
          <motion.div
            key={hoveredNode.id}
            role="tooltip"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.22, ease: EASE }}
            className={`pointer-events-none absolute z-50 w-[min(88vw,320px)] rounded-xl border border-white/[0.12] bg-zinc-950/75 p-4 shadow-[0_24px_56px_-12px_rgba(34,211,238,0.18)] backdrop-blur-xl ${graphTooltipFont.className}`}
            style={{ left: cardPos.left, top: cardPos.top }}
          >
            <div className="relative mb-3 aspect-video w-full overflow-hidden rounded-lg border border-white/[0.06] bg-gradient-to-br from-sky-950 via-cyan-950/80 to-zinc-950">
              {hoveredNode.image ? (
                <Image
                  src={hoveredNode.image}
                  alt={hoveredNode.title}
                  fill
                  className={
                    hoveredNode.imageFit === "contain"
                      ? "object-contain"
                      : "object-cover object-top"
                  }
                  sizes="320px"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs font-medium tracking-wide text-cyan-200/50">
                  {hoveredNode.title.slice(0, 1)}
                </div>
              )}
            </div>
            <p className="text-center text-base font-semibold leading-snug tracking-tight text-white sm:text-lg">
              {hoveredNode.title}
            </p>
            <div className="mt-3 flex w-full justify-center">
              <span className="inline-flex items-center justify-center rounded-md border border-cyan-300/25 bg-cyan-400/10 px-4 py-2 text-center text-sm font-medium text-cyan-200">
                Click to learn more
              </span>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {hoveredSupport && supportPos ? (
          <motion.div
            key={hoveredSupport.id}
            role="tooltip"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18, ease: EASE }}
            className={`pointer-events-none absolute z-40 max-w-[min(92vw,340px)] rounded-xl border border-white/15 bg-zinc-950/85 px-4 py-3 text-center text-base font-semibold leading-snug tracking-tight text-slate-100 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.6)] backdrop-blur-md sm:text-lg ${graphTooltipFont.className}`}
            style={{ left: supportPos.left, top: supportPos.top }}
          >
            {hoveredSupport.label}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
