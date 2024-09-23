import React, { useState , useContext, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  View,
  ScrollView,
  Switch,
  Alert ,
} from 'react-native';

import { RAPID_API_URL , RAPID_API_KEY, RAPID_API_HOST , CURRENT_IP_R } from '@env';

import axios from 'axios';
import { CredentialsContext } from '../../components/LoginComponents/CredentialsContext';

const CreateTournamentScreen = () => {

  const [feedback, setFeedback] = useState('');
  
  const { storedCredentials } = useContext(CredentialsContext);
  const defaultCredentials = { name: 'Creator', email: 'creator@example.com' };

  // Admin
  const { name: creatorName } = storedCredentials || defaultCredentials;
  // Tournament name
  const [tournamentName, setTournamentName] = useState('');
  const [nameChecked, setNameChecked] = useState(false);
  const [nameAvailable, setNameAvailable] = useState(false);
  // For players list
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState([]);
  console.log(players)
  const [selectedTeams, setSelectedTeams] = useState([]);
  // Currently displayed league's teams
  const [currentLeagueTeams, setCurrentLeagueTeams] = useState([]);
  const [currentLeagueId, setCurrentLeagueId] = useState('');
  const leagueConfigs = {
    'Süper Lig': { leagueId: '203', season: '2024' },
    'LaLiga' : { leagueId: '140', season: '2024' },
    'Şampiyonlar Ligi': { leagueId: '2', season: '2024' }, 
    'Premier Lig': { leagueId: '39', season: '2024' },
    'Bundesliga': { leagueId: '78', season: '2024' }, 
  };
  // Switches-Settings
  const [isSurpriseMatchActive, setIsSurpriseMatchActive] = useState(false);

  useEffect(() => {
    setPlayers([creatorName]);

    const firstLeagueKey = Object.keys(leagueConfigs)[0];
    const firstLeagueConfig = leagueConfigs[firstLeagueKey];
    setCurrentLeagueId(firstLeagueConfig.leagueId);
    fetchTeams(firstLeagueConfig.leagueId, firstLeagueConfig.season);
  }, []);

  const fetchTeams = useCallback(async (leagueId, season) => {
    const url = `${RAPID_API_URL}teams?league=${leagueId}&season=${season}`;
    console.log("Teams Fetched")
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPID_API_KEY,
          'X-RapidAPI-Host': RAPID_API_HOST,
        }
      });
      if (!response.ok) throw new Error('Network response was not ok.');
      const data = await response.json();
      setCurrentLeagueTeams(data.response.map(item => item.team));
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert("Error", "Failed to fetch teams.");
    }
  }, [RAPID_API_URL, RAPID_API_KEY, RAPID_API_HOST]);
  
  console.log("League ID being toggled:", currentLeagueId);
  const toggleTeamSelection = (teamId, leagueId) => {
    setSelectedTeams(prevSelectedTeams => {
        const existingTeamIndex = prevSelectedTeams.findIndex(t => t.teamId === teamId);
        if (existingTeamIndex > -1) {
            const existingTeam = prevSelectedTeams[existingTeamIndex];
            if (leagueId && !existingTeam.leagueIds.includes(leagueId) && leagueId.trim() !== "") {
                const updatedTeam = {
                    ...existingTeam,
                    leagueIds: [...existingTeam.leagueIds, leagueId]
                };
                return [
                    ...prevSelectedTeams.slice(0, existingTeamIndex),
                    updatedTeam,
                    ...prevSelectedTeams.slice(existingTeamIndex + 1)
                ];
            }
            return prevSelectedTeams;
        } else {
            if (leagueId && leagueId.trim() !== "") {
                return [...prevSelectedTeams, { teamId, leagueIds: [leagueId] }];
            }
            return prevSelectedTeams;
        }
    });
};

  const isTeamSelected = (teamId, leagueId) => {
    const team = selectedTeams.find(t => t.teamId === teamId);
    return team ? team.leagueIds.includes(leagueId) : false;
  };

  const selectLeague = (leagueId, season) => {
    console.log("Selecting league:", leagueId);
    setCurrentLeagueId(leagueId);
    fetchTeams(leagueId, season);
  };

  // To check tournament name uniqueness
  const checkTournamentName = async () => {
    try { 
      const response = await axios.post(`http://${CURRENT_IP_R}:3000/tournament/check-tournament`, { t_name: tournamentName });
      if (response.status === 200) {
        Alert.alert("Success", "Tournament name is available.");
        setNameChecked(true);
        setNameAvailable(true);
      } else {
        Alert.alert("Notice", "Tournament name is already taken.");
        setNameChecked(true);
        setNameAvailable(false);
      }
    } catch (error) {
      if (error.response) {
        Alert.alert("Error", error.response.data.message);
      } else {
        Alert.alert("Error", "An error occurred. Please try again later.");
      }
      setNameChecked(false);
      setNameAvailable(false);
    }
  };

  const handleCheckPlayerExists = async (playerName) => {
    try {
      const response = await axios.post(`http://${CURRENT_IP_R}:3000/user/check-player`, { playerName });
      return response.data.exists; // Returns true if the player exists, false otherwise
    } catch (error) {
      console.error("Error checking player existence:", error);
      throw error; // Rethrow the error to handle it in the calling function
    }
  };
 
  const addPlayer = async () => {
    setFeedback(''); 
    if (!playerName.trim()) {
      setFeedback(' Oyuncu ismi girin !');
      return; 
    }

    try {
      const exists = await handleCheckPlayerExists(playerName.trim());
      if (exists) {
        if (!players.includes(playerName.trim())) {
          setPlayers(currentPlayers => [...currentPlayers, playerName.trim()]);
          setPlayerName(''); 
          setFeedback(''); 
        } else {
          setFeedback("Player is already added.");
        }
      } else {
        setFeedback("No such player exists.");
      }
    } catch (error) {
      setFeedback("Failed to check if player exists. Please try again.");
    }
  };
  
  const removePlayer = (indexToRemove) => {
    setPlayers(currentPlayers => currentPlayers.filter((_, index) => index !== indexToRemove));
  };

 
  const extractLeagueDetails = (teams) => {
    const uniqueLeagueIds = new Set(); 
    const leagueDetails = []; 

    teams.forEach(team => {
      team.leagueIds.forEach(leagueId => {
        if (!uniqueLeagueIds.has(leagueId)) {
          uniqueLeagueIds.add(leagueId); 
          const leagueName = Object.entries(leagueConfigs).find(([key, value]) => value.leagueId === leagueId)?.[0];
          if (leagueName) {
            leagueDetails.push({ leagueId: leagueId, leagueName: leagueName });
          }
        }
      });
    });
    
    return leagueDetails;
};

  

  const createTournament = async () => {

    if (!tournamentName.trim()) {
      Alert.alert("Error", "Tournament name can not be empty.");
      return; 
    }
  
    if (selectedTeams.length === 0) {
      Alert.alert("Error", "You have to at least select 1 team.");
      return; 
    }
  
    if (players.length === 0) {
      Alert.alert("Error", "No players added.");
      return; 
    }

    const leagueDetails = extractLeagueDetails(selectedTeams);

    const backendUrl = `http://${CURRENT_IP_R}:3000/tournament/create`;

    const tournamentData = {
        t_name: tournamentName,
        playerNames: players, 
        teams: selectedTeams.map(team => ({
          teamId: team.teamId,
          leagueIds: team.leagueIds
        })), 
        leagues: leagueDetails,
        settings: {
            isSurpriseMatchActive: isSurpriseMatchActive,
        },
    };
    console.log("Sending Tournament Data:", JSON.stringify({tournamentData}, null, 2));

    console.log("Backend URL:", backendUrl)

    try {
      const response = await axios.post(backendUrl, tournamentData);
      if (response.status === 201) {
        console.log("Trying to save the tournament")
          Alert.alert("Success", "Tournament created successfully.");
          console.log("Trying to save the tournament")

          // Reset state after successful creation
          setTournamentName('');
          setPlayers([creatorName]);
          setSelectedTeams([]);
          setIsSurpriseMatchActive(false);

          // Add this later after finishing the logic
          // navigation.navigate('PredTabGroup');

      } else {
          Alert.alert("Error", "Failed to create tournament. Please try again.");
      }
    } catch (error) {
        console.error("Error creating tournament:", error);
        if (error.response && error.response.status === 400 && error.response.data.message === 'A tournament with this name already exists.') {
            Alert.alert("Error", "A tournament with this name already exists. Please choose a different name.");
        } else {
            Alert.alert("Error", "An error occurred while creating the tournament. Please check your connection and try again.");
        }
    }
  };
  
  console.log("State Changed");
  console.log("Teams with league IDs:", JSON.stringify(selectedTeams, null, 2));

  return (

    <SafeAreaView className="px-5 items-center mx-5 my-5 ">

        {/* Tournament name */}
        <View className="flex-row justify-between mb-5 " >
            <TextInput
              placeholder="Eşsiz turnuva adınızı girin !"
              value={tournamentName}
              onChangeText={setTournamentName}
              className="border-black-400 bg-gray-300 rounded p-2.5 flex-1"
            />
            <TouchableOpacity onPress={checkTournamentName} className={`${nameChecked && nameAvailable ? 'bg-green-500' : 'bg-red-500'} rounded p-2.5 items-center justify-center h-10 w-10 ml-1`}>
              <Text className="text-white text-lg font-bold">{nameChecked && nameAvailable ? '✓' : '?'}</Text>
           </TouchableOpacity>
        </View>

        {/* Add Player Input */}
        <View className="flex-row justify-between items-center mb-5">
          <TextInput
            placeholder="Arkadaşlarını ekle !"
            value={playerName}
            onChangeText={setPlayerName}
            className="border border-gray-400 bg-gray-300 p-2.5 flex-1 mr-2.5 rounded"
          />
          <TouchableOpacity onPress={addPlayer} className="bg-green-700 p-2.5 rounded w-1/3 items-center">
            <Text className="text-white"> Ekle </Text>
          </TouchableOpacity>
        </View>

        {/* Display feedback to the user */}
        { feedback && <Text className="text-red-500 mt-1 mb-2">{feedback}</Text>}

        {/* Player List */}
        <ScrollView className="w-3/4 mb-10 min-h-500" >
            {players.map((player, index) => (
              <View key={index.toString()} className="flex-row justify-between items-center bg-gray-300 p-2 rounded mb-1">
                <Text>{player}</Text>
                <TouchableOpacity onPress={() => removePlayer(index)} className="bg-green-700 p-1 rounded">
                  <Text className="text-white font-bold">X</Text>
                </TouchableOpacity>
              </View>
            ))}
        </ScrollView>
      

        {/* League selection buttons */}
        <ScrollView className="mt-2 mb-4 flex-row"  horizontal={true} showsHorizontalScrollIndicator={false}
         >
         {Object.entries(leagueConfigs).map(([leagueName, config]) => (
                <TouchableOpacity 
                    key={leagueName} 
                    onPress={() => selectLeague(config.leagueId, config.season)}
                    className="bg-green-700 p-2.5 rounded mr-2 last:mr-0 items-center w-40">
                    <Text className="text-white font-bold">{leagueName}</Text>
                </TouchableOpacity>
          ))}   
        </ScrollView>

        {/* Teams listing based on selected league */}
        <ScrollView className="h-56 w-full p-0.5">
          { currentLeagueTeams.map((team) => (
            <View key={team.id} className="flex-row items-center justify-between p-2.5 border-b border-gray-300">

              <Image source={{ uri: team.logo }} className="w-7 h-7"/>
              <Text className="ml-2.5">{team.name}</Text>

              <TouchableOpacity 
                onPress={() => toggleTeamSelection(team.id, currentLeagueId)}
                className={isTeamSelected(team.id, currentLeagueId) ? "bg-green-500 rounded p-2.5 ml-2.5" : "bg-gray-300 rounded p-2.5 ml-2.5"}>
                <Text>{isTeamSelected(team.id, currentLeagueId) ? ' ✓ ' : ' + '}</Text>
              </TouchableOpacity>

            </View>
          ))}
        </ScrollView>

        
        <View className="flex-row justify-between items-center w-full mb-2.5 mt-5 w-80">
          <Text>Sürpriz Maç</Text>
          <Switch
            trackColor={{ false: "#767577", true: "purple" }}
            thumbColor={isSurpriseMatchActive ? "white" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={setIsSurpriseMatchActive}
            value={isSurpriseMatchActive}
          />
        </View>
      

      <TouchableOpacity onPress={createTournament} className="bg-green-700 p-5 rounded w-full items-center justify-center self-center my-4">
          <Text className="text-white font-bold text-base"> Turnuvayı Oluştur</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
  
};

export default CreateTournamentScreen;