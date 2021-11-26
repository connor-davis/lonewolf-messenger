let LoadingProvider = ({ message, busy, children }) => {
  return (
    <div class="w-screen h-screen">
      {!busy() && children}

      {busy() && (
        <div class="flex flex-col justify-center items-center w-full h-full text-white bg-gray-900 space-y-3">
          <div
            style="border-top-color:transparent"
            class="w-6 h-6 border-4 border-green-400 border-dotted rounded-full animate-spin"
          ></div>
          <div>{message}</div>
        </div>
      )}
    </div>
  );
};

export default LoadingProvider;