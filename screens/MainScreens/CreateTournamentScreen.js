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

  // credentials context
  const { storedCredentials } = useContext(CredentialsContext);
  // Fallback to default values if storedCredentials is null
  const defaultCredentials = { name: 'Creator', email: 'creator@example.com' };
  const { name: creatorName } = storedCredentials || defaultCredentials;

  // For players list
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState([]);

  const [isSurpriseMatchActive, setIsSurpriseMatchActive] = useState(false);

  const [selectedTeams, setSelectedTeams] = useState([]);
  // state to hold the currently displayed league's teams
  const [currentLeagueTeams, setCurrentLeagueTeams] = useState(Euro2024TeamsData);

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
  

  /* 
  // When adding players, should be checked if those users really exist in the backend, should send a request 
  const checkPlayerExists = async (playerName) => {
    try {
      const response = await axios.post("http://<your-backend-url>/check-player", { playerName });
      return response.data.exists; // Assuming the backend returns { exists: true/false }
    } catch (error) {
      console.error("Error checking player existence:", error);
      return false; // Assume player doesn't exist if there's an error
    }
  }; 
  */

  /*
  const searchUserByName = async (userName) => {
    try {
      const response = await axios.get(`http://your-backend.com/user/search?name=${encodeURIComponent(userName)}`);
      const users = response.data;

      if (users.length > 0) {
        // Assuming the search returns an array and you're taking the first result
        return users[0];
      } else {
        console.log('No users found');
        return null;
      }
    } catch (error) {
      console.error('Error searching for user:', error);
      return null;
    }
  };
  */

  // addPlayer function
  const addPlayer = () => {
    if (playerName.trim() && !players.includes(playerName)) {
      setPlayers(currentPlayers => [...currentPlayers, playerName.trim()]);
      setPlayerName('');
    }
  };
  
  const removePlayer = (indexToRemove) => {
    setPlayers(currentPlayers => currentPlayers.filter((_, index) => index !== indexToRemove));
  };

  const createTournament = () => {
    const playerIds = players.map(player => player.id);
    const teams = selectedTeams; // Assuming these are the team IDs or names
    const settings = { isSurpriseMatchActive };

    // Here you'd make a request to your backend with playerIds, teams, and settings
    console.log('Creating tournament with:', { playerIds, teams, settings });
  };

  const groupedTeams = groupTeamsByGroup(currentLeagueTeams);
  
  return (
    <SafeAreaView style={styles.container}>
        {/* Add Player Input */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Add players"
            value={playerName}
            onChangeText={setPlayerName}
            style={styles.input}
          />
          <TouchableOpacity onPress={addPlayer} style={styles.button}>
            <Text> Ekle </Text>
          </TouchableOpacity>
        </View>

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
    marginTop: 20 ,
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
    width: '90%',
    marginBottom: 20 ,
    height: 120 ,
  },
  playersList: {
    marginBottom: 20,
  },
  playerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'lightgray',
    padding: 10,
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
    marginBottom: 20,
    marginTop: 40 ,
  },
  leagueButtonsContainer: {
    marginTop: 10,
    marginBottom: 20,
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
    height: 250 ,
    width: '90%',
    padding: 1 , 
    marginTop: 0 ,
  },
  teamItem: {
    flexDirection: 'row', // This ensures the items are laid out in a horizontal line
    justifyContent: 'space-between', // This spreads out the items to opposite ends
    alignItems: 'center', // This centers the items vertically within the container
    backgroundColor: 'lightgray',
    padding: 10,
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
    marginTop: 20,
    marginBottom: 10,
    paddingLeft: 10,
  },
});

export default CreateTournamentScreen;