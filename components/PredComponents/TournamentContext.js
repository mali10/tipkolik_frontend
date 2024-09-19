import { createContext } from 'react';

// Credential context
export const TournamentContext = createContext({ tournamentInfos: {}, updatetournamentInfos: () => {} });