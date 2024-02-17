import React, { useContext } from 'react';
import { NavigationContainer} from '@react-navigation/native';
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator} from '@react-navigation/native-stack';

// icon
import { Octicons, Fontisto, Ionicons } from '@expo/vector-icons';

// Screen imports
import LoginScreen from './screens/LoginScreens/LoginScreen';
import SignupScreen from './screens/LoginScreens/SignupScreen';
import WelcomeScreen from './screens/LoginScreens/WelcomeScreen';

import TournamentsScreen from './screens/MainScreens/TournamentsScreen ';

import PredScreen from './screens/TabGroupScreens/PredScreen';
import ChatScreen from './screens/TabGroupScreens/ChatScreen';
import TabelaScreen from './screens/TabGroupScreens/TabelaScreen';
import SettingsScreen from './screens/TabGroupScreens/SettingsScreen';

// credentials context
import { CredentialsContext } from './components/LoginComponents/CredentialsContext';

//colors
import {Colors} from './components/LoginComponents/styles';
const { primary , tertiary} = Colors;

//Tab bottom
const Tab = createBottomTabNavigator();
function TabGroup() {
    return(
            <Tab.Navigator
            //headerShown: false, inside the options
            screenOptions={ ({route , navigation}) => 
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
                })
            }>
                <Tab.Screen name="Tahminler" component={PredScreen}/>
                <Tab.Screen name="Puan Durumu" component={TabelaScreen} options={{headerShown: false , tabBarLabel: "@Puan_Durumu"}} />  
                <Tab.Screen name="Chat" component={ChatScreen}/>
                <Tab.Screen name="Ayarlar" component={SettingsScreen}/>
            </Tab.Navigator>
    )
} 

const bigStack = createNativeStackNavigator(); // big App stack
export default function Navigation() {

  // Here, you could use useContext if you need to access credentials context
  // For this example, it's not directly used but you can include logic based on context here
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
                        <bigStack.Screen name='TurnuvaTabGroup' component={TabGroup}  />
                        
                    </bigStack.Navigator>
            </NavigationContainer>
    );
}