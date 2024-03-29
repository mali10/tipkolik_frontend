import { StyleSheet } from 'react-native';


// #355E3B -> hunter green 
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
      marginTop: 10 ,
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
      backgroundColor: '#355E3B',
      padding: 10,
      borderRadius: 5,
      width: '30%',
      alignItems: 'center',
    },
    listContainer: {
      width: '70%',
      marginBottom: 6 ,
      height: 140 ,
    },
    playersList: {
      marginBottom: 20,
    },
    playerItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'lightgray',
      padding: 8,
      borderRadius: 5,
      marginBottom: 5,
    },
    deleteButton: {
      alignItems: 'center' ,
      width: '10%' ,
      padding: 2,
      borderRadius: 2,
      backgroundColor: '#355E3B', 
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
      marginBottom: 10,
      marginTop: 20 ,
    },
    leagueButtonsContainer: {
      marginTop: 5,
      marginBottom: 18,
      flexDirection: 'row' ,
    },
    leagueButton: {
      backgroundColor: '#355E3B',
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
      height: 230 ,
      width: '90%',
      padding: 1 , 
      marginTop: 0 ,
    },
    teamItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderWidth:1 ,
      borderBottomColor: '#ccc',
      borderTopColor: '#ccc' ,
      justifyContent: 'space-between' ,
    },
    teamText: {
      marginLeft: 10,
    },
    teamLogo: {
      width: 30,
      height: 30,
      resizeMode: 'contain', // Ensures logo maintains aspect ratio
    },
    buttonText: {
      color: 'black',
      fontWeight: 'bold',
    },
    createTournamentButton: {
      backgroundColor: '#355E3B', // Button background color
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
    tournamentInput: {
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 5,
      padding: 10,
      width: '100%', // Ensure it occupies the full width
      marginBottom: 2, // Space from the next element
      backgroundColor: 'lightgray',
    },
    feedbackText: {
      color: 'red', // Example color for feedback
      marginTop: 4,
      marginBottom: 10 ,
    },
    teamSelectButton: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#dddddd', // Unselected color
        marginLeft: 10,
    },
    teamSelectButtonSelected: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: 'green', // Selected color
        marginLeft: 10,
    },
});

export default styles;