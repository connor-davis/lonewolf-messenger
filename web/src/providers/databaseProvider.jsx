import { createSignal, onMount } from 'solid-js';
import { initializeOrbit } from '../utils/orbitdb';

let DatabaseProvider = ({ setIsLoading, setLoadingMessage, children }) => {
  let [instanceReady, setInstanceReady] = createSignal(true);

  onMount(() => {
    setTimeout(() => {
      (async () => {
        setIsLoading(true);
        setLoadingMessage('Initializing database.');

        await initializeOrbit();

        if (orbitdb && ipfsInstance) {
          setIsLoading(false);
          setInstanceReady(true);
        }

        globalThis.ipfs = ipfsInstance;
        globalThis.orbitdb = orbitdb;
      })();
    }, 100);
  });

  return <>{instanceReady() && children}</>;
};

export default DatabaseProvider;
