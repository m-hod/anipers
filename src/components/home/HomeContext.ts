import React from 'react';

const HomeContext = React.createContext<{ imageUrls: string[] }>({
  imageUrls: [''],
});

export default HomeContext;
