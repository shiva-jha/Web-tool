import React from 'react';
function RemoveDoubleQuotes({ value }) {
    const stringWithoutQuotes = value.replace(/"/g, '');
    return <>{stringWithoutQuotes}</>;
  }

  export default RemoveDoubleQuotes;