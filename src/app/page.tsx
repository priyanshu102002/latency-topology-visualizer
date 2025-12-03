"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { toggleSidebar, selectNode } from "@/store/slices/uiSlice";
import { useSimulation } from "@/hooks/useSimulation";
import GlobeWrapper from "@/components/GlobeWrapper";
import ControlPanel from "@/components/ControlPanel";
import StatsPanel from "@/components/StatsPanel";
import Legend from "@/components/Legend";

const App: React.FC = () => {
  const dispatch = useDispatch();

  useSimulation();

  const { isSidebarOpen, selectedNodeId } = useSelector(
    (state: RootState) => state.ui
  );
  const { nodes, links } = useSelector((state: RootState) => state.topology);
  const selectedNode = selectedNodeId
    ? nodes.find((node) => node.id === selectedNodeId) ?? null
    : null;

  return (
    <div className="relative w-screen h-screen bg-white overflow-hidden font-sans transition-colors duration-300">
      <div className="absolute inset-0 z-0">
        <GlobeWrapper />
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none flex">
        <div
          className={`pointer-events-auto h-full transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <ControlPanel />
        </div>

        <button
          onClick={() => dispatch(toggleSidebar())}
          className="pointer-events-auto absolute top-4 left-4 z-50 p-2 bg-slate-200  text-slate-900  rounded-md hover:bg-slate-300 md:hidden shadow-lg"
        >
          {isSidebarOpen ? "Close" : "Menu"}
        </button>

        <div className="flex-1 relative"></div>

        <div
          className={`pointer-events-auto h-full transition-transform duration-300 ease-in-out ${
            selectedNodeId ? "translate-x-0" : "translate-x-full"
          } absolute right-0 md:relative md:translate-x-0`}
        >
          <StatsPanel
            selectedNode={selectedNode}
            links={links}
            onClose={() => dispatch(selectNode(null))}
            className="h-full"
          />
        </div>
      </div>

      <Legend />
    </div>
  );
};

export default App;
