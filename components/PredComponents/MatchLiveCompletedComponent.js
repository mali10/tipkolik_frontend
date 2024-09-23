import React from 'react';
import { View, Text, Image } from 'react-native';

const MatchPredictionLC = ({ team1, team2, matchDate, scoreTeam1, scoreTeam2, matchStatus, matchMinute }) => {
    return (
        <View className="flex-1 items-center justify-center m-2">
            <View className="w-10/11 p-4 border border-gray-400 rounded-lg bg-gray-100 flex-column items-center">
                <View className="flex-row items-center justify-between w-full">
                    <Image source={{ uri: team1.logo }} className="w-10 h-10" />
                    <Text className="font-bold ml-2 text-black">{team1.code}</Text>
                    <Text className="mx-2 w-12 h-8 text-center text-black">{scoreTeam1}</Text>
                    <View className="flex-column items-center">
                        <Text className="text-black mx-1">{matchMinute || 'MS'}</Text>
                        <Text className="text-black mx-1">vs</Text>
                    </View>
                    <Text className="mx-2 w-12 h-8 text-center text-black">{scoreTeam2}</Text>
                    <Text className="font-bold mr-2 text-black">{team2.code}</Text>
                    <Image source={{ uri: team2.logo }} className="w-10 h-10" />
                </View>
                <Text className="text-sm text-center text-gray-600 mt-2 w-full">{matchDate}</Text>
            </View>
        </View>
    );
};

export default MatchPredictionLC;
