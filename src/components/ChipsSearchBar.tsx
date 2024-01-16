import React, { useState, useRef, useEffect } from 'react';
import './ChipsSearchBar.css';

const ChipsSearchBar: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [chips, setChips] = useState<string[]>([]);
  const [filteredItems, setFilteredItems] = useState<string[]>([]);
  const [highlightedChip, setHighlightedChip] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const items = ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setFilteredItems(items.filter(item => item.toLowerCase().includes(value.toLowerCase())));
  };

  const handleItemClick = (item: string) => {
    if (!chips.includes(item)) {
      setChips([...chips, item]);
    }
    setInputValue('');
    setFilteredItems(items.filter(filteredItem => !chips.includes(filteredItem)));
  };

  const handleChipDelete = (chipIndex: number) => {
    const newChips = chips.filter((_, index) => index !== chipIndex);
    setChips(newChips);
    setFilteredItems(items.filter(filteredItem => !newChips.includes(filteredItem)));
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && inputValue === '' && chips.length > 0) {
      setHighlightedChip(chips.length - 1);
    } else if (e.key === 'Backspace' && inputValue === '' && highlightedChip !== null) {
      const newChips = chips.filter((_, index) => index !== highlightedChip);
      setChips(newChips);
      setHighlightedChip(null);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Backspace' && inputValue === '' && chips.length > 0) {
        setHighlightedChip(chips.length - 1);
      } else if (e.key === 'Backspace' && inputValue === '' && highlightedChip !== null) {
        const newChips = chips.filter((_, index) => index !== highlightedChip);
        setChips(newChips);
        setHighlightedChip(null);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [inputValue, chips, highlightedChip]);

  useEffect(() => {
    if (highlightedChip !== null) {
      inputRef.current?.blur();
    }
  }, [highlightedChip]);

  useEffect(() => {
    setFilteredItems(items.filter(item => !chips.includes(item)));
  }, [chips]);

  return (
    <div className="chip-search-bar">
      <div className="chips">
        {chips.map((chip, index) => (
          <div
            key={index}
            className={`chip ${highlightedChip === index ? 'highlighted' : ''}`}
            onClick={() => setHighlightedChip(index)}
          >
            {chip}
            <button onClick={() => handleChipDelete(index)}>X</button>
          </div>
        ))}
      </div>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        placeholder="Type to search..."
      />
      <ul className="item-list">
        {filteredItems.map((item, index) => (
          <li key={index} onClick={() => handleItemClick(item)}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChipsSearchBar;
