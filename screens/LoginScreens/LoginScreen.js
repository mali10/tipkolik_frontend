import React, { useState,useContext } from 'react';
import { StatusBar } from 'expo-status-bar';

// formik
import { Formik } from 'formik';

import {
  StyledContainer,
  LoginPageLogo,
  PageTitle,
  SubTitle,
  StyledInputLabel,
  StyledFormArea,
  StyledButton,
  StyledTextInput,
  LeftIcon,
  RightIcon,
  InnerContainer,
  ButtonText,
  MsgBox,
  Line,
  ExtraView,
  ExtraText,
  TextLink,
  TextLinkContent,
  Colors,
} from './../../components/LoginComponents/styles';
import { View , ActivityIndicator } from 'react-native';

//colors
const { darkLight, brand, primary } = Colors;

// icon
import { Octicons, Fontisto, Ionicons } from '@expo/vector-icons';

// keyboard avoiding view
import KeyboardAvoidingWrapper from '../../components/LoginComponents/KeyboardAvoidingWrapper';

//API Client
import axios from 'axios';
import { CURRENT_IP_R } from '@env';


// credentials context
import { CredentialsContext } from '../../components/LoginComponents/CredentialsContext';

const LoginScreen = ({ navigation }) => {

  const [hidePassword, setHidePassword] = useState(true);

  const [message , setMessage] = useState();
  const [messageType , setMessageType] = useState();

  // credentials context
  const {setStoredCredentials} = useContext(CredentialsContext);

  const handleLogin = (credentials , setSubmitting) => {

    // to clear previous messages
    handleMessage(null);
    
    //should be updated according to the device and IP
    const url = `http://${CURRENT_IP_R}:3000/user/signin`;

    axios.post(url , credentials).
     then(( response ) => {
      const result = response.data;
      const { message , status , data} = result;

      if ( status !== 'SUCCESS') {
        handleMessage(message , status)
      } else {
      
        const userData = data[0] ? data[0] : data; // Adjust based on your API response structure
        setStoredCredentials(userData); // Optionally set context if needed elsewhere
        navigation.navigate('Welcome' , userData)
      }
      setSubmitting(false);

     })
     .catch(error => {

      //for terminal
      console.log(error); // Log the full error object for debugging purposes

      let errorMessage = "An error occurred while connecting. Check your network and try again.";
      if (error.response && error.response.data && error.response.data.message) {
        // If the server responded with an error message, use it
        errorMessage = error.response.data.message;
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = "No response was received. Check your network and try again.";
      }

      // Update the UI with the appropriate error message
      handleMessage(errorMessage, "ERROR");
      setSubmitting(false);
      
    })
  }

  //default value of type is FAILED
  const handleMessage = ( message, type = 'FAILED') => {
    setMessage(message);
    setMessageType(type);
  }
    
  const handlenewAccount = () => {
      // Navigate to 'Turnuva' with the selected turnuvaName
      navigation.navigate('Signup');
    };

  const forFrontendDev = () => {
    navigation.navigate('Welcome');
  }

    
  console.log(CURRENT_IP_R);

  // values in onSubmit: Inputs for Email and Password
  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>

        <StatusBar style="dark" />
        <InnerContainer>
          <LoginPageLogo resizeMode="cover" source={require('../../assets/img/Login_t.png')} />
          
          <SubTitle> Hesap Girişi </SubTitle>

          <Formik
            initialValues={{ email: '', password: '' }}
            onSubmit={(values , { setSubmitting }) => { 
              if( values.email == '' || values.password == '' ) {
                handleMessage('Please fill all the fields');
                setSubmitting(false) // isSubmitting is false, still able to Login 
              } else {
                handleLogin( values , setSubmitting);
              }
            }} 
          >
            {({ handleChange, handleBlur, handleSubmit, values , isSubmitting }) => (
              <StyledFormArea>
                <MyTextInput
                  label="E-Mail Adresi"
                  placeholder="mabon@gmail.com"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  keyboardType="email-address"
                  icon="mail"
                />
                <MyTextInput
                  label="Şifre"
                  placeholder="* * * * * * * * * *"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  secureTextEntry={hidePassword}
                  icon="lock"
                  isPassword={true}
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
                />
                <MsgBox type={messageType} >{message} </MsgBox>

                { !isSubmitting && 
                (<StyledButton onPress={handleSubmit}>
                  <ButtonText> Giriş Yap </ButtonText>
                </StyledButton> )
                }

                { isSubmitting && 
                (<StyledButton disabled={true} >
                  <ActivityIndicator size='large' color={primary} />
                </StyledButton> )
                }
                
                <Line/>

                <StyledButton google={true} onPress={handleSubmit}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Fontisto name='google' color={primary} size={20} />
                    <ButtonText google={true}> Google ile giriş yap </ButtonText>
                  </View>
                </StyledButton>

                <StyledButton onPress={forFrontendDev} >
                  <ButtonText> ilerle </ButtonText>
                </StyledButton>
              
                <ExtraView>
                  <ExtraText> Henüz hesabın yok mu ? </ExtraText>
                  <TextLink onPress={handlenewAccount}>
                    <TextLinkContent> Hesap Oluştur </TextLinkContent>
                  </TextLink>
                </ExtraView>

              </StyledFormArea>
            )}
          </Formik>
        </InnerContainer>
        <Line></Line>
      </StyledContainer>
    </KeyboardAvoidingWrapper>
  );
};

const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, ...props }) => {
  return (
    <View>
      <LeftIcon>
        <Octicons name={icon} size={30} color={brand} />
      </LeftIcon>
      <StyledInputLabel>{label}</StyledInputLabel>
      <StyledTextInput {...props} />
      {isPassword && ( 
        <RightIcon
          onPress={() => {
            setHidePassword(!hidePassword);
          }}
        >
          <Ionicons name={hidePassword ? 'eye-off-outline' : 'eye-outline'} size={30} color={darkLight} />
        </RightIcon>
      )}
    </View>
  );
};

export default LoginScreen;