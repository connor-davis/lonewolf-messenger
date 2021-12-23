let ChatButton = ({
  color = 'blue',
  textColor = 'white',
  onClick = () => {},
}) => {
  return (
    <div
      class={`flex justify-center items-center cursor-pointer bg-${color}-600 text-${textColor} rounded-full p-3`}
      onClick={() => onClick()}
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
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    </div>
  );
};

export default ChatButton;
