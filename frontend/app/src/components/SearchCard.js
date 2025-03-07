import { truncateText } from "../services/utilServices";

const SearchCard = ({ image, description, price, poster, onClick }) => {
  return (
    <div
      className="flex items-center bg-white shadow-lg rounded-lg p-4 cursor-pointer"
      onClick={onClick}
    >
      <div className="w-32 h-32 bg-gray-300 flex items-center justify-center text-gray-600 font-semibold rounded-lg overflow-hidden">
        <img
          src={image}
          alt="Room"
          className="object-cover w-full h-full"
        />
      </div>

      <div className="ml-4">
        <p className="text-md font-semibold text-gray-700">
          {truncateText(description, window.innerWidth >= 1024 ? 30 : 15)}
        </p>
        <p className="text-green-600 text-md font-bold">{price} €</p>
        {/* <p className="text-gray-500 text-sm">Posted by: {poster}</p> */}
      </div>
    </div>
  );
};

export default SearchCard;