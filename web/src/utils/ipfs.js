import 'https://cdn.jsdelivr.net/npm/ipfs/dist/index.min.js';

const Ipfs = window.Ipfs;

(async (window) => {
  let instance = await Ipfs.create({
    repo: '/lonewolf-database/ipfs',
    start: true,
    preload: {
      enabled: false,
    },
    EXPERIMENTAL: {
      pubsub: true,
    },
    config: {
      Addresses: {
        Swarm: [
          // Use IPFS dev signal server
          // '/dns4/star-signal.cloud.ipfs.team/wss/p2p-webrtc-star',
          // '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
          // Use IPFS dev webrtc signal server
          '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
          '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
          '/dns4/webrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star/',
          // Use local signal server
          // '/ip4/0.0.0.0/tcp/9090/wss/p2p-webrtc-star',
        ],
      },
    },
  });

  console.log('Initialized IPFS');

  const status = instance.isOnline() ? 'online' : 'offline';

  console.log('Node status: ' + status);

  window.ipfs = instance;
})(window);
