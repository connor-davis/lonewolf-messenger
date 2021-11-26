let ErrorNotification = ({ header, text, footer }) => {
  return (
    <div class="flex flex-col w-auto max-w-md h-auto p-2 bg-red-600 text-white rounded">
      <div class="flex justify-between items-center">
        <div>{header}</div>
        <div class="cursor-pointer">Close</div>
      </div>

      <div class="text-left break-words">{text}</div>

      <div class="flex">{footer}</div>
    </div>
  );
};

export default ErrorNotification;
