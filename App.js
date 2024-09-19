import React, { useState } from 'react';
import 'react-native-gesture-handler';
import Navigation from './Navigation'; 
import { CredentialsContext } from './components/LoginComponents/CredentialsContext'; 
import { TournamentContext } from './components/PredComponents/TournamentContext';


const App = () => {
  const [storedCredentials, setStoredCredentials] = useState(null);
  const [tournamentInfos, setTournamentInfos] = useState({
    tournamentName: '',
    teamIds: []
  });

  const updatetournamentInfos = (info) => {
      setTournamentInfos(prev => ({ ...prev, ...info }));
  };

  return (
    <CredentialsContext.Provider value={{ storedCredentials, setStoredCredentials }}>
      <TournamentContext.Provider value={{ tournamentInfos, updatetournamentInfos }}>
        <Navigation />
      </TournamentContext.Provider>
    </CredentialsContext.Provider>
  );
};

export default App;

