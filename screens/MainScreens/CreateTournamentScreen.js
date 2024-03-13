import React, { useState } from 'react';
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


import { leagueName as TurkishLeagueName, teamsData as TurkishTeamsData } from '../../components/DataComponents/TurkishLeague';
import { leagueName as EnglishLeagueName, teamsData as EnglishTeamsData } from '../../components/DataComponents/EnglishLeague';
import { leagueName as SpanishLegaueName , teamsData as SpanishTeamsData } from '../../components/DataComponents/SpanishLeague';


const CreateTournamentScreen = () => {
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState([]);
  const [isSurpriseMatchActive, setIsSurpriseMatchActive] = useState(false);

  const [selectedTeams, setSelectedTeams] = useState([]);
  // New state to hold the currently displayed league's teams
  const [currentLeagueTeams, setCurrentLeagueTeams] = useState(TurkishTeamsData);

  const toggleTeamSelection = (team , leagueName) => {
    setSelectedTeams((prevSelectedTeams) => {
      const uniqueId = `${leagueName}-${team.id}`;
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
    { name: TurkishLeagueName, teams: TurkishTeamsData },
    { name: EnglishLeagueName, teams: EnglishTeamsData },
    { name: SpanishLegaueName, teams: SpanishTeamsData },
  ];

  const [currentLeagueName, setCurrentLeagueName] = useState('');
  const selectLeague = (leagueName, leagueTeams) => {
    setCurrentLeagueTeams(leagueTeams);
    setCurrentLeagueName(leagueName); // Keep track of the current league's name
  };

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
    // Logic to handle tournament creation
    console.log('Tournament is being created with selected teams and players...');
    // Possibly navigate to another screen or display a confirmation message
  };

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Add players"
            value={playerName}
            onChangeText={setPlayerName}
            style={styles.input}
          />
          <TouchableOpacity onPress={addPlayer} style={styles.button}>
            <Text>Add</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listContainer}>
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
        <View style={styles.teamsContainer}>
          <ScrollView>
          {currentLeagueTeams.map((team) => (
            <View key={team.id} style={styles.teamItem}>
              <Text>{team.name}</Text>
              <TouchableOpacity
                style={isTeamSelected(team.id, currentLeagueName) ? styles.selectedButton : styles.selectButton}
                onPress={() => toggleTeamSelection(team, currentLeagueName)}
              >
                <Text style={styles.buttonText}>
                  {isTeamSelected(team.id, currentLeagueName) ? "✓" : ""}
                </Text>
              </TouchableOpacity>
            </View> 
          ))}
          </ScrollView>
        </View>     
        
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
    backgroundColor: 'purple',
    padding: 10,
    borderRadius: 5,
    width: '30%',
    alignItems: 'center',
  },
  listContainer: {
    width: '90%',
    marginBottom: 20 ,
    maxHeight: 180 ,
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
    backgroundColor: 'purple', 
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
    backgroundColor: 'purple',
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
    backgroundColor: 'purple', // Button background color
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
});

export default CreateTournamentScreen;