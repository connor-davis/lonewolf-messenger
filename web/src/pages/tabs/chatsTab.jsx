import AddChatButton from '../../components/buttons/addChat';
import FloatingButtonBottomRight from '../../components/buttons/floating';

let ChatsTabPage = () => {
  return (
    <div class="relative flex flex-col w-full h-full p-2 overflow-y-auto overflow-x-hidden space-y-2">
      <div class="flex items-center p-2 transition-radius duration-100 ease hover:bg-gray-200 dark:hover:bg-gray-700 hover:rounded-md cursor-pointer border-b border-gray-200 dark:border-gray-800">
        <div class="flex w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 cursor-pointer"></div>
      </div>

      <FloatingButtonBottomRight content={<AddChatButton />} />
    </div>
  );
};

export default ChatsTabPage;
