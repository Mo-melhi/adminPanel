import { Search } from "lucide-react"

export default function SearchInput({ value, onChange, placeholder = "Search…", style }) {
  return (
    <div className="search" style={style}>
      <Search size={16} />
      <input
        className="input"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
    </div>
  )
}
