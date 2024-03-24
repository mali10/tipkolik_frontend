import React, { useState , useContext } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  TextInput,
  View,
  StyleSheet,
  ScrollView,
  Switch,
  Alert
} from 'react-native';

//API Client
import axios from 'axios';

// credentials context
import { CredentialsContext } from '../../components/LoginComponents/CredentialsContext';

//import { leagueName as TurkishLeagueName, teamsData as TurkishTeamsData } from '../../components/DataComponents/TurkishLeague';
//import { leagueName as EnglishLeagueName, teamsData as EnglishTeamsData } from '../../components/DataComponents/EnglishLeague';
//import { leagueName as SpanishLegaueName , teamsData as SpanishTeamsData } from '../../components/DataComponents/SpanishLeague';
import { leagueName as Euro2024Name , teamsData as Euro2024TeamsData } from '../../components/DataComponents/Euro2024';

const CreateTournamentScreen = () => {

  // New state for managing the feedback message
  const [feedback, setFeedback] = useState('');

  // credentials context
  const { storedCredentials } = useContext(CredentialsContext);
  // Fallback to default values if storedCredentials is null
  const defaultCredentials = { name: 'Creator', email: 'creator@example.com' };
  const { name: creatorName } = storedCredentials || defaultCredentials;

  // For tournament name
  const [tournamentName, setTournamentName] = useState('');

  // For players list
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState([]);

  const [selectedTeams, setSelectedTeams] = useState([]);
  // state to hold the currently displayed league's teams
  const [currentLeagueTeams, setCurrentLeagueTeams] = useState(Euro2024TeamsData);

  const [isSurpriseMatchActive, setIsSurpriseMatchActive] = useState(false);

  
  const toggleTeamSelection = (team , leagueName) => {
    setSelectedTeams((prevSelectedTeams) => {
      const uniqueId = `${leagueName}-${team.t_id}`; // creating uniqueId from the TeamsData files
      if (prevSelectedTeams.includes(uniqueId)) {
        // If team is already selected, remove it
        return prevSelectedTeams.filter((id) => id !== uniqueId);
      } else {
        // If team is not selected, add it
        return [...prevSelectedTeams, uniqueId];
      }
    });
  };

  const isTeamSelected = (teamId, leagueName) => {
    const uniqueId = `${leagueName}-${teamId}`;
    return selectedTeams.includes(uniqueId);
  };
  
  const leagues = [
    { name: Euro2024Name, teams: Euro2024TeamsData },
    //{ name: TurkishLeagueName, teams: TurkishTeamsData },
    //{ name: EnglishLeagueName, teams: EnglishTeamsData },
    //{ name: SpanishLegaueName, teams: SpanishTeamsData },
  ];

  const [currentLeagueName, setCurrentLeagueName] = useState('');
  const selectLeague = (leagueName, leagueTeams) => {
    setCurrentLeagueTeams(leagueTeams);
    setCurrentLeagueName(leagueName); // Keep track of the current league's name
  };

  const groupTeamsByGroup = (teams) => {
    return teams.reduce((groups, team) => {
      const group = groups[team.group] || [];
      group.push(team);
      groups[team.group] = group;
      return groups;
    }, {});
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

  const groupedTeams = groupTeamsByGroup(currentLeagueTeams);
  
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
            {leagues.map((league) => (
            <TouchableOpacity
              key={league.name}
              onPress={() => selectLeague(league.name, league.teams)}
              style={styles.leagueButton}
            >
              <Text style={styles.leagueButtonText}>{league.name}</Text>
            </TouchableOpacity>
            ))}
        </ScrollView>

        {/* Teams listing based on selected league */}
        <ScrollView style={styles.teamsContainer}>
          {Object.entries(groupedTeams).map(([group, teams]) => (
            <View key={group}>
              <Text style={styles.groupHeader}>{`Grup ${group}`}</Text>
              {teams.map((team) => (
                <View key={team.t_id} style={styles.teamItem}>
                  <MaterialCommunityIcons name={team.logo} size={24} color="#000" />
                  <Text style={styles.teamText}>{team.name}</Text>
                  <TouchableOpacity
                    style={isTeamSelected(team.t_id, currentLeagueName) ? styles.selectedButton : styles.selectButton}
                    onPress={() => toggleTeamSelection(team, currentLeagueName)}
                  >
                    <Text style={styles.buttonText}>
                      {isTeamSelected(team.t_id, currentLeagueName) ? "✓" : "[ ]"}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
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

// #355E3B -> hunter green 
const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    margin: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10 ,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    flex: 1,
    marginRight: 10,
    backgroundColor: 'lightgray' ,
  },
  button: {
    backgroundColor: '#355E3B',
    padding: 10,
    borderRadius: 5,
    width: '30%',
    alignItems: 'center',
  },
  listContainer: {
    width: '70%',
    marginBottom: 6 ,
    height: 140 ,
  },
  playersList: {
    marginBottom: 20,
  },
  playerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'lightgray',
    padding: 8,
    borderRadius: 5,
    marginBottom: 5,
  },
  deleteButton: {
    alignItems: 'center' ,
    width: '10%' ,
    padding: 2,
    borderRadius: 2,
    backgroundColor: '#355E3B', 
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    marginBottom: 10,
    marginTop: 20 ,
  },
  leagueButtonsContainer: {
    marginTop: 5,
    marginBottom: 10,
    flexDirection: 'row' ,
  },
  leagueButton: {
    backgroundColor: '#355E3B',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    width: 150,
    alignItems: 'center' ,
  },
  leagueButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  teamsContainer: {
    height: 230 ,
    width: '90%',
    padding: 1 , 
    marginTop: 0 ,
  },
  teamItem: {
    flexDirection: 'row', // This ensures the items are laid out in a horizontal line
    justifyContent: 'space-between', // This spreads out the items to opposite ends
    alignItems: 'center', // This centers the items vertically within the container
    backgroundColor: 'lightgray',
    padding: 5,
    borderRadius: 5,
    marginBottom: 5,
  },
  selectButton: {
    borderWidth: 2,
    borderColor: 'black', // Border color for unselected
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedButton: {
    borderWidth: 2,
    borderColor: 'black', // Border color for selected, can be same as unselected
    backgroundColor: 'lightgreen', // Background to indicate selection
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  createTournamentButton: {
    backgroundColor: '#355E3B', // Button background color
    padding: 20, // Button padding for size
    borderRadius: 5, // Button border radius for rounded corners
    width: '90%', // Button width
    alignItems: 'center', // Center text inside the button
    justifyContent: 'center', // Center text vertically
    alignSelf: 'center', // Center button horizontally
    margin: 15, 
  },
  createTournamentButtonText: {
    color: 'white', // Text color
    fontWeight: 'bold', // Text weight
    fontSize: 16, // Text size
  },
  groupHeader: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 10,
  },
  tournamentInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    width: '100%', // Ensure it occupies the full width
    marginBottom: 2, // Space from the next element
    backgroundColor: 'lightgray',
  },
  feedbackText: {
    color: 'red', // Example color for feedback
    marginTop: 4,
    marginBottom: 10 ,
  },

});

export default CreateTournamentScreen;