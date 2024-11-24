const Navbar = () => {
    return (
      <nav className="flex justify-between items-center bg-white px-8 py-5 shadow-md">
        <h1 className="text-3xl font-bold">Fulda Student Hub</h1>
        <div className="flex space-x-8 text-gray-600 text-lg">
          <a href="/" className="hover:text-blue-600 transition duration-200">Home</a>
          <a href="#" className="hover:text-blue-600 transition duration-200">Favorite</a>
          <a href="#" className="hover:text-blue-600 transition duration-200">Profile</a>
          <a href="#" className="hover:text-blue-600 transition duration-200">Logout</a>
        </div>
      </nav>
    );
  };
  
  export default Navbar;
  