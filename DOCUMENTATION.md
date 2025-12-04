# Latency Topology Visualizer - Technical Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [State Management](#state-management)
6. [Core Components](#core-components)
7. [Services & Utilities](#services--utilities)
8. [API Routes](#api-routes)
9. [Data Flow](#data-flow)
10. [Key Features](#key-features)
11. [Development Guide](#development-guide)

---

## Project Overview

The **Latency Topology Visualizer** is a Next.js application that provides an interactive 3D globe visualization of network topology, displaying nodes (exchanges and cloud regions) and their latency connections. The application enables real-time monitoring of network latency, filtering by providers and node types, and exporting detailed reports.

### Key Capabilities

- **3D Globe Visualization**: Interactive WebGL-based globe showing network nodes and connections
- **Real-time Latency Monitoring**: Continuous updates of latency measurements between nodes
- **Multi-Provider Support**: Visualize nodes from AWS, GCP, Azure, and Private infrastructure
- **Filtering & Search**: Filter by provider, node type, latency thresholds, and search by name
- **Node Details Panel**: View detailed statistics, latency history charts, and connections for selected nodes
- **PDF Export**: Generate detailed latency reports in PDF format
- **Responsive Design**: Works on desktop and mobile devices

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js App Router                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Client     │  │   Server     │  │   API Routes │  │
│  │  Components  │  │   Components  │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│              Redux Toolkit Store                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Topology    │  │     UI       │  │   Network    │  │
│  │    Slice     │  │    Slice     │  │     API      │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│              Services & Utilities                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Latency    │  │     PDF      │  │   Format     │  │
│  │  Simulator   │  │   Exporter   │  │    Utils     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
App (page.tsx)
├── GlobeWrapper
│   └── GlobeViewer (react-globe.gl)
├── ControlPanel
│   ├── Header
│   ├── SearchInput
│   ├── LayersSection
│   ├── VisualizationSection
│   ├── ProviderSection
│   └── LatencyThreshold
├── StatsPanel
│   ├── NodeHeader
│   ├── StatsCards
│   ├── LatencyHistoryChart
│   ├── ConnectionsList
│   └── ClientLatencyCard
└── Legend
```

---

## Technology Stack

### Core Framework
- **Next.js 16.0.5**: React framework with App Router
- **React 19.2.0**: UI library
- **TypeScript 5**: Type-safe development

### State Management
- **Redux Toolkit 2.11.0**: State management with slices
- **React-Redux 9.2.0**: React bindings for Redux
- **RTK Query**: API state management

### Visualization
- **react-globe.gl 2.37.0**: 3D globe visualization (Three.js/WebGL)
- **recharts 3.5.0**: Charting library for latency history

### UI & Styling
- **Tailwind CSS 4**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
  - `@radix-ui/react-slider`: Slider component
  - `@radix-ui/react-switch`: Switch component
  - `@radix-ui/react-slot`: Composition utility
- **lucide-react**: Icon library
- **class-variance-authority**: Component variant management
- **tailwind-merge**: Tailwind class merging utility

### Utilities
- **jspdf 3.0.4**: PDF generation for reports
- **clsx**: Conditional class name utility

---

## Project Structure

```
latency-topology-visualizer/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/                      # API routes
│   │   │   └── radar/
│   │   │       └── latency/
│   │   │           └── route.ts      # Latency measurement endpoint
│   │   ├── globals.css               # Global styles
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                   # Main application page
│   │   └── providers.tsx              # Redux provider wrapper
│   │
│   ├── components/                    # React components
│   │   ├── globe/                    # Globe visualization
│   │   │   ├── GlobeViewer.tsx       # Core globe component
│   │   │   └── GlobeWrapper.tsx      # Globe wrapper with filtering
│   │   │
│   │   ├── panel/                    # Control & stats panels
│   │   │   ├── ControlPanel.tsx      # Left sidebar controls
│   │   │   ├── StatsPanel.tsx         # Right sidebar stats
│   │   │   ├── Header.tsx             # Panel header
│   │   │   ├── SearchInput.tsx        # Search functionality
│   │   │   ├── LayersSection.tsx      # Layer toggles
│   │   │   ├── VisualizationSection.tsx # Visualization toggles
│   │   │   ├── ProviderSection.tsx    # Provider filters
│   │   │   ├── LatencyThreshold.tsx   # Latency slider
│   │   │   ├── NodeHeader.tsx         # Node info header
│   │   │   ├── StatsCards.tsx         # Statistics cards
│   │   │   ├── LatencyHistoryChart.tsx # Latency chart
│   │   │   ├── ConnectionsList.tsx    # Connections list
│   │   │   ├── ClientLatencyCard.tsx  # Client latency display
│   │   │   ├── EmptyState.tsx         # Empty state component
│   │   │   └── Legend.tsx             # Map legend
│   │   │
│   │   └── ui/                       # Reusable UI components
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── slider.tsx
│   │       └── switch.tsx
│   │
│   ├── data/                         # Static data
│   │   └── constants.ts              # Node definitions & constants
│   │
│   ├── hooks/                        # Custom React hooks
│   │   └── useSimulation.ts          # Simulation lifecycle hook
│   │
│   ├── lib/                          # Utility libraries
│   │   ├── formatTime.ts             # Time formatting utilities
│   │   ├── latencyUtils.ts           # Latency color/threshold utils
│   │   └── utils.ts                  # General utilities
│   │
│   ├── services/                     # Business logic services
│   │   ├── latencySimulator.ts       # Latency simulation logic
│   │   └── pdfExporter.ts            # PDF export functionality
│   │
│   ├── store/                        # Redux store
│   │   ├── index.ts                  # Store configuration
│   │   ├── api/
│   │   │   └── networkApi.ts         # RTK Query API for network calls
│   │   └── slices/
│   │       ├── topologySlice.ts      # Topology state management
│   │       └── uiSlice.ts            # UI state management
│   │
│   └── types/                        # TypeScript type definitions
│       └── index.ts                  # All type definitions
│
├── public/                           # Static assets
├── components.json                   # shadcn/ui configuration
├── next.config.ts                    # Next.js configuration
├── package.json                      # Dependencies & scripts
├── tsconfig.json                     # TypeScript configuration
└── README.md                         # Project README
```

---

## State Management

### Redux Store Structure

The application uses Redux Toolkit with three main slices:

#### 1. Topology Slice (`topologySlice.ts`)

Manages network topology data:

```typescript
interface TopologyState {
  nodes: GeoNode[];        // All network nodes
  links: LatencyLink[];    // Connections between nodes
  lastUpdated: number;     // Timestamp of last update
}
```

**Actions:**
- `tickSimulation()`: Updates all link latencies with simulated changes
- `updateNodeLatency({ nodeId, latency })`: Updates client-side latency for a node

**Initial State:**
- Nodes loaded from `NODES` constant
- Links generated using `generateInitialLinks()`

#### 2. UI Slice (`uiSlice.ts`)

Manages UI state and filters:

```typescript
interface UiState {
  isSidebarOpen: boolean;
  selectedNodeId: string | null;
  filters: FilterState;
}

interface FilterState {
  showExchanges: boolean;
  showRegions: boolean;
  showRealTime: boolean;
  showHistorical: boolean;
  providers: Record<CloudProvider, boolean>;
  maxLatency: number;
  searchQuery: string;
}
```

**Actions:**
- `toggleSidebar()`: Toggles left sidebar visibility
- `selectNode(nodeId | null)`: Selects/deselects a node
- `updateFilter(partial)`: Updates filter state
- `toggleProvider(provider)`: Toggles provider visibility

#### 3. Network API (`networkApi.ts`)

RTK Query API for network latency measurements:

**Endpoints:**
- `pingNode(url)`: Measures latency to a given URL endpoint

**Features:**
- Uses lazy query (`useLazyPingNodeQuery`)
- Caches results for 5 seconds
- Handles errors gracefully

---

## Core Components

### 1. App (`src/app/page.tsx`)

Main application component that orchestrates the entire UI:

- **Layout**: Full-screen container with globe background
- **Sidebars**: 
  - Left: ControlPanel (filtering & controls)
  - Right: StatsPanel (node details)
- **Mobile Support**: Hamburger menu for mobile sidebar toggle
- **State Integration**: Connects Redux store to components

**Key Responsibilities:**
- Renders GlobeWrapper as background
- Manages sidebar visibility
- Handles node selection
- Initializes simulation hook

### 2. GlobeWrapper (`src/components/globe/GlobeWrapper.tsx`)

Wrapper component that filters and prepares data for the globe:

**Features:**
- **Filtering**: Applies all UI filters to nodes and links
- **Caching**: Maintains stable references for performance
- **Search**: Filters nodes by name, region, or provider
- **Latency Filtering**: Hides links above threshold
- **Node Click Handling**: Dispatches node selection

**Filtering Logic:**
- Nodes filtered by: type (Exchange/Region), provider, search query
- Links filtered by: visibility of source/target nodes, latency threshold, real-time toggle

### 3. GlobeViewer (`src/components/globe/GlobeViewer.tsx`)

Core 3D globe visualization component using `react-globe.gl`:

**Visualization Elements:**
- **Globe**: Earth texture with night sky background
- **Nodes**: Colored markers based on provider
  - Exchange nodes: Higher altitude (0.12) with rings
  - Region nodes: Lower altitude (0.05)
  - Hover effects: Larger radius and label size
- **Links**: Curved arcs showing connections with color-coded latency
  - Green: Optimal (<120ms)
  - Yellow: Moderate (120-250ms)
  - Red: Critical (>250ms)
  - Animated dash pattern (2s cycle)
- **Labels**: Node names with hover effects
- **Rings**: Pulsing rings around Exchange nodes
- **Interactivity**: 
  - Click nodes to select
  - Hover for tooltip with node details
  - Auto-rotation enabled (0.6 speed)

**Performance Optimizations:**
- Dynamic import (SSR disabled)
- Memoized node/link data
- Efficient re-renders with React.memo
- Pixel ratio optimization (max 2x)

### 4. ControlPanel (`src/components/panel/ControlPanel.tsx`)

Left sidebar containing all filtering and control options:

**Sections:**
1. **Header**: Application title
2. **SearchInput**: Text search for nodes
3. **LayersSection**: Toggle Exchange/Region visibility
4. **VisualizationSection**: Toggle Real-time/Historical data
5. **ProviderSection**: Toggle provider visibility (AWS, GCP, Azure, Private)
6. **LatencyThreshold**: Slider for maximum latency filter

### 5. StatsPanel (`src/components/panel/StatsPanel.tsx`)

Right sidebar displaying detailed node information:

**Displays:**
- **NodeHeader**: Node name, provider, status badge
- **StatsCards**: Key metrics (current latency, average, connections)
- **LatencyHistoryChart**: Time-series chart of latency over time
- **ConnectionsList**: All connections to/from the node
- **ClientLatencyCard**: Client-side latency measurement
- **Export Button**: PDF report generation

**Features:**
- Auto-closes when no node selected
- Responsive layout
- Real-time updates

---

## Services & Utilities

### 1. Latency Simulator (`src/services/latencySimulator.ts`)

Simulates realistic latency changes over time:

**Functions:**

#### `generateInitialLinks(nodes: GeoNode[]): LatencyLink[]`
- Creates connections between nodes based on:
  - Geographic distance (Haversine formula)
  - Base latency calculation: `(distance * 2) / 200` ms
  - Connection rules: Links nodes if latency < 250ms OR if Exchange ↔ Cloud Region
- Generates initial history buffer (60 samples)

#### `updateLatencies(links: LatencyLink[]): LatencyLink[]`
- Updates latency with:
  - Random jitter: ±5ms variation
  - Occasional spikes: 2% chance of +50-150ms spike
  - Auto-recovery: Latency returns to baseline if >2x baseline
- Updates status: optimal (<120ms), moderate (120-250ms), critical (>250ms)
- Maintains history buffer (last 100 samples)

**Latency Calculation:**
- Uses Haversine formula for great-circle distance
- Base latency: `(distance_km * 2) / 200` ms
- Minimum latency: 5ms
- Adds 10ms base overhead

### 2. PDF Exporter (`src/services/pdfExporter.ts`)

Generates PDF reports for selected nodes:

**Function:** `exportLatencyReportToPDF(data: ExportData)`

**Report Sections:**
1. **Header**: Title and generation timestamp
2. **Node Information**: Name, ID, provider, region, status, location, client latency
3. **Connection Statistics**: Current latency, average latency, status
4. **Latency History Table**: Time-series data
5. **Active Connections Table**: All connected nodes with latencies

**Features:**
- Multi-page support with pagination
- Styled headers and tables
- Automatic page breaks
- Professional formatting

### 3. Latency Utils (`src/lib/latencyUtils.ts`)

Utility functions for latency display:

**Constants:**
- `LATENCY_THRESHOLDS`: Critical (150ms), Warning (100ms), Client Warning (200ms)

**Functions:**
- `getLatencyColor(latency)`: Returns Tailwind color class based on latency
- `getClientLatencyColor(latency)`: Returns color for client latency display

### 4. Format Time (`src/lib/formatTime.ts`)

Time formatting utilities for display in charts and UI:

**Function:** `formatTime(timestamp: number, timeRange: string): string`

**Time Ranges:**
- `1h`: Formats as HH:MM (e.g., "14:30")
- `24h`: Formats as HH:MM (e.g., "14:30")
- `7d`: Formats as "MMM DD" (e.g., "Jan 15")

### 5. Utils (`src/lib/utils.ts`)

General utility functions:

**Function:** `cn(...inputs: ClassValue[]): string`
- Merges Tailwind CSS classes safely
- Combines `clsx` and `tailwind-merge`
- Used throughout components for conditional styling

---

## API Routes

### `/api/radar/latency` (GET)

Measures network latency to a target URL.

**Query Parameters:**
- `target` (required): URL to measure latency against

**Request Example:**
```
GET /api/radar/latency?target=https://api.example.com/ping
```

**Response:**
```json
{
  "latencyMs": 45,
  "status": 200,
  "ok": true
}
```

**Error Response:**
```json
{
  "latencyMs": -1,
  "error": "Invalid URL format",
  "status": 400
}
```

**Features:**
- **URL Validation**: Ensures valid HTTP/HTTPS URLs
- **Timeout**: 10-second timeout for requests
- **Method**: Uses HEAD request to minimize data transfer
- **Error Handling**: Returns latency even for failed requests (measures time to failure)
- **Security**: Only allows HTTP/HTTPS protocols

**Use Cases:**
- Real-time latency measurement to node endpoints
- Health checking of network nodes
- Performance monitoring

---

## Data Flow

### Initialization Flow

```
1. App mounts
   ↓
2. Redux store initializes
   ├── TopologySlice: Loads NODES, generates initial links
   └── UISlice: Sets default filters
   ↓
3. useSimulation hook starts
   ├── Sets up 2s interval for tickSimulation()
   └── Sets up 5s interval for pingNode() calls
   ↓
4. GlobeWrapper filters nodes/links based on UI state
   ↓
5. GlobeViewer renders 3D visualization
```

### Update Flow

```
User Interaction / Timer
   ↓
Redux Action Dispatched
   ↓
Reducer Updates State
   ↓
React Components Re-render
   ↓
GlobeWrapper Re-filters Data
   ↓
GlobeViewer Updates Visualization
```

### Node Selection Flow

```
User clicks node on globe
   ↓
GlobeWrapper.handleNodeClick()
   ↓
Dispatch selectNode(nodeId)
   ↓
UI Slice updates selectedNodeId
   ↓
StatsPanel receives selectedNode
   ↓
StatsPanel displays node details
```

### Latency Measurement Flow

```
useSimulation hook (every 5s)
   ↓
Selects 3 random nodes
   ↓
Calls triggerPing(endpoint)
   ↓
RTK Query → networkApi.pingNode()
   ↓
Fetches /api/radar/latency?target=...
   ↓
API measures latency
   ↓
Returns latencyMs
   ↓
Dispatch updateNodeLatency()
   ↓
TopologySlice updates node.clientLatency
   ↓
UI updates to show new latency
```

---

## Key Features

### 1. Real-time Latency Simulation

- **Frequency**: Updates every 2 seconds
- **Mechanism**: Adds random jitter and occasional spikes
- **Recovery**: Auto-recovers from spikes
- **Status Tracking**: Updates link status (optimal/moderate/critical)

### 2. Actual Latency Measurement

- **Frequency**: Pings 3 random nodes every 5 seconds
- **Method**: HTTP HEAD requests to node endpoints
- **Display**: Shows client-side latency in node details
- **Status Updates**: Updates node status based on latency thresholds

### 3. Advanced Filtering

- **By Type**: Exchange vs Cloud Region
- **By Provider**: AWS, GCP, Azure, Private
- **By Latency**: Maximum latency threshold slider
- **By Search**: Name, region code, or provider search
- **Visualization**: Real-time vs Historical data toggle

### 4. Interactive Visualization

- **3D Globe**: Rotate, zoom, pan
- **Node Selection**: Click nodes to view details
- **Color Coding**: 
  - Nodes: Provider colors
  - Links: Latency status colors (green/yellow/red)
- **Hover Effects**: Tooltips with node information

### 5. Detailed Statistics

- **Current Latency**: Latest measurement
- **Average Latency**: Mean of history
- **Connection Count**: Number of active connections
- **History Chart**: Time-series visualization
- **Connection List**: All connected nodes with latencies

### 6. Export Functionality

- **PDF Reports**: Comprehensive latency reports
- **Includes**: Node info, statistics, history, connections
- **Formatting**: Professional multi-page layout

---

## Development Guide

### Prerequisites

- **Node.js**: LTS version (compatible with Next.js 16)
- **npm**: Package manager
- **Modern Browser**: With WebGL support

### Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build production bundle
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

### Adding New Nodes

Edit `src/data/constants.ts`:

```typescript
export const NODES: GeoNode[] = [
  // ... existing nodes
  {
    id: 'new-node-id',
    name: 'New Node Name',
    lat: 40.7128,
    lng: -74.0060,
    provider: CloudProvider.AWS,
    type: NodeType.EXCHANGE,
    regionCode: 'us-east-1',
    status: 'operational',
    endpoint: 'https://api.example.com/ping'
  }
];
```

### Customizing Latency Simulation

Edit `src/services/latencySimulator.ts`:

- Adjust `HISTORY_BUFFER_SIZE` for history length
- Modify jitter range in `updateLatencies()`
- Change spike probability (currently 2%)
- Adjust status thresholds (optimal/moderate/critical)

### Adding New Providers

1. Add to `CloudProvider` enum in `src/types/index.ts`
2. Add color to `PROVIDER_COLORS` in `src/data/constants.ts`
3. Update `ProviderSection` component if needed

### Styling

- Uses Tailwind CSS 4
- Global styles in `src/app/globals.css`
- Component-specific styles via Tailwind classes
- Dark mode support via `dark:` prefix

### Type Safety

- All components are TypeScript
- Types defined in `src/types/index.ts`
- Strict type checking enabled in `tsconfig.json`

---

## Performance Considerations

### Optimization Strategies

1. **Memoization**: 
   - `useMemo` in GlobeWrapper for filtered nodes/links
   - Stable references to prevent unnecessary re-renders

2. **Caching**:
   - Visual nodes/links cache in GlobeWrapper
   - RTK Query caching for API calls (5s TTL)

3. **Dynamic Imports**:
   - GlobeViewer loaded dynamically (SSR disabled)
   - Reduces initial bundle size

4. **Efficient Updates**:
   - Only updates changed nodes/links
   - Batch Redux updates

5. **History Management**:
   - Limited history buffer (100 samples)
   - Prevents memory growth

---

## Browser Compatibility

- **WebGL**: Required for globe visualization
- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile**: Responsive design with touch support

---

## Future Enhancements

Potential improvements:

1. **Real-time WebSocket**: Live latency updates from backend
2. **Historical Data Storage**: Persist latency history
3. **Alerting**: Notifications for critical latency thresholds
4. **Custom Node Groups**: User-defined node groupings
5. **Export Formats**: CSV, JSON export options
6. **Advanced Analytics**: Trend analysis, predictions
7. **Multi-user Support**: Collaborative viewing
8. **Custom Themes**: User-selectable color schemes

---

## Quick Reference

### Common Tasks

#### Adding a New Node Type
1. Add enum value to `NodeType` in `src/types/index.ts`
2. Update filtering logic in `GlobeWrapper.tsx`
3. Update UI components that display node types

#### Changing Latency Thresholds
Edit `src/lib/latencyUtils.ts`:
```typescript
export const LATENCY_THRESHOLDS = {
  CRITICAL: 150,    // Change these values
  WARNING: 100,
  CLIENT_WARNING: 200,
} as const;
```

#### Modifying Simulation Frequency
Edit `src/hooks/useSimulation.ts`:
```typescript
// Change interval from 2000ms (2s) to desired value
setInterval(() => {
  dispatch(tickSimulation());
}, 2000); // Modify this value
```

#### Customizing Globe Appearance
Edit `src/components/globe/GlobeViewer.tsx`:
- `autoRotateSpeed`: Rotation speed (default: 0.6)
- `pointOfView`: Initial camera position
- `arcDashAnimateTime`: Link animation speed (default: 2000ms)
- `ringRepeatPeriod`: Ring pulse frequency (default: 1000ms)

#### Adding Custom Colors
Edit `src/data/constants.ts`:
```typescript
export const PROVIDER_COLORS: Record<CloudProvider, string> = {
  [CloudProvider.AWS]: '#FF9900',
  // Add your custom colors here
};
```

### Key Constants

- **Simulation Interval**: 2 seconds (`useSimulation.ts`)
- **Ping Interval**: 5 seconds (`useSimulation.ts`)
- **History Buffer**: 100 samples (`latencySimulator.ts`)
- **Initial History**: 60 samples (`latencySimulator.ts`)
- **Ping Timeout**: 10 seconds (`api/radar/latency/route.ts`)
- **Max Ping Nodes**: 3 per cycle (`useSimulation.ts`)

## Troubleshooting

### Globe Not Rendering

- Check WebGL support: Visit `chrome://gpu` (Chrome) or similar
- Verify browser console for errors
- Ensure `react-globe.gl` is properly installed
- Check that globe images are loading (check Network tab)

### Latency Not Updating

- Check browser console for API errors
- Verify node endpoints are accessible
- Check network tab for failed requests
- Verify CORS settings if pinging external APIs
- Check that simulation hook is running (check Redux DevTools)

### Performance Issues

- Reduce number of nodes/links
- Increase latency update interval
- Disable historical data visualization
- Reduce history buffer size
- Lower pixel ratio in GlobeViewer (currently max 2x)

### Redux State Not Updating

- Check Redux DevTools for dispatched actions
- Verify middleware configuration
- Check for serialization errors (non-serializable data)
- Ensure components are connected to store correctly


