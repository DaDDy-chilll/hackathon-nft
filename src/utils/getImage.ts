const gateways = [
  "https://ipfs.io/ipfs/",
  "https://cloudflare-ipfs.com/ipfs/",
  "https://gateway.pinata.cloud/ipfs/",
  "https://dweb.link/ipfs/",
];

function resolveIPFS(url: string): string {
  if (!url.startsWith("ipfs://")) return url;
  const cid = url.replace("ipfs://", "");
  // Randomly pick a gateway to spread load
  const gateway = gateways[Math.floor(Math.random() * gateways.length)];
  return `${gateway}${cid}`;
}

export default resolveIPFS;
