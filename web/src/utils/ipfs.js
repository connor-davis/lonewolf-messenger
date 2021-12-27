import 'https://cdn.jsdelivr.net/npm/ipfs/dist/index.min.js';
import { v4 } from 'uuid';

const Ipfs = window.Ipfs;

const bootstraps = [
  '/dns6/ipfs.thedisco.zone/tcp/4430/wss/p2p/12D3KooWChhhfGdB9GJy1GbhghAAKCUR99oCymMEVS4eUcEy67nt',
  '/dns4/ipfs.thedisco.zone/tcp/4430/wss/p2p/12D3KooWChhhfGdB9GJy1GbhghAAKCUR99oCymMEVS4eUcEy67nt',
];
const prefix = 'lonewolf-';
var lastAlive = 0; // last keep-alive we saw from a relay
var lastPeer = 0; // last keep-alive we saw from another peer
var lastBootstrap = 0; // used for tracking when we last attempted to bootstrap (likely to reconnect to a relay)
var ipfs;
var peerCount = 0; // this is kind of a janky way to track peer count. really it'd be better to store the peers
// in a map, along with their last "peer-alive", to track peer count in a stable way.
var now;
var i;
var me;
var peer;
var peers;

let initializeIpfs = async (window, initialized = () => {}) => {
  let instance = await Ipfs.create({
    repo: '/lonewolf-database/ipfs/' + v4(),

    start: true,
    preload: {
      enabled: false,
    },
    EXPERIMENTAL: {
      pubsub: true,
    },
    relay: {
      enabled: true,
      hop: {
        enabled: true,
      },
    },
    config: {
      Addresses: {
        Swarm: [
          // Use IPFS dev signal server
          // '/dns4/star-signal.cloud.ipfs.team/wss/p2p-webrtc-star',
          // '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
          // Use IPFS dev webrtc signal server
          '/dns4/star.thedisco.zone/tcp/9090/wss/p2p-webrtc-star',
          '/dns6/star.thedisco.zone/tcp/9090/wss/p2p-webrtc-star',
          // Use local signal server
          // '/ip4/0.0.0.0/tcp/9090/wss/p2p-webrtc-star',
        ],
      },
    },
  });

  console.log('Initialized IPFS');

  const status = instance.isOnline() ? 'online' : 'offline';

  console.log('Node status: ' + status);

  window.status = status;

  // usage: await sendmsg("Hello", "example_channel");
  async function sendmsg(msg, chan) {
    await instance.pubsub.publish(prefix + chan, msg);
  }

  // usage: await joinchan("example_channel");
  async function joinchan(chan) {
    await instance.pubsub.subscribe(prefix + chan, () => {});
  }

  // check if we're still connected to the circuit relay (not required, but let's us know if we can see peers who may be stuck behind NAT)
  function checkalive() {
    now = new Date().getTime();
    if (now - lastAlive >= 50000) {
      if (now - lastPeer >= 50000) {
        window.swarmConnectivity = 'bad';
      } else {
        window.swarmConnectivity = 'good';
      }
      dobootstrap(true); // sometimes we appear to be connected to the bootstrap nodes, but we're not, so let's try to reconnect
    } else {
      window.swarmConnectivity = 'excellent';
    }
  }

  // processes a circuit-relay announce over pubsub
  async function processAnnounce(addr) {
    // get our peerid
    me = await instance.id();
    me = me.id;

    // not really an announcement if it's from us
    if (addr.from == me) {
      return;
    }

    // process the recieved address
    addr = new TextDecoder().decode(addr.data);

    if (addr == 'peer-alive') {
      peerCount += 1;
      setTimeout(function () {
        peerCount -= 1;
      }, 15000);

      lastPeer = new Date().getTime();
      return;
    }

    // keep-alives are also sent over here, so let's update that global first
    lastAlive = new Date().getTime();

    if (addr == 'keep-alive') {
      console.log(addr);
      return;
    }
    peer = addr.split('/')[9];
    console.log('Peer: ' + peer);
    console.log('Me: ' + me);
    if (peer == me) {
      return;
    }

    // get a list of peers
    peers = await instance.swarm.peers();
    for (i in peers) {
      // if we're already connected to the peer, don't bother doing a circuit connection
      if (peers[i].peer == peer) {
        return;
      }
    }
    // log the address to console as we're about to attempt a connection
    console.log(addr);

    // connection almost always fails the first time, but almost always succeeds the second time, so we do this:
    try {
      await instance.swarm.connect(addr);
    } catch (err) {
      console.log(err);
      await instance.swarm.connect(addr);
    }
  }

  // if reconnect is true, it'll first attempt to disconnect from the bootstrap nodes
  async function dobootstrap(reconnect) {
    now = new Date().getTime();
    if (now - lastBootstrap < 60000) {
      // don't try to bootstrap again if we just tried within the last 60 seconds
      return;
    }
    lastBootstrap = now;
    for (i in bootstraps) {
      if (reconnect) {
        try {
          await instance.swarm.disconnect(bootstraps[i]);
        } catch (e) {
          console.log(e);
        }
      } else {
        await instance.bootstrap.add(bootstraps[i]);
      }
      await instance.swarm.connect(bootstraps[i]);
    }
  }

  await dobootstrap(true);

  // join a global channel, because we don't have real chat channels implemented yet
  joinchan('global');

  // publish and subscribe to keepalive to help keep the sockets open
  await instance.pubsub.subscribe(prefix + 'keepalive');

  setInterval(function () {
    sendmsg('1', prefix + 'keepalive');
  }, 4000);

  setInterval(checkalive, 2000);

  // process announcements over the relay network, and publish our own keep-alives to keep the channel alive
  await instance.pubsub.subscribe('announce-circuit', processAnnounce);

  setInterval(function () {
    instance.pubsub.publish('announce-circuit', 'peer-alive');
  }, 15000);

  window.ipfs = instance;
  window.pubsub = instance.pubsub;

  initialized();
};

export { initializeIpfs };
