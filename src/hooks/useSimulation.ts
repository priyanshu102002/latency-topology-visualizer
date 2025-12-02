import { useEffect, useRef } from "react";
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
  const nodesRef = useRef(nodes);

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(tickSimulation());
    }, 2000);
    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    const pingAllNodes = async () => {
      const nodesSnapshot = nodesRef.current || [];
      const nodesToPing = [...nodesSnapshot]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      nodesToPing.forEach(async (node) => {
        if (node.endpoint) {
          try {
            const result = await triggerPing(node.endpoint).unwrap();
            dispatch(updateNodeLatency({ nodeId: node.id, latency: result }));
          } catch (e) {
            
          }
        }
      });
    };

    const pingInterval = setInterval(pingAllNodes, 5000);
    pingAllNodes();

    return () => clearInterval(pingInterval);
  }, [dispatch, triggerPing]);
};