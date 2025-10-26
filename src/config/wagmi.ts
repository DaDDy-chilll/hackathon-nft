import { http, createConfig, fallback } from 'wagmi';
import { polygon, polygonAmoy } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const config = createConfig({
  chains: [polygon, polygonAmoy],
  connectors: [
    injected(),
  ],
  transports: {
    [polygon.id]: http(),
    [polygonAmoy.id]: fallback([
      http('https://rpc-amoy.polygon.technology'),
      http('https://polygon-amoy.g.alchemy.com/v2/demo'),
      http('https://polygon-amoy-bor-rpc.publicnode.com'),
      http(), // Default provider as last fallback
    ]),
  },
});
