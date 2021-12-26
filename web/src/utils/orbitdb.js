
const OrbitDB = window.OrbitDB;

let initializeOrbit = async () => {
  let orbitdb = await OrbitDB.createInstance(window.ipfs);

  console.log('Initialized OrbitDB');

  window.orbitdb = orbitdb;

  return orbitdb;
};

export { initializeOrbit };
