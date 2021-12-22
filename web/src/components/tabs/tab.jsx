let Tab = ({ label, activeTab, onClick = () => {} }) => {
  return (
    <div
      class={`flex justify-center items-center w-full h-auto p-3 ${
        activeTab() === label
          ? 'border-b border-blue-600 transition-border duration-500 ease'
          : 'hover:bg-gray-300 border-b border-gray-100 lg:border-gray-300 dark:border-gray-700 lg:dark:border-gray-800 dark:hover:bg-gray-700 cursor-pointer'
      } `}
      onClick={() => activeTab() !== label && onClick()}
    >
      
      {label}
    </div>
  );
};

export default Tab;
