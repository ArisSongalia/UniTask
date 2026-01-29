import { query } from "firebase/firestore";
import Icon from "./Icon"

function SearchBar() {
  const search = async (searchText) => {
    if (!searchText) return [];
    
    const q = query (
      collection(db, '')
    )
  }
  return (
    <div className="flex items-center w-full h-10 bg-green-50 rounded-full px-3 hover:bg-green-100 mx-2 max-w-[40rem]">
      
      <input
        type="text"
        placeholder="Search"
        value={query}
        className="flex-1 bg-transparent outline-none text-sm text-green-900 font-semibold mx-1"
      />

      <Icon dataFeather="search" className="font-bold"/>  
    </div>
  );
}


export default SearchBar;