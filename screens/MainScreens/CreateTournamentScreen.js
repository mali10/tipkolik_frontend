import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  TextInput,
  View,
  StyleSheet,
  Switch,
  ScrollView,
  Modal,
  Button,
  FlatList,
} from 'react-native';

const CreateTournamentScreen = ({ navigation }) => {
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [isSurpriseMatchActive, setIsSurpriseMatchActive] = useState(false);
  const [isCountryModalVisible, setIsCountryModalVisible] = useState(false);
  const [isTeamModalVisible, setIsTeamModalVisible] = useState(false);

  // Dummy data for countries and teams
  const countries = ['Spain', 'England', 'Italy'];
  const teamsByCountry = {
    Spain: ['Real Madrid', 'Barcelona'],
    England: ['Liverpool', 'Manchester United'],
    Italy: ['Juventus', 'AC Milan'],
  };

  const addPlayer = () => {
    if (playerName && !players.includes(playerName)) {
      setPlayers(currentPlayers => [...currentPlayers, playerName]);
      setPlayerName('');
    }
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setIsCountryModalVisible(false);
    setSelectedTeams([]); // Clear teams when country changes
  };

  const handleTeamSelect = (team) => {
    setSelectedTeams(currentTeams => {
      if (!currentTeams.includes(team)) {
        return [...currentTeams, team];
      } else {
        return currentTeams;
      }
    });
    setIsTeamModalVisible(false);
  };

  const createTournament = () => {
    // Placeholder for creating tournament logic
    console.log('Creating tournament...');
    // Here you would send the tournament data to your backend API
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

      <ScrollView style={styles.playersList}>
        {players.map((player, index) => (
          <View key={index} style={styles.playerItem}>
            <Text>{player}</Text>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        onPress={() => setIsCountryModalVisible(true)}
        style={styles.button}
      >
        <Text>Select Country</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isCountryModalVisible}
        onRequestClose={() => setIsCountryModalVisible(false)}
      >
        <View style={styles.modalView}>
          <FlatList
            data={countries}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Button title={item} onPress={() => handleCountrySelect(item)} />
            )}
          />
        </View>
      </Modal>

      <TouchableOpacity
        onPress={() => setIsTeamModalVisible(true)}
        style={styles.button}
        disabled={!selectedCountry}
      >
        <Text>Select Team</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isTeamModalVisible}
        onRequestClose={() => setIsTeamModalVisible(false)}
      >
        <View style={styles.modalView}>
          {selectedCountry && (
            <FlatList
              data={teamsByCountry[selectedCountry]}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Button title={item} onPress={() => handleTeamSelect(item)} />
              )}
            />
          )}
        </View>
      </Modal>

      <ScrollView style={styles.selectedTeamsContainer}>
        {selectedTeams.map((team, index) => (
          <View key={index} style={styles.selectedTeamItem}>
            <Text>{team}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.switchContainer}>
        <Text>Surprise Match</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isSurpriseMatchActive ? "#f5dd4b" : "#f4f3f4"}
          onValueChange={setIsSurpriseMatchActive}
          value={isSurpriseMatchActive}
        />
      </View>

      <TouchableOpacity onPress={createTournament} style={styles.createButton}>
        <Text>Create Tournament</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center', // Center content horizontally
  },
  inputContainer: {
    flexDirection: 'row',
    width: '90%', // Use full width of the container
    maxWidth: 400, // Set a max width for larger screens
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20 ,
    marginBottom: 10,
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
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  playersList: {
    width: '60%', // Use full width of the container
    maxWidth: 400, // Set a max width for larger screens
    marginBottom: 20,
  },
  playerItem: {
    backgroundColor: 'lightgray',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 5 ,
  },
  countryContainer: {
    flexDirection: 'row',
    width: '100%', // Use full width of the container
    maxWidth: 400, // Set a max width for larger screens
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  countryButton: {
    backgroundColor: 'lightgray',
    padding: 10,
    borderRadius: 5,
    flex: 1, // Make each button take up equal space
    marginHorizontal: 2, // Add space between buttons
    
  },
  teamsList: {
    width: '100%', // Use full width of the container
    maxWidth: 400, // Set a max width for larger screens
    marginBottom: 20,
  },
  teamItem: {
    backgroundColor: 'lightgray',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  selectedTeamsContainer: {
    width: '100%', // Use full width of the container
    maxWidth: 400, // Set a max width for larger screens
    marginBottom: 20,
  },
  selectedTeamItem: {
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    width: '100%', // Use full width of the container
    maxWidth: 400, // Set a max width for larger screens
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 50,
  },
  createButton: {
    backgroundColor: 'green',
    padding: 20,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%', // Use full width of the container
    maxWidth: 400, // Set a max width for larger screens
  },
  modalView: {
    marginB: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,

  },
});

export default CreateTournamentScreen;

