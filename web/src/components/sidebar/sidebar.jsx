let Sidebar = ({ children }) => {
    return <div class="hidden md:flex flex-col w-2/5 lg:w-1/4 flex-none h-screen">
        {children}
    </div>
}

export default Sidebar;