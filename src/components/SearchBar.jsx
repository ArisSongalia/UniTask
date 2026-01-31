import { collection, limit, query, where, getDocs } from "firebase/firestore"; 
import Icon, {IconAction} from "./Icon";
import { db } from "../config/firebase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function SearchBar({ onResultClick }) {
  const [searchTerm, setSearchterm] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    if (searchTerm.length < 2) {
      setResults([]);
      setHasSearched(false);
      setIsResultOpen(false);
      return;
    }

    const delayBouncingFn = setTimeout(async () => {
      setIsSearching(true);
      setIsResultOpen(true);
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
        setIsResultOpen(true);
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
        onFocus={() => searchTerm.length >= 2 && setIsResultOpen(true)}
      />
      <span className="absolute left-2 top-1">
        <Icon dataFeather="search" className="text-gray-500"/>
      </span>
    </div>

    {isResultOpen && searchTerm.length >= 2 && (
      <ul className="absolute z-50 w-full mt-2 bg-white border rounded-xl shadow-lg overflow-hidden">
        
        {isSearching && results.length === 0 ? (
          <li className="px-4 py-6 text-center text-sm text-gray-400 italic">
            Searching...
          </li>
        ) : results.length > 0 ? (
          
          results.map((item) => (
            <li
              key={item.id}
              onClick={() => {
                if (onResultClick) onResultClick(item);
                setSearchterm("");
                setResults([]);
                setHasSearched(false);
                setIsResultOpen(false);  
                navigate(item.path)
              }}
              className="px-4 py-3 hover:bg-green-50 cursor-pointer border-b last:border-none flex justify-between items-center transition-colors"
            >
              <div className="flex flex-col overflow-hidden">
                <p className="font-medium text-gray-800 text-sm truncate">{item.title}</p>
                <p className="text-xs text-gray-500 truncate italic">
                  {item.description}
                </p>
              </div>
              <span className="text-[10px] font-bold uppercase px-2 py-1 bg-gray-100 rounded text-gray-500 ml-2">
                {item.category} 
              </span>
            </li>
          ))
        ) : hasSearched && !isSearching ? (
          <li 
            className="px-4 py-6 text-center"
          >
            <p className="text-sm text-gray-500">No results found for "{searchTerm}"</p>
            <p className="text-xs text-gray-400 mt-1">Try a different keyword</p>
          </li>
        ) : null}
      </ul>
    )}

    {isSearching ? (
      <div className="absolute right-1.5 top-2">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
      </div>
    ) : (searchTerm.length > 0 && (
      <div className="absolute right-1.5 top-1.5">
        <IconAction dataFeather="x" iconOnClick={() => {
          setSearchterm("");
          setHasSearched(false);
          setResults(false);
          setIsResultOpen(false);
        }}/>
      </div>
    ))}
  </div>
);
}

export default SearchBar;