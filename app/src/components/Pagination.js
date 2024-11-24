const Pagination = ({ currentPage, setCurrentPage, totalPages }) => {
    return (
      <div className="flex justify-center mt-6">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg mx-2"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          {"<"}
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg mx-2 ${
              currentPage === index + 1 ? "bg-blue-100" : ""
            }`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg mx-2"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        >
          {">"}
        </button>
      </div>
    );
  };
  
  export default Pagination;
  