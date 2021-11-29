import { createSignal } from 'solid-js';
import Tab from './tab';

let Tabs = ({ tabs }) => {
  let [activeTab, setActiveTab] = createSignal('Chats');

  return (
    <div class="flex flex-col w-full h-full">
      <div class="flex items-center">
        {tabs.map((tab) => {
          return (
            <Tab
              activeTab={activeTab}
              key={tab.label}
              label={tab.label}
              onClick={() => setActiveTab(tab.label)}
            />
          );
        })}
      </div>

      <div class="w-full h-full overflow-hidden">
        {tabs.map(({ label, content }) => {
          if (label !== activeTab()) return undefined;
          else return content;
        })}
      </div>
    </div>
  );
};

export default Tabs;
