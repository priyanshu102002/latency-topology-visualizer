import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  tickSimulation,
  updateNodeLatency,
} from "@/store/slices/topologySlice";
import { useLazyPingNodeQuery } from "@/store/api/networkApi";
import { RootState } from "@/store";

export const useSimulation = () => {
  const dispatch = useDispatch();
  const nodes = useSelector((state: RootState) => state.topology.nodes);
  const [triggerPing] = useLazyPingNodeQuery();

  // 1. Mesh Simulation Loop
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(tickSimulation());
    }, 2000);
    return () => clearInterval(interval);
  }, [dispatch]);

  // 2. Real-time Ping Loop
  useEffect(() => {
    const pingAllNodes = async () => {
      // Pick 2 random nodes to ping to avoid network flood
      const nodesToPing = [...nodes]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      nodesToPing.forEach(async (node) => {
        if (node.endpoint) {
          try {
            // Trigger RTK Query
            const result = await triggerPing(node.endpoint).unwrap();
            dispatch(updateNodeLatency({ nodeId: node.id, latency: result }));
          } catch (e) {
            // Error handling handled by slice status logic if needed,
            // or we could dispatch an error status here.
          }
        }
      });
    };

    const pingInterval = setInterval(pingAllNodes, 5000);
    pingAllNodes();

    return () => clearInterval(pingInterval);
  }, [dispatch, triggerPing, nodes]); // Dependency on nodes ensures we have latest list
};
