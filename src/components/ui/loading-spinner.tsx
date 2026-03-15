"use client";
import { useEffect, useRef } from "react";

export default function LoadingSpinner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const cx = 60, cy = 60, R = 38, dotR = 7;
    const colors = ["#7F77DD","#1D9E75","#D85A30","#D4537E","#378ADD","#BA7517","#639922","#E24B4A"];
    const count = colors.length;
    let frame = 0, raf: number;

    function draw() {
      ctx.clearRect(0, 0, 120, 120);
      const time = frame * 0.04;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + time;
        const x = cx + R * Math.cos(angle);
        const y = cy + R * Math.sin(angle);
        const scale = 0.5 + 0.5 * ((Math.sin(angle - time * 2 + i) + 1) / 2);
        ctx.globalAlpha = 0.35 + 0.65 * scale;
        ctx.beginPath();
        ctx.arc(x, y, dotR * scale, 0, Math.PI * 2);
        ctx.fillStyle = colors[i];
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      frame++;
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <canvas ref={canvasRef} width={120} height={120} />
      <span className="text-sm text-muted-foreground">Loading...</span>
    </div>
  );
}
