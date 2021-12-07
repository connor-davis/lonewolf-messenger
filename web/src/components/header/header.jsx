
let Header = ({ start, title, end }) => {
  return (
    <div class="flex justify-between items-center p-3 flex-none">
      <div class="flex space-x-2 items-center">
        <div class="flex space-x-2">{start}</div>
        <div class="flex text-lg text-gray-900 dark:text-white">{title}</div>
      </div>
      <div class="flex space-x-2">{end}</div>
    </div>
  );
};

export default Header;
