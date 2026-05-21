import { useState } from "react";
import "./SearchBar.scss";

interface SearchBarProps {
  onSearch: (query: string) => void;
  loading?: boolean;
}

const SearchBar = ({ onSearch, loading = false }: SearchBarProps) => {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (input.trim()) {
        onSearch(input.trim());
    }
};

const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter")
        handleSubmit();

};

return (
    <div className="searchbar">
        <input
            type="text"
            className="searchbar__input"
            placeholder="Search for a film..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
        />
        <button
        className="searchbar__bar btn-primary"
        onClick={handleSubmit}
        disabled={loading}
        >
        {loading ? "Loading..." :"Search"}
        </button>

        </div>
);
};
export default SearchBar;
