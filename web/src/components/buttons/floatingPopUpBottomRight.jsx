import { createSignal } from 'solid-js';

let FloatingPopUpBottomRight = ({
  main,
  children,
  color = 'blue',
  textColor = 'white',
}) => {
  let [popUp, setPopUp] = createSignal(false);

  return (
    <div class="absolute flex flex-col justify-center items-center p-3 w-auto h-auto right-0 bottom-0 transition-height duration-500 ease">
      {popUp() && (
        <div
          class="flex flex-col space-y-2 mb-2"
          onClick={() => setPopUp(!popUp())}
        >
          {children}
        </div>
      )}

      {popUp() ? (
        <div
          class={`flex justify-center items-center cursor-pointer bg-${color}-600 text-${textColor} rounded-full p-3`}
          onClick={() => setPopUp(!popUp())}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
      ) : (
        <div onClick={() => setPopUp(!popUp())}>{main}</div>
      )}
    </div>
  );
};

export default FloatingPopUpBottomRight;
