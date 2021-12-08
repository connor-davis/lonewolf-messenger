let Content = ({ children }) => {
  return (
    <div class="flex flex-col w-full h-full bg-white dark:bg-gray-800 rounded-t-lg md:rounded-t-none md:rounded-tl-lg overflow-y-hidden">
      {children}
    </div>
  );
};

export default Content;
