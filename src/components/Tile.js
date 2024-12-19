import React from 'react';

const Tile = ({ value, row, col, onTileClick }) => {
  return (
    <div
      className={`tile ${value ? value : 'empty'}`}
      style={{
        width: '50px',
        height: '50px',
        border: '1px solid black',
        backgroundColor: value === 'Player' ? 'red' : value === 'AI' ? 'yellow' : 'lightgray',
      }}
      onClick={() => onTileClick(col)} // Call the passed function on click
    >
      {/* Render tile color based on value */}
    </div>
  );
};

export default Tile;
