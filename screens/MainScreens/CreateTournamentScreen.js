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

const CreateTournamentScreen = () => {
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState([]);
  const [isSurpriseMatchActive, setIsSurpriseMatchActive] = useState(false);

  const [teamsData, setTeamsData] = useState([]);
  
  const leagues = [
    { name: TurkishLeagueName, teams: TurkishTeamsData },
    { name: EnglishLeagueName, teams: EnglishTeamsData },
  ];

  const selectLeague = (leagueTeams) => {
    setTeamsData(leagueTeams);
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
      <ScrollView style={styles.leagueButtonsContainer} horizontal showsHorizontalScrollIndicator={false}>
        {leagues.map((league, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => selectLeague(league.teams)}
            style={styles.leagueButton}
          >
            <Text style={styles.leagueButtonText}>{league.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Teams listing based on selected league */}
      <ScrollView style={styles.teamsContainer}>
        {teamsData.map((team) => (
          <View key={team.id} style={styles.teamItem}>
            <Text>{team.name}</Text>
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

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    padding: 20,
    alignItems: 'center',
    margin: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    flex: 1,
    marginRight: 10,
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
    flexDirection: 'column',
    marginTop: 10,
    marginBottom: 20,
  },
  leagueButton: {
    backgroundColor: 'purple',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    width: '50%',
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
    backgroundColor: 'lightgray',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
});

export default CreateTournamentScreen;
