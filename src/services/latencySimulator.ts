import { LatencyLink, GeoNode } from '@/types';

// Haversine formula to calculate base latency based on distance
function getDistanceLatency(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  
  // Light in fiber is ~200,000 km/s. 
  // Round trip latency approx distance * 2 / 200 + routing overhead
  const baseLatency = (d * 2) / 200; 
  return Math.max(5, baseLatency + 10); // Minimum 5ms + 10ms overhead
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

// Increased buffer size for history
const HISTORY_BUFFER_SIZE = 100;

export const generateInitialLinks = (nodes: GeoNode[]): LatencyLink[] => {
  const links: LatencyLink[] = [];
  
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const source = nodes[i];
      const target = nodes[j];
      const baseLatency = getDistanceLatency(source.lat, source.lng, target.lat, target.lng);
      
      const shouldConnect = baseLatency < 250 || 
        (source.type === 'Exchange' && target.type === 'Cloud Region');

      if (shouldConnect) {
        // Generate a larger initial history
        const history = Array.from({ length: 60 }, (_, k) => ({
            timestamp: Date.now() - (60 - k) * 2000,
            value: baseLatency + (Math.random() * 10 - 5)
          }));

        links.push({
          id: `${source.id}-${target.id}`,
          source: source.id,
          target: target.id,
          latencyMs: baseLatency,
          status: 'optimal',
          history: history
        });
      }
    }
  }
  return links;
};

export const updateLatencies = (links: LatencyLink[]): LatencyLink[] => {
  return links.map(link => {
    // Random fluctuation simulating jitter
    const jitter = (Math.random() - 0.5) * 10; // +/- 5ms
    let newLatency = Math.max(5, link.history[link.history.length - 1].value + jitter);
    
    // Occasional spike
    if (Math.random() > 0.98) {
      newLatency += 50 + Math.random() * 100;
    }

    // Normalize back to baseline slowly if spiked
    const baseline = link.history[0].value; 
    if (newLatency > baseline * 2) {
      newLatency = newLatency * 0.9;
    }

    let status: LatencyLink['status'] = 'optimal';
    if (newLatency > 120) status = 'moderate';
    if (newLatency > 250) status = 'critical';

    // Keep larger buffer
    const newHistory = [
      ...link.history,
      { timestamp: Date.now(), value: newLatency }
    ].slice(-HISTORY_BUFFER_SIZE); // Maintain buffer size

    return {
      ...link,
      latencyMs: newLatency,
      status,
      history: newHistory
    };
  });
};