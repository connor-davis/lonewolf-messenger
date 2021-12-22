let AddFriendButton = ({
  color = 'blue',
  textColor = 'white',
  shadow = '',
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
          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
        />
      </svg>
    </div>
  );
};

export default AddFriendButton;
