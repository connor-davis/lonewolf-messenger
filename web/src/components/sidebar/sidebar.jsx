let Sidebar = ({ children }) => {
    return <div class="hidden md:flex flex-col w-96 lg:w-1/3 h-screen">
        {children}
    </div>
}

export default Sidebar;