import React , {useContext} from 'react';
import { StatusBar } from 'expo-status-bar';

import {
  PageTitle,
  SubTitle,
  StyledFormArea,
  StyledButton,
  InnerContainer,
  ButtonText,
  Line,
  WelcomeContainer,
  Avatar,
} from '../../components/LoginComponents/styles';


// credentials context
import { CredentialsContext } from '../../components/LoginComponents/CredentialsContext';


const WelcomeScreen = ( {navigation} ) => {

  // credentials context
  const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);
  // Provide a fallback empty object for storedCredentials if it's null
  const { name, email } = storedCredentials || { name: 'User', email: 'user@example.com' };
  
  const handleTournament = () => {
    // Navigate to 'Login' back
    navigation.navigate('Turnuvalar');
  };

  return (
    <>

        <StatusBar style="light" />
        <InnerContainer>
          
          <WelcomeContainer>

            <PageTitle welcome={true}> Tipkolik'e Hoşgeldiniz </PageTitle>
      
            <SubTitle welcome={true}>{ name }</SubTitle>
            <SubTitle welcome={true}>{ email }</SubTitle>

            <StyledFormArea>
                <Avatar resizeMode="cover" source={require('../../assets/img/Login_t.png')}/>
                <Line />

                <StyledButton onPress={handleTournament}>
                  <ButtonText> Turnuva ekranına geçecek </ButtonText>
                </StyledButton>
                
            </StyledFormArea>

          </WelcomeContainer>
        </InnerContainer>

    </>

  );
};

export default WelcomeScreen;