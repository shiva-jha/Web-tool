import React from 'react';

function formatHeader(key) {
  const words = key.split('_');
  const formattedHeader = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  return formattedHeader;
}


export default formatHeader;