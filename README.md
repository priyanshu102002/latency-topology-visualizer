## Project Overview

This repository contains a latency topology visualizer built with the Next.js App Router.  
It renders a globe-based view of network nodes and connections, shows latency statistics and history, and provides controls to tweak visualization layers and export data.

## Live Demo

You can try the live deployment here:  
[latency-topology-visualizer-liard.vercel.app](https://latency-topology-visualizer-liard.vercel.app/)

The live app renders a real-time latency globe with layers for exchanges and cloud regions, providers (AWS, GCP, Azure, Private), latency filters, and node-level statistics as seen on the deployed site [`https://latency-topology-visualizer-liard.vercel.app/`](https://latency-topology-visualizer-liard.vercel.app/).

## Running the Project Locally

- **1. Clone the repository**

 
  git clone <your-fork-or-this-repo-url>
  cd latency-topology-visualizer
  - **2. Install dependencies**

  Using `npm` (recommended to match the provided `package-lock.json`):
 
  npm install

 
  npm run dev
    Then open `http://localhost:3000` in your browser (with WebGL enabled) to view the latency topology visualizer, which should behave like the live app at [`https://latency-topology-visualizer-liard.vercel.app/`](https://latency-topology-visualizer-liard.vercel.app/).


## Assumptions

- **Runtime & tooling**
  - **Node.js**: You are using a modern, LTS version of Node.js compatible with Next.js 16.
  - **Package manager**: You have `npm` (or `yarn` / `pnpm` / `bun`) installed and can run scripts defined in `package.json`.
  - **Browser**: You’ll open the app in a modern browser with WebGL support (required for the globe visualization).

- **Environment**
  - **Local development**: The app is primarily run via `npm run dev` on `http://localhost:3000`.
  - **Network data**: Latency/topology data is either:
    - simulated by the built-in latency simulation utilities, or
    - provided via the included API route(s) and store logic.
  - **No external backend required**: Unless you integrate your own APIs, the existing mock/simulated data is sufficient to explore the UI.

- **Architecture**
  - **App Router**: The project uses the Next.js App Router under `src/app`.
  - **State management**: Global client state (e.g. topology, UI settings) is managed with Redux Toolkit and accessed via React-Redux hooks.
  - **Styling**: The UI is built with Tailwind CSS 4 (via `@tailwindcss/postcss`) and utility helpers for variants and class merging.
  - **Visualization**:
    - Globe-based network visualization uses `react-globe.gl` (Three.js/WebGL under the hood).
    - Charts (e.g. latency history) are implemented with `recharts`.

## Libraries & Dependencies

Below is a high-level description of the key libraries used in this project. For exact versions, see `package.json`.

- **Framework & core**
  - **Next.js** (`next`): Full-stack React framework (App Router) used for routing, API routes, and build tooling.
  - **React / React DOM** (`react`, `react-dom`): UI component library and DOM renderer.

- **State management**
  - **Redux Toolkit** (`@reduxjs/toolkit`): Simplified Redux setup for slices, store configuration, and immutable updates.
  - **React-Redux** (`react-redux`): React bindings to access the Redux store via hooks and context.

- **UI & styling**
  - **Tailwind CSS 4** (`tailwindcss`, `@tailwindcss/postcss`): Utility-first CSS, integrated into the Next.js build pipeline.
  - **Class variance & merging**:
    - `class-variance-authority`: For defining variant-based component styles.
    - `tailwind-merge`: For safely merging Tailwind class names.
    - `clsx`: For conditional class name construction.
  - **Icons**:
    - `lucide-react`: Icon set used throughout the UI.
  - **Radix UI primitives**:
    - `@radix-ui/react-slider`: Slider component for latency thresholds / ranges.
    - `@radix-ui/react-switch`: Switch component for toggles.
    - `@radix-ui/react-slot`: Utility for composition in reusable UI primitives.

- **Visualization & charts**
  - **Globe visualization**:
    - `react-globe.gl`: Interactive 3D globe for showing nodes, connections, and latency-related overlays.
  - **Charts**:
    - `recharts`: Charting library used for latency history and related data visualizations.

- **Exporting & utilities**
  - **PDF export**:
    - `jspdf`: Client-side PDF generation used to export reports or snapshots of the latency/topology view.
  - **TypeScript**:
    - `typescript`, `@types/*`: TypeScript tooling and type definitions for safer, typed development.

