import React, { useEffect, useState, useContext } from 'react';
import { ScrollView, Text, View, ActivityIndicator, Alert} from 'react-native';

import { RAPID_API_URL , RAPID_API_KEY, RAPID_API_HOST , CURRENT_IP_R } from '@env';
import axios from 'axios';

import MatchPredictionLC from '../../../components/PredComponents/MatchLiveCompletedComponent';  

import { TournamentContext } from '../../../components/PredComponents/TournamentContext';

const LiveGamesScreen = () => {
  
  // SHOULD BE UPDATED
  
  const { tournamentInfos } = useContext(TournamentContext);
  const { tournamentName, teamIds} = tournamentInfos || { tournamentName: 't_name', teamIds: [0]};
  
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (teamIds.length > 0) {
      fetchGames(teamIds);
    }
  }, [teamIds]);

  const fetchGames = async (teamIds) => {
    const requests = teamIds.map(id => axios({
      method: 'GET',
      url: `${RAPID_API_URL}fixtures`,
      params: { 
        season: '2024', 
        team: id,
        from: '2024-06-14', 
        to: '2024-07-14',
      },
      headers: {
        'x-rapidapi-key': RAPID_API_KEY,
        'x-rapidapi-host': RAPID_API_HOST,
      }
    }));

    try {
      const responses = await Promise.all(requests);
      const allGames = responses.map(res => res.data.response).flat();
    
      const seenIds = new Set();
      const liveStatuses = ["1H", "HT", "2H", "ET", "P"];
      const liveGames = allGames.filter(game => {
        const isLive = liveStatuses.includes(game.fixture.status.short);
        const notSeen = !seenIds.has(game.fixture.id);
        if (isLive && notSeen) {
          seenIds.add(game.fixture.id);
          return true;
        }
        return false;
      });

      // Sort games by date
      liveGames.sort((a, b) => new Date(a.fixture.date) - new Date(b.fixture.date));

      setGames(liveGames.map(game => ({
        id: game.fixture.id,
        team1: {
          name: game.teams.home.name,
          logo: game.teams.home.logo,
          score: game.fixture.status.short === "HT" ? game.score.halftime.home :
                  game.fixture.status.short === "FT" ? game.score.fulltime.home :
                  game.fixture.status.short === "ET" ? game.score.extratime.home :
                  game.fixture.status.short === "P" ? game.score.penalty.home : "N/A"
        },
        team2: {
          name: game.teams.away.name,
          logo: game.teams.away.logo,
          score: game.fixture.status.short === "HT" ? game.score.halftime.away :
                  game.fixture.status.short === "FT" ? game.score.fulltime.away :
                  game.fixture.status.short === "ET" ? game.score.extratime.away :
                  game.fixture.status.short === "P" ? game.score.penalty.away : "N/A"
        },
        matchDate: game.fixture.date,
        matchMinute: game.fixture.status.elapsed,
        matchStatus: game.fixture.status.short
      })));

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch live games:', error);
      setLoading(false);
      Alert.alert("Error", "Failed to fetch live games: " + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView className="bg-white">
      <View>
        {games.length > 0 ? (
          games.map((game, index) => (
            <MatchPredictionLC
              key={index}
              team1={game.team1}
              team2={game.team2}
              scoreTeam1={game.team1.score}
              scoreTeam2={game.team2.score}
              matchMinute={game.matchMinute}
              matchStatus={game.matchStatus}
              matchDate={game.matchDate}
            />
          ))
        ) : (
          <Text className="text-center text-lg my-4">No live games right now.</Text>
        )}
        
        
      </View>
    </ScrollView>
  );
};

export default LiveGamesScreen;

