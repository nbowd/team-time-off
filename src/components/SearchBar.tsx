import "@/components/SearchBar.css"
import { useState } from 'react'
import searchIcon from "@/assets/icons/icons8-search-50.png";
import { Request } from '@/types';

interface SearchBarProps {
  requests: Request[] | [],
  buildRows: Function,
}

function SearchBar({ requests, buildRows}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleRequestSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value === '') {
      buildRows(requests);
      return
    }
    const filteredRequests = requests!.filter(req => req.full_name?.toLowerCase().includes(e.target.value.toLowerCase()))
    buildRows(filteredRequests);
  }
  
  return (
    <div className="search-bar">
      <img src={searchIcon} alt="search-icon" />
      <input type="search" value={searchQuery} onChange={handleRequestSearch} />
    </div>
  )
}

export default SearchBar