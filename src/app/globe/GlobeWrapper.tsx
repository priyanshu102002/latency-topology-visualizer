"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { selectNode } from "@/store/slices/uiSlice";

const GlobeViewer = dynamic(() => import("@/app/globe/GlobeViewer"), {
  ssr: false,
});

const GlobeWrapper: React.FC = () => {
  const dispatch = useDispatch();

  const { nodes, links } = useSelector((state: RootState) => state.topology);
  const { filters } = useSelector((state: RootState) => state.ui);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const update = () =>
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const visualNodesCache = useRef<Map<string, any>>(new Map());
  const visualLinksCache = useRef<Map<string, any>>(new Map());

  const stableNodes = useMemo(() => {
    const activeIds = new Set<string>();
    const result: any[] = [];

    const filteredSource = nodes.filter((node) => {
      if (!filters.showExchanges && node.type === "Exchange") return false;
      if (!filters.showRegions && node.type === "Cloud Region") return false;
      if (!filters.providers[node.provider]) return false;

      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        return (
          node.name.toLowerCase().includes(q) ||
          node.regionCode?.toLowerCase().includes(q) ||
          node.provider.toLowerCase().includes(q)
        );
      }
      return true;
    });

    filteredSource.forEach((node) => {
      let visualNode = visualNodesCache.current.get(node.id);

      if (!visualNode) {
        visualNode = { ...node }; // faster than deep clone
        visualNodesCache.current.set(node.id, visualNode);
      } else {
        // update only mutable fields
        visualNode.status = node.status;
        visualNode.clientLatency = node.clientLatency;
        visualNode.lat = node.lat;
        visualNode.lng = node.lng;
      }

      activeIds.add(node.id);
      result.push(visualNode);
    });

    // cleanup
    for (const id of visualNodesCache.current.keys()) {
      if (!activeIds.has(id)) visualNodesCache.current.delete(id);
    }

    return result;
  }, [nodes, filters]);

  const stableLinks = useMemo(() => {
    const activeIds = new Set<string>();
    const result: any[] = [];
    const visibleIds = new Set(stableNodes.map((n: any) => n.id));

    const filteredSource = links.filter((link) => {
      if (!visibleIds.has(link.source) || !visibleIds.has(link.target))
        return false;
      if (link.latencyMs > filters.maxLatency) return false;
      if (!filters.showRealTime) return false;
      return true;
    });

    filteredSource.forEach((link) => {
      let visualLink = visualLinksCache.current.get(link.id);

      if (!visualLink) {
        visualLink = { ...link };

        const sourceNode = nodes.find((n) => n.id === link.source);
        const targetNode = nodes.find((n) => n.id === link.target);

        if (sourceNode && targetNode) {
          visualLink.startLat = sourceNode.lat;
          visualLink.startLng = sourceNode.lng;
          visualLink.endLat = targetNode.lat;
          visualLink.endLng = targetNode.lng;
        }

        visualLinksCache.current.set(link.id, visualLink);
      } else {
        visualLink.latencyMs = link.latencyMs;
        visualLink.status = link.status;
        visualLink.history = link.history; 
      }

      activeIds.add(link.id);
      result.push(visualLink);
    });

    for (const id of visualLinksCache.current.keys()) {
      if (!activeIds.has(id)) visualLinksCache.current.delete(id);
    }

    return result;
  }, [links, stableNodes, filters.maxLatency]); 

  const handleNodeClick = (node: any) => {
    dispatch(selectNode(node.id));
  };

  return (
    <GlobeViewer
      nodes={stableNodes}
      links={stableLinks}
      onNodeClick={handleNodeClick}
      width={dimensions.width}
      height={dimensions.height}
    />
  );
};

export default GlobeWrapper;
