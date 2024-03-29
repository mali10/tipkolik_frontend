import React, { useState , useContext, useEffect } from 'react';

import styles from './CreateTournamentStyles';

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

//API Client
import axios from 'axios';

// credentials context
import { CredentialsContext } from '../../../components/LoginComponents/CredentialsContext';

const CreateTournamentScreen = () => {

  // Feedback message
  const [feedback, setFeedback] = useState('');

  // Credentials context
  const { storedCredentials } = useContext(CredentialsContext);
  // Fallback to default values if storedCredentials is null
  const defaultCredentials = { name: 'Creator', email: 'creator@example.com' };
  const { name: creatorName } = storedCredentials || defaultCredentials;

  // Tournament name
  const [tournamentName, setTournamentName] = useState('');

  // For players list
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState([]);

  const [selectedTeams, setSelectedTeams] = useState([]);

  // Currently displayed league's teams
  const [currentLeagueTeams, setCurrentLeagueTeams] = useState([]);
  const leagueConfigs = {
    //'Euro2024': { leagueId: '78', season: '2023' }, 
    //'Süper Lig': { leagueId: '2', season: '2023' },
    'Bundesliga': { leagueId: '78', season: '2023' }, 
    'LaLiga' : { leagueId: '140', season: '2023' }, 
    'Premier League': { leagueId: '39', season: '2023' },
    'Şamiyonlar Ligi': { leagueId: '2', season: '2023' }, 
  };

  // Switches
  const [isSurpriseMatchActive, setIsSurpriseMatchActive] = useState(false);

  // Teams-fetching function
  const fetchTeams = async (leagueId, season) => {
    const url = `https://api-football-v1.p.rapidapi.com/v3/teams?league=${leagueId}&season=${season}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '9f83fe144fmshfa1e2f24c98788fp1743f8jsnb7b3a42b742b',
          'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
        }
      });
      if (!response.ok) throw new Error('Network response was not ok.');
      const data = await response.json();
      setCurrentLeagueTeams(data.response.map(item => item.team )); 
      
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert("Error", "Failed to fetch teams.");
    }
  };

  // Loading first leagues teams when navigated to the screen
  useEffect(() => {
    const firstLeagueKey = Object.keys(leagueConfigs)[0];
    const firstLeagueConfig = leagueConfigs[firstLeagueKey];
    fetchTeams(firstLeagueConfig.leagueId, firstLeagueConfig.season);
  }, [] );

  // Toggle team selection
  const toggleTeamSelection = (teamId) => {
    setSelectedTeams((prevSelectedTeams) => {
      if (prevSelectedTeams.includes(teamId)) {
        return prevSelectedTeams.filter(id => id !== teamId);
      } else {
        return [...prevSelectedTeams, teamId];
      }
    });
  };

  // Check if the team is selected
  const isTeamSelected = (teamId) => {
    return selectedTeams.includes(teamId);
  };
  
  // When adding players, check 
  const handleCheckPlayerExists = async (playerName) => {
    try {
      const response = await axios.post("http://192.168.1.39:3000/user/check-player", { playerName });
      return response.data.exists; // Returns true if the player exists, false otherwise
    } catch (error) {
      console.error("Error checking player existence:", error);
      throw error; // Rethrow the error to handle it in the calling function
    }
  };
  
  // addPlayer function
  const addPlayer = async () => {
    setFeedback(''); // Clear previous feedback
    if (!playerName.trim()) {
      // Provide feedback if the player name input field is empty
      setFeedback(' Oyuncu ismi girin !');
      return; // Exit the function early
    }

    try {
      // or handle with Alert
      const exists = await handleCheckPlayerExists(playerName.trim());
      if (exists) {
        if (!players.includes(playerName.trim())) {
          setPlayers(currentPlayers => [...currentPlayers, playerName.trim()]);
          setPlayerName(''); // Clear the input field after adding
          setFeedback(''); // Clear feedback if successful
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

  const createTournament = async () => {

    // Assuming `players` state holds player names, not IDs.
    // Adjust URL to your backend endpoint.

    const apiUrl = "http://192.168.1.39:3000/tournament/create";

    const tournamentData = {
        t_name: tournamentName,
        playerNames: players, 
        teams: selectedTeams.map(team => team.name), // Assuming each selected team has a 'name' field. Adjust as necessary.
        settings: {
            isSurpriseMatchActive: isSurpriseMatchActive,
        },
    };

    try {
      const response = await axios.post(apiUrl, tournamentData);
      if (response.status === 201) {
          Alert.alert("Success", "Tournament created successfully.");
          // Optionally reset state here to clear the form
      } else {
          // If the response status is not 201, we check for specific error messages
          Alert.alert("Error", "Failed to create tournament. Please try again.");
      }
  } catch (error) {
      console.error("Error creating tournament:", error);
      // Here, check the error response for a specific message regarding tournament name uniqueness
      if (error.response && error.response.status === 400 && error.response.data.message === 'A tournament with this name already exists.') {
          Alert.alert("Error", "A tournament with this name already exists. Please choose a different name.");
      } else {
          Alert.alert("Error", "An error occurred while creating the tournament. Please check your connection and try again.");
      }
  }
  };

  
  return (

    <SafeAreaView style={styles.container}>

        {/* Tournament name */}
        <View style={styles.inputContainer}>
            <TextInput
              placeholder="Eşsiz turnuva adınızı girin !"
              value={tournamentName}
              onChangeText={setTournamentName}
              style={styles.tournamentInput}
            />
        </View>

        {/* Add Player Input */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Arkadaşlarını ekle !"
            value={playerName}
            onChangeText={setPlayerName}
            style={styles.input}
          />
          <TouchableOpacity onPress={addPlayer} style={styles.button}>
            <Text> Ekle </Text>
          </TouchableOpacity>
        </View>

        {/* Display feedback to the user */}
        { feedback && <Text style={styles.feedbackText}>{feedback}</Text>}

        {/* Player List */}
        <View style={styles.listContainer}>

          <View style={styles.playerItem}>
            <Text style={styles.playerName}>{creatorName}</Text>
          </View> 

          <ScrollView style={styles.playersList}>
            {players.map((player, index) => (
              <View key={index.toString()} style={styles.playerItem}>
                <Text>{player}</Text>
                <TouchableOpacity onPress={() => removePlayer(index)} style={styles.deleteButton}>
                  <Text style={styles.deleteButtonText}>X</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* League selection buttons */}
        <ScrollView style={styles.leagueButtonsContainer} horizontal={true} showsHorizontalScrollIndicator={false}
         >
         {Object.entries(leagueConfigs).map(([leagueName, config]) => (
                <TouchableOpacity 
                    key={leagueName} 
                    onPress={() => fetchTeams(config.leagueId, config.season)}
                    style={styles.leagueButton}>
                    <Text style={styles.leagueButtonText}>{leagueName}</Text>
                </TouchableOpacity>
          ))}   
        </ScrollView>

        {/* Teams listing based on selected league */}
        <ScrollView style={styles.teamsContainer}>
          { currentLeagueTeams.map((team) => (
            <View key={team.id} style={styles.teamItem}>

              <Image source={{ uri: team.logo }} style={styles.teamLogo} />
              <Text style={styles.teamText}>{team.name}</Text>

              <TouchableOpacity 
                onPress={() => toggleTeamSelection(team.id)}
                style={isTeamSelected(team.id) ? styles.teamSelectButtonSelected : styles.teamSelectButton}>
                <Text>{isTeamSelected(team.id) ? ' ✓ ' : '[  ]'}</Text>
              </TouchableOpacity>

            </View>
          ))}
        </ScrollView>

        
        <View style={styles.switchContainer}>
          <Text>Süpriz Maç</Text>
          <Switch
            trackColor={{ false: "#767577", true: "purple" }}
            thumbColor={isSurpriseMatchActive ? "white" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={setIsSurpriseMatchActive}
            value={isSurpriseMatchActive}
          />
        </View>
      

      <TouchableOpacity onPress={createTournament} style={styles.createTournamentButton}>
          <Text style={styles.createTournamentButtonText}> Turnuvayı Oluştur</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
};


export default CreateTournamentScreen;