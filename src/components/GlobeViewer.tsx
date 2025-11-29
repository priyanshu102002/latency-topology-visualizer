"use client"

import React, { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';
import { GeoNode, CloudProvider, NodeType } from '../types';
import { PROVIDER_COLORS, GLOBE_IMAGE_URL, BACKGROUND_IMAGE_URL } from '@/data/constants';

interface GlobeViewerProps {
  nodes: GeoNode[];
  links: any[]; 
  onNodeClick: (node: GeoNode) => void;
  width?: number;
  height?: number;
}

const getNodeColor = (node: any) => PROVIDER_COLORS[node.provider as CloudProvider] || '#ffffff';
const getNodeAltitude = (node: any) => node.type === NodeType.EXCHANGE ? 0.12 : 0.05;
const getRingColor = () => ['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.05)'];
const getLabelColor = () => 'rgba(255, 255, 255, 0.75)';

const GlobeViewer: React.FC<GlobeViewerProps> = React.memo(({ nodes, links, onNodeClick, width, height }) => {
  const globeEl = useRef<GlobeMethods | undefined>(undefined);
  const [hoveredNode, setHoveredNode] = useState<GeoNode | null>(null);

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.6;
      globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2.2 });
      
      const renderer = globeEl.current.renderer();
      if (renderer) {
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      }
    }
  }, []);

  const arcColor = useCallback((link: any) => {
    // Vivid Traffic Light Colors
    if (link.status === 'critical') return ['#FF0000', '#8B0000']; // Red to Dark Red
    if (link.status === 'moderate') return ['#FFD700', '#B8860B']; // Gold to Dark Goldenrod
    return ['#00FF00', '#006400']; // Lime to Dark Green
  }, []);

  const getNodeRadius = useCallback((node: any) => {
    return node.id === hoveredNode?.id ? 0.8 : 0.5;
  }, [hoveredNode]);
  
  const getLabelSize = useCallback((d: any) => {
    return d.id === hoveredNode?.id ? 2 : 1.5;
  }, [hoveredNode]);

  const ringsData = useMemo(() => nodes.filter(n => n.type === NodeType.EXCHANGE), [nodes]);

  const handlePointClick = useCallback((point: object) => onNodeClick(point as GeoNode), [onNodeClick]);
  const handlePointHover = useCallback((point: object | null) => setHoveredNode(point as GeoNode | null), []);

  return (
    <div className="relative">
      <Globe
        ref={globeEl}
        width={width}
        height={height}
        globeImageUrl={GLOBE_IMAGE_URL}
        backgroundImageUrl={BACKGROUND_IMAGE_URL}
        
        // --- Points ---
        pointsData={nodes}
        pointLat="lat"
        pointLng="lng"
        pointColor={getNodeColor}
        pointAltitude={getNodeAltitude}
        pointRadius={getNodeRadius}
        onPointClick={handlePointClick}
        onPointHover={handlePointHover}
        pointResolution={16} 
        arcsData={links} 
        arcColor={arcColor}
        arcDashLength={0.4}
        arcDashGap={0.3}
        arcDashAnimateTime={2000} 
        arcStroke={0.6}
        arcAltitudeAutoScale={0.5}
        labelsData={nodes}
        labelLat="lat"
        labelLng="lng"
        labelText="name"
        labelSize={getLabelSize}
        labelDotRadius={0.3}
        labelColor={getLabelColor}
        labelResolution={2}
        labelIncludeDot={true}
        
        ringsData={ringsData}
        ringColor={getRingColor as any}
        ringMaxRadius={4}
        ringPropagationSpeed={2.5}
        ringRepeatPeriod={1000}
      />
      
      {hoveredNode && (
        <div 
          className="absolute pointer-events-none bg-slate-900/90 backdrop-blur-md border border-slate-700 p-2 rounded text-xs text-white z-50 shadow-xl"
          style={{ 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none'
          }}
        >
          <p className="font-bold text-emerald-400 text-sm mb-1">{hoveredNode.name}</p>
          <div className="space-y-0.5 text-slate-300">
            <p className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span> {hoveredNode.provider}</p>
            <p className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span> {hoveredNode.regionCode}</p>
            {hoveredNode.clientLatency && (
              <p className="flex items-center gap-1 font-mono text-blue-300 border-t border-slate-700 pt-1 mt-1">
                 Ping: {hoveredNode.clientLatency}ms
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export default GlobeViewer;