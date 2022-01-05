import 'https://cdn.jsdelivr.net/npm/ipfs-core/dist/index.min.js';

const Ipfs = window.IpfsCore;

let initializeIpfs = async (window, initialized = () => {}) => {
  let instance = await Ipfs.create({
    EXPERIMENTAL: {
      pubsub: true,
    },
  });

  console.log('Initialized IPFS');

  const status = instance.isOnline() ? 'online' : 'offline';

  console.log('Node status: ' + status);

  window.status = status;

  window.ipfs = instance;
  window.pubsub = instance.pubsub;

  initialized();
};

export { initializeIpfs };
