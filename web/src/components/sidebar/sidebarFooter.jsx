let SidebarFooter = ({ start, end }) => {
  return (
    <div class="flex flex-none justify-between items-center w-full h-auto p-3 border-t border-gray-300 dark:border-gray-800">
      <div class="text-gray-900 dark:text-white">{start}</div>
      <div class="text-gray-900 dark:text-white">{end}</div>
    </div>
  );
};

export default SidebarFooter;
