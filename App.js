import React, { useState } from 'react';
import 'react-native-gesture-handler';
import Navigation from './Navigation'; 
import { CredentialsContext } from './components/LoginComponents/CredentialsContext'; 

const App = () => {
  const [storedCredentials, setStoredCredentials] = useState(null);

  return (
    <CredentialsContext.Provider value={{ storedCredentials, setStoredCredentials }}>
      <Navigation />
    </CredentialsContext.Provider>
  );
};

export default App;

