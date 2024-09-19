
import React, { useEffect, useState, useContext } from 'react';
import { ScrollView, Text, View, ActivityIndicator, Alert} from 'react-native';

import { RAPID_API_URL , RAPID_API_KEY, RAPID_API_HOST , CURRENT_IP_R } from '@env';
import axios from 'axios';

import MatchPredictionLC from '../../../components/PredComponents/MatchLiveCompletedComponent';  

import { TournamentContext } from '../../../components/PredComponents/TournamentContext';

const CompletedGamesScreen = () => {

  const { tournamentInfos } = useContext(TournamentContext);
  const { tournamentName, teams, leagues , rounds} = tournamentInfos || { tournamentName: 't_name', teams: [0] };
  // console.log("Teams:", teams);
  // console.log("Leagues:", leagues);
  // console.log("Rounds:", rounds);
  const [leagueGames, setLeagueGames] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // console.log("Teams:", teams);
    // console.log("Leagues:", leagues);
    // console.log("Rounds:", rounds);

    const fetchGames = async () => {
    
      const requests = teams.flatMap(team =>
          team.leagueIds.map(leagueId =>
              axios({
                  method: 'GET',
                  url: `${RAPID_API_URL}fixtures`,
                  params: {
                      season: '2024',
                      team: team.teamId,
                      league: leagueId,
                      //round: rounds[leagueId],
                      //status: "FT",
                      last: 1 , // fix this.
                  },
                  headers: {
                      'x-rapidapi-key': RAPID_API_KEY,
                      'x-rapidapi-host': RAPID_API_HOST,
                  }
                })
              )
          );
  
          try {
        
            const responses = await Promise.all(requests);
            const allGames = responses.map(res => res.data.response).flat();
      
            const leagueGameMap = allGames.reduce((acc, game) => {
              const leagueId = game.league.id;
              acc[leagueId] = acc[leagueId] || [];
              acc[leagueId].push(game);
              return acc;
            }, {});
      
            // Sort leagues by the number of games
            const sortedLeagues = Object.entries(leagueGameMap).sort((a, b) => b[1].length - a[1].length);
            // Convert array back to object
            setLeagueGames(Object.fromEntries(sortedLeagues));
      
          } catch (error) {
            console.error('Failed to fetch games:', error);
            Alert.alert("Error", "Failed to fetch games: " + (error.response?.data?.message || error.message));
          } finally {
            setLoading(false); 
          }
    };

    // console.log("Teams:", teams);
    // console.log("Leagues:", leagues);
    // console.log("Rounds:", rounds);

    if (teams && teams.length > 0 && leagues.length > 0) {
      fetchGames();
    } else {
        setLoading(false);
        console.log("Waiting for teams and leagues to be populated");
    }
  
  }, [teams, leagues, rounds]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView className="bg-white">
      {leagues.map(league => {
        const games = leagueGames[league.leagueId] || []; // Access games or use an empty array if none exist
        const roundNumber = rounds[league.leagueId] ? rounds[league.leagueId].match(/\d+/)[0] : 'Unknown'; // Extracts the round number

        return (
            <View key={league.leagueId} className="p-3">
                <Text className="text-center font-bold text-xl mb-1">
                    {league.leagueName} - Round {roundNumber}
                </Text>
                {games.length > 0 ? (
                    games.map((game, index) => (
                        <MatchPredictionLC
                            key={index}
                            team1={game.teams.home}
                            team2={game.teams.away}
                            matchDate={game.fixture.date}
                            scoreTeam1={game.goals.home}
                            scoreTeam2={game.goals.away}
                        />
                    ))
                ) : (
                    <Text className="text-center text-sm my-2">No games found for this round.</Text>
                )}
            </View>
        );
      })}
      {leagues.length === 0 && (
          <Text className="text-center text-lg my-4">No leagues found.</Text>
      )}
    </ScrollView>
  );
  
};

export default CompletedGamesScreen;
