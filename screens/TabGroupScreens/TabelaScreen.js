import React from 'react';
import { SafeAreaView } from 'react-native';


const TabelaScreen = () => {
  const matches = [
    { id: 1, team1: { name: 'Team A' }, team2: { name: 'Team B' }, score1: 3, score2: 0 },
    { id: 2, team1: { name: 'Team C' }, team2: { name: 'Team D' }, score1: 2, score2: 1 }
  ];

  const predictions = [
    [
      { user: 'user1', score1: 2, score2: 0 },
      { user: 'user2', score1: 0, score2: 2 },
      { user: 'user3', score1: 0, score2: 2 },
      { user: 'user4', score1: 0, score2: 2 }
    ],
    [
      { user: 'user1', score1: 1, score2: 0 },
      { user: 'user2', score1: 0, score2: 3 },
      { user: 'user3', score1: 0, score2: 3 },
      { user: 'user4', score1: 0, score2: 3 }
    ]
  ];

  return (
    <SafeAreaView className="flex-1">
      
    </SafeAreaView>
  );
};

export default TabelaScreen;
