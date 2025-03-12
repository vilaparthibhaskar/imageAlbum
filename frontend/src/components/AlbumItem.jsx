import React from 'react';
import '../styles/AlbumItems.css';

const AlbumItem = ({ album, onSelect }) => {
  return (
    <div className="album-item" onClick={() => onSelect(album)}>
      <img src={album.cover} alt={album.title} className="album-cover" />
      <div className="album-title">{album.title}</div>
    </div>
  );
};

export default AlbumItem;
