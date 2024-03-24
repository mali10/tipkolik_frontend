import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TextInput, Image, StyleSheet , TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { gamesData , teamsData } from '../../components/DataComponents/TurkishLeague';

 const generateGames = () => {
  const games = [...gamesData];
  return games.map((game) => {
    const homeTeam = teamsData.find((team) => team.t_id === game.homeTeamId);
    const awayTeam = teamsData.find((team) => team.t_id === game.awayTeamId);
    return { homeTeam, awayTeam, date: game.date, time: game.time };
  });
}; 

const PredScreen = (  ) => { 

  //const [homeScores, setHomeScores] = useState({});
  //const [awayScores, setAwayScores] = useState({});
  const [focusedTeam, setFocusedTeam] = useState(null);

  const handleScoreChange = (teamId, score, isHomeTeam, index) => {
    if (isHomeTeam) {
      setHomeScores((prevScores) => ({ ...prevScores, [teamId]: score }));
    } else {
      setAwayScores((prevScores) => ({ ...prevScores, [teamId]: score }));
    }
  };

  const handleKaydet = () => {
   
  };
  

  const games = generateGames();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {games.map((game, index) => (
          <View key={index} style={styles.gameContainer}>

            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>{game.date}</Text>
              <Text style={styles.timeText}>{game.time}</Text>
            </View>

            <View style={styles.teamContainer}>

              <View style={styles.teamColumn}> 
                <Ionicons
                  name={game.homeTeam.logo}
                  size={30}
                  color={focusedTeam === game.homeTeam.id ? 'green' : 'black'}
                  style={styles.logo}
                />
                <Text
                  style={[ styles.teamName, { color: focusedTeam === game.homeTeam.id ? 'green' : 'black' }, ]} > {game.homeTeam.name}
                </Text>
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.scoreInput}
                  placeholder="Ev sahibi"
                  keyboardType="numeric"
                  onFocus={() => setFocusedTeam(game.homeTeam.id)}
                  onBlur={() => setFocusedTeam(null)}
                  onChangeText={(text) => handleScoreChange(game.homeTeam.id, text, true, index)}
                />
                <Text style={styles.vsText}>vs.</Text>
                <TextInput
                  style={styles.scoreInput}
                  placeholder="Deplasman"
                  keyboardType="numeric"
                  onFocus={() => setFocusedTeam(game.awayTeam.id)}
                  onBlur={() => setFocusedTeam(null)}
                  onChangeText={(text) => handleScoreChange(game.awayTeam.id, text, false, index)}
                />
              </View>

              <View style={styles.teamColumn}>
                <Ionicons
                  name={game.awayTeam.logo}
                  size={30}
                  color={focusedTeam === game.awayTeam.id ? 'green' : 'black'}
                  style={styles.logo}
                />
                <Text style={[ styles.teamName,
                    { color: focusedTeam === game.awayTeam.id ? 'green' : 'black' }, ]} >  {game.awayTeam.name}
                </Text>
              </View>

            </View>

          </View>
        ))}

        <TouchableOpacity style={styles.kaydetButton} onPress={handleKaydet}>
           <Text style={styles.kaydetButtonText}>Kaydet</Text>
        </TouchableOpacity>
        
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
  },
  scrollContainer: {    
    padding: 16,
  },
  gameContainer: {
    marginBottom: 16,
    padding: 8,
    borderRadius: 8,
    borderColor: 'green',
    borderWidth: 1,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  dateText: {
    marginRight: 8,
    fontSize: 14,
    color: 'black',
  },
  timeText: {
    fontSize: 14,
    color: 'black',
  },
  teamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamColumn: {
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    marginRight: 8,
  },
  teamName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
  scoreInput: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    textAlign: 'center',
    marginHorizontal: 4,
    width: 60,
  },
  vsText: {
    fontSize: 14,
    marginHorizontal: 8,
  },
  kaydetButton: {
    backgroundColor: 'green',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  kaydetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PredScreen;