import React from 'react';
import { View, Text, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { teamsData, gamesData } from '../../components/DataComponents/TeamsData';


const TabelaScreen = () => {

  const generateGames = () => {
    const teams = [...teamsData];
    const games = [];
    for (let i = 0; i < gamesData.length; i++) {
      const gameData = gamesData[i];
      const homeTeam = teams.find(team => team.id === gameData.homeTeamId);
      const awayTeam = teams.find(team => team.id === gameData.awayTeamId);
      games.push({ homeTeam, awayTeam, result: gameData.result });
    }
    return games;
  };

  const games = generateGames();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        
        <View style={styles.resultContainer}>
          {games.map((game, index) => (
            <View key={index} style={styles.columnContainer1}>
              <Text style={styles.gameText}>{`${game.homeTeam.nick} vs. ${game.awayTeam.nick}`}</Text>
              <Text style={styles.resultText}>{game.result}</Text>
              <View style={styles.columnContainer2}>
                <Text> Tahminler  </Text>
              </View>
              
              <View style={styles.columnContainer3}>
                
              </View>
            </View>   
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  resultContainer: {
    flexDirection: 'row',
    borderWidth: 0,
    marginVertical: 2,
    marginHorizontal: 2,
  },
  columnContainer1: {
    flex: 1,
    marginRight: 8,
    margin: 10,
    padding: 4,
    borderRadius: 8,
    borderColor: 'green',
    borderWidth: 1,
    //justifyContent: 'center', // Center content horizontally
    alignItems: 'center', // Center content vertically
  },
  columnContainer2: {
    margin: 10,
    padding: 4,
    borderRadius: 8,
    borderColor: 'green',
    borderWidth: 1,
  },
  columnContainer3: {
    margin: 10,
    padding: 4,
    borderRadius: 8,
    borderColor: 'green',
    borderWidth: 1,
    height: 50, // Set a specific height
    width: 50,
  },
  gameText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 12,
    color: 'green',
  },
});

export default TabelaScreen;