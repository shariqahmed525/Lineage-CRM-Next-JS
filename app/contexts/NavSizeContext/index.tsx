import { useState, useContext, createContext } from 'react';


const NavSizeContext = createContext({
  navSize: 'large',
  setNavSize: (size: 'small' | 'large') => {},
});

export const NavSizeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [navSize, changeNavSize] = useState('large');
  const setNavSize = (size: 'small' | 'large') => {
    changeNavSize(size);
  };

  return (
    <NavSizeContext.Provider value={{ navSize, setNavSize }}>
      {children}
    </NavSizeContext.Provider>
  );
};

export const useNavSizeContext = () => {
  const context = useContext(NavSizeContext);
  if (context === undefined) {
    throw new Error('NavSizeContext must be used within a NavSizeProvider');
  }
  return context;
};
