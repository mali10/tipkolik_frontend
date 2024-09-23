import React, { useEffect, useState, useContext } from 'react';
import { ScrollView, Text, View, ActivityIndicator, Alert} from 'react-native';

import { RAPID_API_URL , RAPID_API_KEY, RAPID_API_HOST , CURRENT_IP_R } from '@env';
import axios from 'axios';
import MatchPrediction from '../../../components/PredComponents/MatchPredictionComponent';  

import { TournamentContext } from '../../../components/PredComponents/TournamentContext';

const UpcomingGamesScreen = ( {route} ) => {
  
  const { tournamentName } = route?.params || { tournamentName: 'Tournament' };
  const { updatetournamentInfos } = useContext(TournamentContext);
  console.log(tournamentName);

  const [teams, setTeams] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [leagueRounds, setLeagueRounds] = useState({});
  const [leagueGames, setLeagueGames] = useState({}); 
  
  const [predictions, setPredictions] = useState({});

  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    
    const fetchTeamIds = async () => {

      setLoading(true);
      if (!tournamentName) {
          Alert.alert("Error", "Tournament name is not specified.");
          setLoading(false);
          return;
      }
      
      console.log("Hi")
      const apiUrl = `http://${CURRENT_IP_R}:3000/tournament/tournament-teams?t_name=${encodeURIComponent(tournamentName)}`;
      try {
          const response = await axios.get(apiUrl);
          if (response.data.length === 0) {
              Alert.alert("Notice", "No teams found for this tournament.");
              setLoading(false);
              return;
          }
          const { teams, leagues } = response.data; 
          if (teams && teams.length > 0) {
            setTeams(teams);
            setLeagues(leagues);
            updatetournamentInfos({ tournamentName, teams, leagues }); 
            const rounds = await fetchCurrentRounds(leagues);
            setLeagueRounds(rounds);
            await fetchGames(teams , rounds);
          } else {
            Alert.alert("Notice", "No teams found for this tournament.");
          }
      } catch (error) {
          console.error('Failed to fetch team IDs:', error);
          Alert.alert("Error", "Failed to fetch team IDs: " + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };

    fetchTeamIds();

  }, [tournamentName]); 

  const fetchCurrentRounds = async (leagues) => {
    const roundFetchPromises = leagues.map(league => {
      const options = {
        method: 'GET',
        url: `${RAPID_API_URL}fixtures/rounds`,
        params: {
          season: '2024',
          league: league.leagueId, 
          current: 'true'
        },
        headers: {
          'x-rapidapi-key': RAPID_API_KEY,
          'x-rapidapi-host': RAPID_API_HOST,
        }
      };
  
      return axios.request(options).then(response => {
        if (response.data.response.length > 0) {
          return { leagueId: league.leagueId, currentRound: response.data.response[0] };
        } else {
          console.log(`No current rounds found for league ${league.leagueId}`);
          return { leagueId: league.leagueId, currentRound: undefined };
        }
      }).catch(error => {
        console.error(`Failed to fetch current round for league ${league.leagueId}:`, error);
        return { leagueId: league.leagueId, currentRound: undefined };
      });
    });
  
    const results = await Promise.all(roundFetchPromises);
    const rounds = results.reduce((acc, result) => {
      acc[result.leagueId] = result.currentRound;
      return acc;
    }, {});
  
    console.log("Fetched rounds:", rounds);
    updatetournamentInfos({ rounds: rounds}); 
    return rounds;
  };
  

  const fetchGames = async (teams, rounds) => {
    
    const requests = teams.flatMap(team =>
        team.leagueIds.map(leagueId =>
            axios({
                method: 'GET',
                url: `${RAPID_API_URL}fixtures`,
                params: {
                    season: '2024',
                    team: team.teamId,
                    league: leagueId,
                    round: rounds[leagueId],
                    status: "NS"
                    // next: 1, 
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
    
          const sortedLeagues = Object.entries(leagueGameMap).sort((a, b) => b[1].length - a[1].length);
          setLeagueGames(Object.fromEntries(sortedLeagues));
          console.log(leagueGames);
    
        } catch (error) {
          console.error('Failed to fetch games:', error);
          Alert.alert("Error", "Failed to fetch games: " + (error.response?.data?.message || error.message));
        } finally {
          setLoading(false); 
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
      {leagues.map(league => {
        const games = leagueGames[league.leagueId] || []; 
        const roundNumber = leagueRounds[league.leagueId] ? leagueRounds[league.leagueId].match(/\d+/)[0] : 'Unknown'; 

        return (
            <View key={league.leagueId} className="p-3">
                <Text className="text-center font-bold text-xl mb-1">
                    {league.leagueName} - Round {roundNumber}
                </Text>
                {games.length > 0 ? (
                    games.map((game, index) => (
                        <MatchPrediction
                            key={index}
                            team1={game.teams.home}
                            team2={game.teams.away}
                            matchDate={game.fixture.date}
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

export default UpcomingGamesScreen;

