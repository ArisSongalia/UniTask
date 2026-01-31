import { collection, limit, query, where, getDocs } from "firebase/firestore"; 
import Icon from "./Icon";
import { db } from "../config/firebase";
import { useEffect, useState } from "react";


function SearchBar({ onResultClick }) {
  const [searchTerm, setSearchterm] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (searchTerm.length < 2) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    const delayBouncingFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const q = query(
          collection(db, "search_index"), 
          where("searchTitle", ">=", searchTerm.toLowerCase()),
          where("searchTitle", "<=", searchTerm.toLowerCase() + "\uf8ff"),
          limit(5)
        );

        const querySnapshot = await getDocs(q);
        const searchItems = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setResults(searchItems);
        setHasSearched(true); 
      } catch (error) {
        console.error("Search Error:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayBouncingFn);
  }, [searchTerm]);

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <input 
          type="text" 
          placeholder="Search projects, notes, and tasks"
          className="w-full pl-10 pr-4 py-2 border rounded-full focus:ring-2 focus:ring-green-500 outline-none bg-green-50 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchterm(e.target.value)}
        />
        <span className="absolute left-2 top-1">
          <Icon dataFeather="search" className="text-gray-500"/>
        </span>
      </div>

      {/* Results Dropdown */}
      {(results.length > 0 || (hasSearched && !isSearching && searchTerm.length >= 2)) && (
        <ul className="absolute z-50 w-full mt-2 bg-white border rounded-xl shadow-lg overflow-hidden">
          {results.length > 0 ? (
            results.map((item) => (
              <li
                key={item.id}
                onClick={() => {
                  if (onResultClick) onResultClick(item);
                  setSearchterm("");
                  setResults([]);
                }}
                className="px-4 py-3 hover:bg-green-50 cursor-pointer border-b last:border-none flex justify-between items-center transition-colors"
              >
                <div className="flex flex-col overflow-hidden">
                  <p className="font-medium text-gray-800 text-sm truncate">{item.title}</p>
                  <p className="text-xs text-gray-500 truncate italic">
                    {item.description || "No description"}
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-1 bg-gray-100 rounded text-gray-500 ml-2">
                  {item.category} 
                </span>
              </li>
            ))
          ) : (
            <li className="px-4 py-6 text-center">
              <p className="text-sm text-gray-500">No results found for "{searchTerm}"</p>
              <p className="text-xs text-gray-400 mt-1">Try a different keyword</p>
            </li>
          )}
        </ul>
      )}

      {isSearching && (
        <div className="absolute right-4 top-2.5">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
        </div>
      )}
    </div>
  );
}

export default SearchBar;