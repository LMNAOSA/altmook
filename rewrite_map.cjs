const fs = require('fs');

const mapContent = `import React, { useRef, useEffect, useState } from "react";
import { MINING_NODES, MiningNode } from "../data/miningData";

interface MapCanvasProps {
  onNodeSelect: (node: MiningNode) => void;
  selectedNode: MiningNode | null;
  zoomToTrigger?: { x: number; y: number; zoom: number; id: string } | null;
}

export default function MapCanvas({
  onNodeSelect,
  selectedNode,
  zoomToTrigger,
}: MapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const mapCenter = { x: 50, y: 50 }; // Logical map center

  // Initial centering
  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      const initialScale = Math.min(width, height) / 80;
      setScale(initialScale * 1.5);
      setPan({
        x: width / 2 - mapCenter.x * (initialScale * 1.5),
        y: height / 2 - mapCenter.y * (initialScale * 1.5),
      });
    }
  }, []);

  // Main render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const { width, height } = canvas;
      
      // We don't clear with a solid color, we clear transparent so the CSS background-image texture shows through
      ctx.clearRect(0, 0, width, height);

      ctx.save();
      ctx.translate(pan.x, pan.y);
      ctx.scale(scale, scale);

      // Draw subtle grid / survey lines
      ctx.strokeStyle = "rgba(53, 49, 45, 0.08)"; // iron ore very faint
      ctx.lineWidth = 1 / scale;
      
      const gridStep = 5;
      for (let x = -200; x <= 300; x += gridStep) {
        ctx.beginPath();
        ctx.moveTo(x, -200);
        ctx.lineTo(x, 300);
        ctx.stroke();
      }
      for (let y = -200; y <= 300; y += gridStep) {
        ctx.beginPath();
        ctx.moveTo(-200, y);
        ctx.lineTo(300, y);
        ctx.stroke();
      }

      // Draw Topographic contour abstraction
      ctx.strokeStyle = "rgba(53, 49, 45, 0.15)";
      ctx.lineWidth = 1.5 / scale;
      ctx.beginPath();
      ctx.moveTo(20, 10);
      ctx.bezierCurveTo(40, 30, 80, 10, 90, 50);
      ctx.bezierCurveTo(95, 80, 60, 90, 30, 70);
      ctx.bezierCurveTo(10, 50, 0, 30, 20, 10);
      ctx.stroke();

      ctx.strokeStyle = "rgba(53, 49, 45, 0.08)";
      ctx.lineWidth = 1 / scale;
      ctx.beginPath();
      ctx.moveTo(25, 15);
      ctx.bezierCurveTo(42, 32, 75, 15, 85, 50);
      ctx.bezierCurveTo(88, 75, 60, 85, 32, 68);
      ctx.bezierCurveTo(15, 52, 5, 32, 25, 15);
      ctx.stroke();

      // Nodes
      MINING_NODES.forEach((node) => {
        const isHovered = hoveredNodeId === node.id;
        const isSelected = selectedNode?.id === node.id;

        const nx = node.x;
        const ny = node.y;
        
        ctx.save();
        ctx.translate(nx, ny);

        if (node.type === "destination") {
          const size = 2.5;
          ctx.fillStyle = isSelected || isHovered ? "#A4683D" : "#1E2224"; // Burnished copper or Blackened steel
          ctx.fillRect(-size/2, -size/2, size, size);
          
          if (isSelected || isHovered) {
             ctx.strokeStyle = "#A4683D";
             ctx.lineWidth = 0.5 / scale;
             ctx.strokeRect(-size, -size, size*2, size*2);
          }
        }

        ctx.restore();
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [pan, scale, hoveredNodeId, selectedNode]);

  // Window Resize
  useEffect(() => {
    const resize = () => {
      if (containerRef.current && canvasRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        canvasRef.current.width = width;
        canvasRef.current.height = height;
      }
    };
    window.addEventListener("resize", resize);
    resize();
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Handlers
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomSensitivity = 0.0015;
    const delta = -e.deltaY * zoomSensitivity;
    
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const newScale = Math.min(Math.max(scale * (1 + delta), Math.min(rect.width, rect.height) / 100), 20);
      
      const newPanX = mouseX - (mouseX - pan.x) * (newScale / scale);
      const newPanY = mouseY - (mouseY - pan.y) * (newScale / scale);

      setScale(newScale);
      setPan({ x: newPanX, y: newPanY });
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    
    // Check click hit
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = (e.clientX - rect.left - pan.x) / scale;
      const clickY = (e.clientY - rect.top - pan.y) / scale;
      
      let hit = null;
      for (const node of MINING_NODES) {
        const dx = node.x - clickX;
        const dy = node.y - clickY;
        if (Math.sqrt(dx * dx + dy * dy) < 4 / scale) {
          hit = node;
          break;
        }
      }
      
      if (hit) {
        onNodeSelect(hit);
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left - pan.x) / scale;
      const mouseY = (e.clientY - rect.top - pan.y) / scale;
      
      let hovered = null;
      for (const node of MINING_NODES) {
        const dx = node.x - mouseX;
        const dy = node.y - mouseY;
        if (Math.sqrt(dx * dx + dy * dy) < 4 / scale) {
          hovered = node;
          break;
        }
      }
      
      setHoveredNodeId(hovered ? hovered.id : null);
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 map-canvas-container"
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
      
      {MINING_NODES.map((node) => {
        const screenX = node.x * scale + pan.x;
        const screenY = node.y * scale + pan.y;
        const isHovered = hoveredNodeId === node.id;
        const isSelected = selectedNode?.id === node.id;
        
        return (
          <div
            key={node.id}
            className="absolute pointer-events-none transform -translate-y-1/2"
            style={{
              left: \`\${screenX + (12 * (scale / 5))}px\`,
              top: \`\${screenY}px\`,
              opacity: isHovered || isSelected ? 1 : 0.6,
              transition: 'opacity 0.3s ease',
            }}
          >
            <span className="font-sans text-[length:var(--text-step-minus-1)] uppercase tracking-[0.2em] font-medium whitespace-nowrap text-[var(--color-blackened-steel)]"
                  style={{ textShadow: '0 0 4px var(--color-survey-paper), 0 0 8px var(--color-survey-paper)' }}>
              {node.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
`;
fs.writeFileSync('src/components/MapCanvas.tsx', mapContent);
