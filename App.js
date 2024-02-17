import React, { useState } from 'react';
import 'react-native-gesture-handler';
import Navigation from './Navigation'; // Adjust the import path based on your project structure
import { CredentialsContext } from './components/LoginComponents/CredentialsContext'; // Adjust the import path based on your project structure

const App = () => {
  const [storedCredentials, setStoredCredentials] = useState(null);

  return (
    <CredentialsContext.Provider value={{ storedCredentials, setStoredCredentials }}>
      <Navigation />
    </CredentialsContext.Provider>
  );
};

export default App;

