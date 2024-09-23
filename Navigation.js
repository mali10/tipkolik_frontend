import React, { useContext } from 'react';
import { NavigationContainer} from '@react-navigation/native';
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createNativeStackNavigator} from '@react-navigation/native-stack';

// icon
import { Octicons, Fontisto, Ionicons } from '@expo/vector-icons';

import LoginScreen from './screens/LoginScreens/LoginScreen';
import SignupScreen from './screens/LoginScreens/SignupScreen';
import WelcomeScreen from './screens/LoginScreens/WelcomeScreen';

import TournamentsScreen from './screens/MainScreens/TournamentsScreen ';
import CreateTournamentScreen from './screens/MainScreens/CreateTournamentScreen';

import UpcomingGamesScreen from './screens/TabGroupScreens/PredScreen/UpcomingGamesScreen';
import LiveGamesScreen from './screens/TabGroupScreens/PredScreen/LiveGamesScreen';
import CompletedGamesScreen from './screens/TabGroupScreens/PredScreen/CompletedGamesScreen';

import ChatScreen from './screens/TabGroupScreens/ChatScreen';
import TabelaScreen from './screens/TabGroupScreens/TabelaScreen';
import SettingsScreen from './screens/TabGroupScreens/SettingsScreen';

import { CredentialsContext } from './components/LoginComponents/CredentialsContext';

import {Colors} from './components/LoginComponents/styles';

const { primary , tertiary} = Colors;

const TopTab = createMaterialTopTabNavigator();

// top Tab
function PredTabGroup() {

    return (
        <TopTab.Navigator
          initialRouteName="Upcoming"

          screenOptions={{
            lazy: true,
            tabBarLabelStyle: { fontSize: 12 },
            tabBarStyle: { backgroundColor: 'white' },
            tabBarIndicatorStyle: { backgroundColor: 'green' },
          }}
        >
          <Tab.Screen name="Upcoming" component={UpcomingGamesScreen} />
          <Tab.Screen name="Live" component={LiveGamesScreen} />
          <Tab.Screen name="Completed" component={CompletedGamesScreen} />
        </TopTab.Navigator>
      );

}

//bottom Tab
const Tab = createBottomTabNavigator();
function TabGroup() {
    return(
        <Tab.Navigator
            screenOptions={ ({route}) => 
                ({
                    tabBarIcon: ({color , focused , size}) => {
                        let iconName;
                        if (route.name === "Tahminler") {
                            iconName = focused ? "home" : "home-outline";
                        }
                        else if (route.name === "Puan Durumu") {
                            iconName = focused ? "football" : "football-outline";
                        }
                        else if (route.name === "Chat") {
                            iconName = focused ? "chatbox-ellipses" : "chatbox-ellipses-outline";
                        }
                        else if (route.name === "Ayarlar") {
                            iconName = focused ? "settings" : "settings-outline";
                        }
                        return <Ionicons name={iconName} size={size} color={color} />
                    },
                    tabBarStyle: {
                        backgroundColor: "white"
                    } ,
                    tabBarActiveTintColor: "black",
                    tabBarInactiveTintColor: "black" , 
                    headerShown: false,
                })
            }>
                <Tab.Screen name="Tahminler" component={PredTabGroup}/>
                <Tab.Screen name="Puan Durumu" component={TabelaScreen} options={{headerShown: false , tabBarLabel: "@Puan_Durumu"}} />  
                <Tab.Screen name="Chat" component={ChatScreen}/>
                <Tab.Screen name="Ayarlar" component={SettingsScreen}/>
        </Tab.Navigator>
    )
} 



const bigStack = createNativeStackNavigator(); 
export default function Navigation() {

  const { storedCredentials } = useContext(CredentialsContext);

    return (
            <NavigationContainer>
                    <bigStack.Navigator /* initialRouteName="Login" headerMode="none" */
                        screenOptions={{
                            headerStyle:{
                                backgroundColor: 'darkgreen' , 
                            
                            },
                            headerTintColor: 'white', 
                            headerBackTitleVisible: false ,
                            headerTransparent: false, // Header above everything
                            headerTitle: 'tipkolik' , 
                            headerTitleStyle: {
                                fontWeight: 'bold', 
                                fontSize: 28, 
                                color: 'white',
                            },
                            
                        }}
                        initialRouteName="Login"
                    >
                        <bigStack.Screen name='Login' component={LoginScreen} />
                        <bigStack.Screen name='Signup' component={SignupScreen} />
                        <bigStack.Screen name='Welcome' component={WelcomeScreen} />
                        <bigStack.Screen name='Turnuvalar' component={TournamentsScreen} />
                        <bigStack.Screen name='TurnuvaCreating' component={CreateTournamentScreen} />
                        <bigStack.Screen name='TurnuvaTabGroup' component={TabGroup}  />
                        <bigStack.Screen name='PredTabGroup' component={PredTabGroup}  />
                        
                    </bigStack.Navigator>
            </NavigationContainer>
    );
}