export enum CloudProvider {
  AWS = 'AWS',
  GCP = 'GCP',
  AZURE = 'AZURE',
  PRIVATE = 'PRIVATE',
}

export enum NodeType {
  EXCHANGE = 'Exchange',
  REGION = 'Cloud Region',
}

export type NodeStatus = 'operational' | 'degraded' | 'maintenance';

export interface LatencySample {
  timestamp: number;
  value: number;
}

export type LatencyLinkStatus = 'optimal' | 'moderate' | 'critical';

export interface LatencyLink {
  id: string;
  source: string;
  target: string;
  latencyMs: number;
  status: LatencyLinkStatus;
  history: LatencySample[];
  startLat?: number;
  startLng?: number;
  endLat?: number;
  endLng?: number;
}

export interface GeoNode {
  id: string;
  name: string;
  lat: number;
  lng: number;
  provider: CloudProvider;
  type: NodeType;
  regionCode: string;
  status: NodeStatus;
  endpoint?: string;
  clientLatency?: number;
}

export interface FilterState {
  showExchanges: boolean;
  showRegions: boolean;
  showRealTime: boolean;
  showHistorical: boolean;
  providers: Record<CloudProvider, boolean>;
  minLatency: number;
  maxLatency: number;
  searchQuery: string;
}

export interface TopologyState {
  nodes: GeoNode[];
  links: LatencyLink[];
  lastUpdated: number;
}