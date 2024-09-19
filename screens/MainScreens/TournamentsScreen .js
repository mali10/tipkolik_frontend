import React, { useState , useEffect, useContext} from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  TextInput,
  View,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
  Alert
} from 'react-native';

import axios from 'axios';
import { CURRENT_IP_R } from '@env';
import { CredentialsContext } from '../../components/LoginComponents/CredentialsContext';

const TournamentsScreen = ({navigation}) => {

  const [tournamentNames, setTournamentNames] = useState([]);
  const { storedCredentials } = useContext(CredentialsContext);
  const defaultCredentials = { name: 'Creator', email: 'creator@example.com' };
  // Admin
  const { name: creatorName } = storedCredentials || defaultCredentials;
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (creatorName) {
      fetchUserTournaments(creatorName);
    }
  }, [creatorName]);

  const fetchUserTournaments = async () => {

    if (!creatorName) {
      Alert.alert("Error", "No user is signed in the app.");
      return;
    }

    setLoading(true);
    const apiUrl = `http://${CURRENT_IP_R}:3000/tournament/tournaments-list?name=${encodeURIComponent(creatorName.toLowerCase())}`;
    
    try {
      const response = await axios.get(apiUrl);
      setLoading(false);

      if (response.status === 200 && response.data.length > 0) {
        setTournamentNames(response.data);
      } else if (response.status === 200 && response.data.length === 0) {
        Alert.alert("No Tournaments", "No tournaments found for this user.");
      }
    } catch (error) {
      setLoading(false);
      if (error.response) {
        // Server responded with a status outside the 2xx range
        if (error.response.status === 404) {
          Alert.alert("User Not Found", error.response.data.message);
        } else if (error.response.status === 400) {
          Alert.alert("Error", "User name is required.");
        } else if (error.response.status === 204) {
          Alert.alert("No Tournaments", "No tournaments found for this user.");
        } else {
          Alert.alert("Error", error.response.data.message);
        }
      } else if (error.request) {
        // The request was made but no response was received
        Alert.alert("Network Error", "Could not receive a response from the server. Please check your network connection.");
      } else {
        // Something else happened in making the request that triggered an error
        Alert.alert("Error", "An error occurred. Please try again later.");
      }
    } 
};

  const handleSelectTournament = (selectedTournament) => {
    navigation.navigate('TurnuvaTabGroup', {
      screen: 'Tahminler',
      params: {
          screen: 'Upcoming',
          params: {
              tournamentName: selectedTournament,
          },
      },
  });
  };


  console.log(CURRENT_IP_R)
  console.log(creatorName)
  console.log("On Tournament Screen available")

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView className="flex-1 justify-around p-5">
      
       <Text className="text-center text-lg font-bold text-gray-800 mb-2.5">{creatorName}'ın Turnuvaları</Text>

        {/* First Area - Active Tournaments */}
        <View className="w-full mb-5">
            <Text className="text-center text-2xl font-bold text-gray-800 mb-2.5">Turnuvaların</Text>
              <FlatList
                data={tournamentNames}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                <TouchableOpacity
                    className="items-center bg-green-900 rounded-lg px-5 py-3.5 my-1.5 mx-auto w-4/5"
                    onPress={() => handleSelectTournament(item)}
                >
                    <Text className="text-white font-bold">{item}</Text>
                </TouchableOpacity>
                )}
              />
        </View>

        {/* Separator */}
        <View className="border-b-2 border-gray-300 my-5 self-center w-11/12" />

        {/* Second Area - General Tournaments */}
        <View className="w-full mb-5">
          <Text className="text-center text-2xl font-bold text-gray-800 mb-2.5">Tıkla & Tahmine Başla</Text>
        
        </View>

        {/* Separator */}
        <View className="border-b-2 border-gray-300 my-5 self-center w-11/12" />

        {/* Third Area - Join/Create Tournaments */}
        <View className="w-full mb-5">
          {/* Join Tournament Button */}
          <TouchableOpacity onPress={() => navigation.navigate('TurnuvaTabGroup')} className="items-center bg-green-900 rounded-lg px-5 py-3.5 my-1.5 mx-auto w-4/5">
            <Text className="text-white font-bold">Turnuvaya gir</Text>
          </TouchableOpacity>
          <TextInput
            className="border border-gray-800 bg-white rounded-lg p-2.5 my-1.5 mx-auto w-4/5"
            placeholder="Code"
          />

          {/* Create Tournament Button */}
          <TouchableOpacity onPress={() => navigation.navigate('TurnuvaCreating')} className="items-center bg-green-900 rounded-lg px-5 py-3.5 my-1.5 mx-auto w-4/5">
            <Text className="text-white font-bold">Yeni turnuva oluştur</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default TournamentsScreen;
