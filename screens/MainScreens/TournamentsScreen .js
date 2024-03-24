import React, { useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, TextInput, View, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';


const TournamentsScreen = ({navigation}) => {
  
  const handleTurnuvaClick = (turnuvaName) => {
    // Navigate to 'Turnuva' with the selected turnuvaName
    navigation.navigate('TurnuvaTabGroup');
  };

  const handleJoinTurnuva = () => {
    // Handle joining a turnuva with the provided code
    // Implement your logic here
    //console.log(`Joining Turnuva with code: ${turnuvaCode}`);
  };

  const handleCreateTurnuva = () => {
    // Navigate to the screen for creating a new turnuva
    navigation.navigate('TurnuvaCreating');

  };

  const handleGeneralTurnuva = () => {
    // Navigate to the general turnuva screen
    //navigation.navigate('GeneralTurnuva');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <View style={styles.turnuvaList}>
          {/* Removed username part as per requirement */}
          <TouchableOpacity onPress={handleTurnuvaClick} style={styles.turnuvaButton}>
            <Text style={styles.buttonText}>Süper Lig</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleTurnuvaClick} style={styles.turnuvaButton}>
            <Text style={styles.buttonText}>Premier Lig</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleTurnuvaClick} style={styles.turnuvaButton}>
            <Text style={styles.buttonText}>Serie B</Text>
          </TouchableOpacity>
          {/* You can add more tournaments as needed */}
        </View>

        <View style={styles.bottomOptions}>
          <View style={styles.optionContainer}>
            <TouchableOpacity onPress={handleJoinTurnuva} style={styles.bottomButton}>
              <Text style={styles.buttonText}>Turnuvaya gir</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.codeInput}
              placeholder="Code"
            />
          </View>

          <View style={styles.optionContainer}>
            <TouchableOpacity onPress={handleCreateTurnuva} style={styles.bottomButton}>
              <Text style={styles.buttonText}>Yeni turnuva oluştur</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.optionContainer}>
            <TouchableOpacity onPress={handleGeneralTurnuva} style={styles.bottomButton}>
              <Text style={styles.buttonText}>Genel Turnuvalar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

// Styles remain unchanged
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  turnuvaTitlesList: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  turnuvaList: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: 20,
    flex: 1,
    width: '90%',
    alignItems: 'center',
  },
  turnuvaButton: {
    marginVertical: 5,
    paddingVertical: 15,
    backgroundColor: 'gray',
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  bottomOptions: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '80%',
    flex: 1,
  },
  optionContainer: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  codeInput: {
    borderWidth: 1,
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    width: '100%',
  },
  bottomButton: {
    padding: 10,
    backgroundColor: 'green',
    borderRadius: 8,
    width: '100%',
    alignItems: 'center'
  },
});

export default TournamentsScreen;