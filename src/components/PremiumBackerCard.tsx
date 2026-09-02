'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Hero } from '@/types';
import { formatRupee } from '@/lib/formatters';
import { 
  Download, 
  RotateCw, 
  Share2, 
  Check, 
  Sparkles,
} from 'lucide-react';

interface PremiumBackerCardProps {
  hero: Hero;
  amount: number;
  username: string;
  rank: number;
  paymentId?: string;
  becameRankOne?: boolean;
}

export function PremiumBackerCard({
  hero,
  amount,
  username,
  rank,
  paymentId,
}: PremiumBackerCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Three.js scene instances ref
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    cardGroup: THREE.Group;
    frontMesh: THREE.Mesh;
    backMesh: THREE.Mesh;
    light1: THREE.PointLight;
    light2: THREE.PointLight;
    targetRotationY: number;
    targetRotationX: number;
    animFrameId: number;
  } | null>(null);

  // Generate ultra-high-resolution 1200x1800 front texture
  const createFrontCanvas = useCallback((): Promise<HTMLCanvasElement> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 1800;
      const ctx = canvas.getContext('2d')!;

      // 1. Deep Anthropic warm dark charcoal canvas
      const bgGrad = ctx.createLinearGradient(0, 0, 1200, 1800);
      bgGrad.addColorStop(0, '#1c1b1a');
      bgGrad.addColorStop(0.5, '#161514');
      bgGrad.addColorStop(1, '#0e0d0c');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1200, 1800);

      // Fine geometric diagonal weave pattern
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 1.5;
      for (let x = -1800; x < 3000; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + 1800, 1800);
        ctx.stroke();
      }

      // 2. Metallic Beveled Borders
      const accentColor = rank === 1 ? '#f59e0b' : '#e95325';
      const secondaryAccent = rank === 1 ? '#fbbf24' : '#ff7a50';

      const borderGrad = ctx.createLinearGradient(0, 0, 1200, 1800);
      borderGrad.addColorStop(0, accentColor);
      borderGrad.addColorStop(0.3, secondaryAccent);
      borderGrad.addColorStop(0.6, '#ffffff');
      borderGrad.addColorStop(1, accentColor);

      // Outer rim
      ctx.strokeStyle = borderGrad;
      ctx.lineWidth = 18;
      ctx.strokeRect(36, 36, 1128, 1728);

      // Inner thin rim
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.lineWidth = 2;
      ctx.strokeRect(58, 58, 1084, 1684);

      // 3. Header: Foil Badge
      ctx.fillStyle = '#f4efe9';
      ctx.font = '700 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.letterSpacing = '6px';
      ctx.fillText('CINEBID • OFFICIAL PROOF OF BACKING', 600, 125);

      ctx.fillStyle = 'rgba(244, 239, 233, 0.5)';
      ctx.font = '500 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.letterSpacing = '2px';
      ctx.fillText('INDIAN CINEMA FANDOM COLLECTIBLE', 600, 160);

      // 4. Circular Cameo Portrait Medallion
      const centerX = 600;
      const centerY = 550;
      const radius = 260;

      // Medallion Glow
      const glowGrad = ctx.createRadialGradient(centerX, centerY, radius * 0.7, centerX, centerY, radius * 1.3);
      glowGrad.addColorStop(0, rank === 1 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(233, 83, 37, 0.2)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = hero.avatarUrl || '/heroes/salman-khan.jpg';

      const finalizeCard = () => {
        // Double metallic ring around portrait
        ctx.strokeStyle = borderGrad;
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + 12, 0, Math.PI * 2);
        ctx.stroke();

        // 5. Hero Name & Industry
        ctx.fillStyle = '#f4efe9';
        ctx.font = '900 68px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(hero.name.toUpperCase(), 600, 910);

        ctx.fillStyle = 'rgba(244, 239, 233, 0.7)';
        ctx.font = '600 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText(`${hero.titleTag || hero.displayName} • ${hero.industry} Cinema`, 600, 960);

        // 6. Aligned Evidence Boxes
        // Rank Box
        const boxY = 1020;
        const boxH = 150;
        const boxW = 460;

        ctx.fillStyle = rank === 1 ? 'rgba(245, 158, 11, 0.12)' : 'rgba(233, 83, 37, 0.12)';
        ctx.beginPath();
        ctx.roundRect(110, boxY, boxW, boxH, 20);
        ctx.fill();
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = 'rgba(244, 239, 233, 0.6)';
        ctx.font = '600 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('LIVE SPOT RANK', 145, boxY + 50);

        ctx.fillStyle = accentColor;
        ctx.font = '900 56px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText(`SPOT #${rank}`, 145, boxY + 115);

        // Amount Box
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.beginPath();
        ctx.roundRect(630, boxY, boxW, boxH, 20);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = 'rgba(244, 239, 233, 0.6)';
        ctx.font = '600 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText('BACKED AMOUNT', 665, boxY + 50);

        ctx.fillStyle = '#ffffff';
        ctx.font = '900 56px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText(formatRupee(amount), 665, boxY + 115);

        // 7. Certified Supporter Handle
        const backerY = 1210;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.beginPath();
        ctx.roundRect(110, backerY, 980, 150, 20);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = 'rgba(244, 239, 233, 0.6)';
        ctx.font = '600 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText('OFFICIAL SUPPORTER', 155, backerY + 50);

        ctx.fillStyle = '#f4efe9';
        ctx.font = '800 48px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText(`@${username}`, 155, backerY + 115);

        // 8. Verification Details & Watermark
        ctx.fillStyle = 'rgba(244, 239, 233, 0.5)';
        ctx.font = '500 20px "Courier New", Courier, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`TXN: ${paymentId || 'VERIFIED-DODO-PAYMENTS'}`, 600, 1430);

        ctx.fillStyle = 'rgba(244, 239, 233, 0.4)';
        ctx.font = '600 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText('VERIFIED VIA DODO PAYMENTS (MOR) • REAL-TIME SSE BROADCAST', 600, 1480);
        ctx.fillText(`MINTED ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}`, 600, 1520);

        // Cinebid Watermark
        ctx.fillStyle = accentColor;
        ctx.font = '900 40px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText('CINEBID.LOL', 600, 1630);

        resolve(canvas);
      };

      img.onload = () => {
        // Draw inside circular cameo
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius - 4, 0, Math.PI * 2);
        ctx.clip();

        // Focused face portrait
        const size = Math.min(img.width, img.height);
        const sx = (img.width - size) / 2;
        const sy = (img.height - size) * 0.15; // Focus on face, crop away background text
        ctx.drawImage(img, sx, sy, size, size, centerX - radius, centerY - radius, radius * 2, radius * 2);

        // Subtle dark vignette at bottom of circle
        const vignette = ctx.createLinearGradient(0, centerY + radius * 0.2, 0, centerY + radius);
        vignette.addColorStop(0, 'rgba(22, 21, 20, 0)');
        vignette.addColorStop(1, 'rgba(22, 21, 20, 0.8)');
        ctx.fillStyle = vignette;
        ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);

        ctx.restore();
        finalizeCard();
      };

      img.onerror = () => {
        finalizeCard();
      };
    });
  }, [hero, amount, username, rank, paymentId]);

  // Generate high-resolution back texture
  const createBackCanvas = useCallback((): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1800;
    const ctx = canvas.getContext('2d')!;

    // Background
    ctx.fillStyle = '#121110';
    ctx.fillRect(0, 0, 1200, 1800);

    // Diagonal gold hatch lines
    ctx.strokeStyle = 'rgba(233, 83, 37, 0.05)';
    ctx.lineWidth = 3;
    for (let i = -1800; i < 3600; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 1800, 1800);
      ctx.stroke();
    }

    // Border
    const accentColor = rank === 1 ? '#f59e0b' : '#e95325';
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 18;
    ctx.strokeRect(36, 36, 1128, 1728);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 2;
    ctx.strokeRect(58, 58, 1084, 1684);

    // Center Emblem
    ctx.save();
    ctx.translate(600, 750);

    ctx.fillStyle = 'rgba(233, 83, 37, 0.1)';
    ctx.beginPath();
    ctx.arc(0, 0, 260, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 8;
    ctx.stroke();

    ctx.fillStyle = '#f4efe9';
    ctx.font = '900 84px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CINEBID', 0, 15);

    ctx.fillStyle = accentColor;
    ctx.font = '800 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('.LOL', 0, 75);

    ctx.restore();

    // Text details
    ctx.fillStyle = '#f4efe9';
    ctx.font = '800 42px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('AUTHENTICATED BACKER RECORD', 600, 1180);

    ctx.fillStyle = 'rgba(244, 239, 233, 0.6)';
    ctx.font = '500 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('This cryptographic card certifies a live financial backing', 600, 1250);
    ctx.fillText('permanently logged on the Cinebid Indian Cinema Ledger.', 600, 1295);

    ctx.fillStyle = accentColor;
    ctx.font = '700 24px "Courier New", monospace';
    ctx.fillText('PAYMENT PROCESSOR: DODO PAYMENTS (MOR)', 600, 1420);

    return canvas;
  }, [rank]);

  // Initialize Three.js Scene
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera with safe distance to prevent any clipping on tilt
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.z = 7.0;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Card Group
    const cardGroup = new THREE.Group();
    scene.add(cardGroup);

    // Card Geometry: 2.5 width x 3.75 height (standard collectible ratio 1 : 1.5)
    const cardWidth = 2.5;
    const cardHeight = 3.75;
    const cardThickness = 0.05;

    // Front & Back materials
    const frontMaterial = new THREE.MeshStandardMaterial({
      roughness: 0.2,
      metalness: 0.8,
    });

    const backMaterial = new THREE.MeshStandardMaterial({
      roughness: 0.25,
      metalness: 0.7,
    });

    const edgeMaterial = new THREE.MeshStandardMaterial({
      color: rank === 1 ? 0xf59e0b : 0xe95325,
      metalness: 0.9,
      roughness: 0.2,
    });

    // Front Plane
    const frontGeom = new THREE.PlaneGeometry(cardWidth, cardHeight);
    const frontMesh = new THREE.Mesh(frontGeom, frontMaterial);
    frontMesh.position.z = cardThickness / 2 + 0.001;
    cardGroup.add(frontMesh);

    // Back Plane (rotated 180 deg around Y)
    const backGeom = new THREE.PlaneGeometry(cardWidth, cardHeight);
    const backMesh = new THREE.Mesh(backGeom, backMaterial);
    backMesh.position.z = -(cardThickness / 2 + 0.001);
    backMesh.rotation.y = Math.PI;
    cardGroup.add(backMesh);

    // Metallic Edges
    const boxGeom = new THREE.BoxGeometry(cardWidth, cardHeight, cardThickness);
    const edgeMesh = new THREE.Mesh(boxGeom, edgeMaterial);
    cardGroup.add(edgeMesh);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight.position.set(3, 4, 5);
    scene.add(dirLight);

    // Dynamic point lights for holographic gleam
    const light1 = new THREE.PointLight(rank === 1 ? 0xfbbf24 : 0xff7a50, 3.5, 12);
    light1.position.set(0, 0, 4);
    scene.add(light1);

    const light2 = new THREE.PointLight(0xffffff, 2.5, 10);
    light2.position.set(2, -2, 3);
    scene.add(light2);

    // Build Textures
    createFrontCanvas().then((frontCanvas) => {
      const frontTexture = new THREE.CanvasTexture(frontCanvas);
      frontTexture.generateMipmaps = true;
      frontTexture.minFilter = THREE.LinearMipmapLinearFilter;
      frontMaterial.map = frontTexture;
      frontMaterial.needsUpdate = true;
    });

    const backCanvas = createBackCanvas();
    const backTexture = new THREE.CanvasTexture(backCanvas);
    backTexture.generateMipmaps = true;
    backMaterial.map = backTexture;
    backMaterial.needsUpdate = true;

    // Interaction state
    let targetRotationX = 0;
    let targetRotationY = 0;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        targetRotationY += deltaX * 0.008;
        targetRotationX += deltaY * 0.008;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      } else {
        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        targetRotationY = x * 0.35;
        targetRotationX = -y * 0.25;

        // Move holographic point light
        light1.position.x = x * 3;
        light1.position.y = y * 3;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleMouseLeave = () => {
      isDragging = false;
      targetRotationX = 0;
      targetRotationY = isFlipped ? Math.PI : 0;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - prevMouseX;
        const deltaY = e.touches[0].clientY - prevMouseY;
        targetRotationY += deltaX * 0.008;
        targetRotationX += deltaY * 0.008;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = () => {
      isDragging = false;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove);
    container.addEventListener('touchend', handleTouchEnd);

    // Animation Loop
    const clock = new THREE.Clock();
    let animFrameId = 0;

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      cardGroup.rotation.y += (targetRotationY - cardGroup.rotation.y) * 0.08;
      cardGroup.rotation.x += (targetRotationX - cardGroup.rotation.x) * 0.08;

      // Gentle floating levitation
      cardGroup.position.y = Math.sin(elapsedTime * 1.6) * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    sceneRef.current = {
      scene,
      camera,
      renderer,
      cardGroup,
      frontMesh,
      backMesh,
      light1,
      light2,
      targetRotationY,
      targetRotationX,
      animFrameId,
    };

    const handleResize = () => {
      if (!containerRef.current || !sceneRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      renderer.dispose();
      frontGeom.dispose();
      backGeom.dispose();
      boxGeom.dispose();
      frontMaterial.dispose();
      backMaterial.dispose();
      edgeMaterial.dispose();
    };
  }, [rank, createFrontCanvas, createBackCanvas, isFlipped]);

  const handleFlipCard = () => {
    if (!sceneRef.current) return;
    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);
    sceneRef.current.targetRotationY += Math.PI;
  };

  const handleDownloadCard = async () => {
    setIsDownloading(true);
    try {
      const canvas = await createFrontCanvas();
      const link = document.createElement('a');
      link.download = `Cinebid-${hero.name.replace(/\s+/g, '-')}-Spot-Card.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (err) {
      console.error('Failed to download card:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    const text = `I just backed ${hero.name} with ${formatRupee(amount)} on Cinebid! My Spot Card is locked at #${rank}. Check the live Indian Cinema leaderboard: ${window.location.origin}/heroes/${hero.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Cinebid Backer Card: ${hero.name}`,
          text,
          url: `${window.location.origin}/heroes/${hero.id}`,
        });
        return;
      } catch {}
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareTwitter = () => {
    const text = `I just backed ${hero.name} with ${formatRupee(amount)} on @bidstar_in! Live Rank #${rank}. Back your star here:`;
    const url = `${window.location.origin}/heroes/${hero.id}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const handleShareWhatsApp = () => {
    const text = `🔥 I just backed ${hero.name} with ${formatRupee(amount)} on bidstar! Live Spot #${rank}. Check the live leaderboard: ${window.location.origin}/heroes/${hero.id}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* 3D WebGL Canvas Container */}
      <div className="relative w-full max-w-sm sm:max-w-md h-[460px] sm:h-[500px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none">
        <div ref={containerRef} className="w-full h-full" />

        {/* Floating Hint Overlay - High contrast Vercel pill */}
        <div className="absolute top-3 left-4 pointer-events-none px-3 py-1 rounded-full bg-[var(--card-bg)] border border-[var(--card-border)] text-[11px] font-semibold text-[var(--foreground)] flex items-center gap-1.5 shadow-xs">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Move or drag to tilt 3D card</span>
        </div>

        {/* Flip button overlay */}
        <button
          onClick={handleFlipCard}
          className="absolute bottom-3 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--card-bg)] hover:bg-[var(--card-hover)] border border-[var(--card-border)] text-xs font-semibold text-[var(--foreground)] transition-all cursor-pointer shadow-sm"
          title="Flip 3D Card"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Flip</span>
        </button>
      </div>

      {/* Card Action Toolbar */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 w-full max-w-md">
        <button
          onClick={handleDownloadCard}
          disabled={isDownloading}
          className="flex-1 min-w-[130px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#e95325] hover:bg-[#d84417] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{isDownloading ? 'Exporting...' : 'Download Card'}</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[var(--pill-bg)] hover:bg-[var(--card-hover)] border border-[var(--pill-border)] text-xs font-semibold text-[var(--foreground)] transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-500 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </>
          )}
        </button>

        <button
          onClick={handleShareWhatsApp}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold transition-colors cursor-pointer"
          title="Share to WhatsApp"
        >
          <span>WhatsApp</span>
        </button>

        <button
          onClick={handleShareTwitter}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-600 dark:text-sky-400 text-xs font-semibold transition-colors cursor-pointer"
          title="Share to X (Twitter)"
        >
          <span>Post to X</span>
        </button>
      </div>
    </div>
  );
}
