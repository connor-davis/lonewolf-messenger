let Navbar = ({ children }) => {
  return (
    <div class="flex flex-col md:hidden">
      {children}
    </div>
  );
};

export default Navbar;
