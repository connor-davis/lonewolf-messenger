let HeaderContent = ({ start, title, end, children }) => {
  return (
    <div class="flex flex-col space-y-2">
      <div class="flex border-b border-gray-200 dark:border-gray-700 justify-between items-center p-3">
        <div class="flex space-x-2 items-center">
          <div class="flex space-x-2">{start}</div>
          <div class="flex text-lg text-gray-900 dark:text-white">{title}</div>
        </div>
        <div class="flex space-x-2">{end}</div>
      </div>

      <div class="px-3 pb-3">{children}</div>
    </div>
  );
};

export default HeaderContent;
