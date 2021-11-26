let SidebarHeader = ({ title, subtitle }) => {
    return <div class="flex flex-none flex-col w-full h-auto p-3 space-y-3 border-b border-gray-300 dark:border-gray-800">
        <div class="text-lg text-gray-900 dark:text-white">{title}</div>
        <div class="text-md text-gray-900 dark:text-white">{subtitle}</div>
    </div>
}

export default SidebarHeader;