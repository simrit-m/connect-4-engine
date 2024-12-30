import React from 'react';

const Tile = ({ value, row, col, onTileClick }) => {
    const tileClass =
    value === 'Player' ? 'bg-red' : value === 'AI' ? 'bg-yellow' : 'bg-white'; // bg-white for empty tile

  return (
    <div
      className={`tile ${tileClass} rounded-circle m-1`}
      style={{
        width: '50px',
        height: '50px',
        cursor: 'pointer',
      }}
      onClick={() => onTileClick(col)}
    />
  );
};

export default Tile;
