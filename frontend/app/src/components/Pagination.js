const Pagination = ({ currentPage, setCurrentPage, totalPages }) => {

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Move screen to top with smooth scrolling
  };

  return (
    <div className="flex justify-center mt-6">
      {/* Previous Button */}
      <button
        className={`px-4 py-2 mx-1 rounded-lg shadow-md transition duration-200 ${
          currentPage === 1
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
        onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
      >
        {"<"}
      </button>

      {/* Pagination Buttons */}
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          className={`px-4 py-2 mx-1 rounded-lg shadow-md transition duration-200 ${
            currentPage === index + 1
              ? "bg-blue-600 text-white font-semibold cursor-default"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
          onClick={() => handlePageChange(index + 1)}
          disabled={currentPage === index + 1} // Disable the button for the current page
        >
          {index + 1}
        </button>
      ))}

      {/* Next Button */}
      <button
        className={`px-4 py-2 mx-1 rounded-lg shadow-md transition duration-200 ${
          currentPage === totalPages
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
        onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        {">"}
      </button>
    </div>
  );
};

export default Pagination;
