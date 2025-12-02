import { CloudProvider, GeoNode, NodeType } from '@/types';

export const NODES: GeoNode[] = [
  {
    id: 'binance-jp',
    name: 'Binance',
    lat: 35.6895,
    lng: 139.6917,
    provider: CloudProvider.AWS,
    type: NodeType.EXCHANGE,
    regionCode: 'ap-northeast-1',
    status: 'operational',
    endpoint: 'https://api.binance.com/api/v3/ping'
  },
  {
    id: 'deribit-ldn',
    name: 'Deribit',
    lat: 51.5074,
    lng: -0.1278,
    provider: CloudProvider.PRIVATE,
    type: NodeType.EXCHANGE,
    regionCode: 'ld4',
    status: 'operational',
    endpoint: 'https://www.deribit.com/api/v2/public/test'
  },
  {
    id: 'okx-hk',
    name: 'OKX',
    lat: 22.3193,
    lng: 114.1694,
    provider: CloudProvider.GCP,
    type: NodeType.EXCHANGE,
    regionCode: 'asia-east2',
    status: 'operational',
    endpoint: 'https://www.okx.com/api/v5/public/status'
  },
  {
    id: 'coinbase-us',
    name: 'Coinbase',
    lat: 39.0438,
    lng: -77.4874,
    provider: CloudProvider.AWS,
    type: NodeType.EXCHANGE,
    regionCode: 'us-east-1',
    status: 'operational',
    endpoint: 'https://api.coinbase.com/v2/time'
  },
  {
    id: 'kraken-eu',
    name: 'Kraken',
    lat: 50.1109,
    lng: 8.6821,
    provider: CloudProvider.GCP,
    type: NodeType.EXCHANGE,
    regionCode: 'europe-west3',
    status: 'operational',
    endpoint: 'https://api.kraken.com/0/public/Time'
  },
  {
    id: 'aws-us-east-1',
    name: 'AWS N. Virginia',
    lat: 38.13,
    lng: -78.45,
    provider: CloudProvider.AWS,
    type: NodeType.REGION,
    regionCode: 'us-east-1',
    status: 'operational',
    endpoint: 'https://dynamodb.us-east-1.amazonaws.com'
  },
  {
    id: 'aws-eu-central-1',
    name: 'AWS Frankfurt',
    lat: 50.11,
    lng: 8.68,
    provider: CloudProvider.AWS,
    type: NodeType.REGION,
    regionCode: 'eu-central-1',
    status: 'operational',
    endpoint: 'https://dynamodb.eu-central-1.amazonaws.com'
  },
  {
    id: 'gcp-asia-northeast1',
    name: 'GCP Tokyo',
    lat: 35.68,
    lng: 139.77,
    provider: CloudProvider.GCP,
    type: NodeType.REGION,
    regionCode: 'asia-northeast1',
    status: 'operational',
    endpoint: 'https://storage.googleapis.com'
  },
  {
    id: 'azure-sg',
    name: 'Azure Singapore',
    lat: 1.3521,
    lng: 103.8198,
    provider: CloudProvider.AZURE,
    type: NodeType.REGION,
    regionCode: 'southeastasia',
    status: 'operational',
    endpoint: 'https://azure.microsoft.com'
  },
  {
    id: 'azure-brazil',
    name: 'Azure Brazil South',
    lat: -23.5505,
    lng: -46.6333,
    provider: CloudProvider.AZURE,
    type: NodeType.REGION,
    regionCode: 'brazilsouth',
    status: 'degraded',
    endpoint: 'https://azure.microsoft.com'
  }
];

export const PROVIDER_COLORS: Record<CloudProvider, string> = {
  [CloudProvider.AWS]: '#FF9900', // AWS Orange
  [CloudProvider.GCP]: '#4285F4', // Google Blue
  [CloudProvider.AZURE]: '#0078D4', // Azure Blue
  [CloudProvider.PRIVATE]: '#10B981' // Emerald Green
};

export const GLOBE_IMAGE_URL = '//unpkg.com/three-globe/example/img/earth-night.jpg';
export const BACKGROUND_IMAGE_URL = '//unpkg.com/three-globe/example/img/night-sky.png';