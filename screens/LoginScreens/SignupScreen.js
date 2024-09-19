import React, { useState , useContext } from 'react';
import { StatusBar } from 'expo-status-bar';

// formik
import { Formik } from 'formik';

import {
  StyledContainer,
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
} from '../../components/LoginComponents/styles';

import { View, TouchableOpacity , StyleSheet , ActivityIndicator} from 'react-native';

//colors
const { darkLight, brand, primary } = Colors;

// Datetimepicker library
import DateTimePicker from '@react-native-community/datetimepicker';

// icon
import { Octicons, Ionicons } from '@expo/vector-icons';

// keyboard avoiding view
import KeyboardAvoidingWrapper from '../../components/LoginComponents/KeyboardAvoidingWrapper';

// api client
import axios from 'axios';
import { CURRENT_IP_R } from '@env';

// credentials context
import { CredentialsContext } from '../../components/LoginComponents/CredentialsContext';

const SignupScreen = ({ navigation }) => {

  //for password input
  const [hidePassword, setHidePassword] = useState(true);

  // message to UI
  const [message , setMessage] = useState();
  const [messageType , setMessageType] = useState();

  const [show , setShow] = useState(false);
  const [date , setDate] = useState(new Date(2000, 0, 1));

  // Actual date of birth to be sent
  const [dob, setDob] = useState();

  const { setStoredCredentials } = useContext(CredentialsContext);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
    setDob(currentDate);
  };

  const showDatePicker = () => {
    setShow('date');
  };

  
  const handleSignup = (credentials , setSubmitting) => {

    // to clear previous messages
    handleMessage(null);
 
    const url = `http://${CURRENT_IP_R}:3000/user/signup`;
  
    axios.post(url , credentials).
     then(( response ) => {
      const result = response.data;
      const { message , status , data} = result;

      if ( status !== 'SUCCESS') {
        handleMessage(message , status)
      } else {
        setStoredCredentials(data);
        // handleMessage(message, status);
        navigation.navigate('Welcome' , {...data})
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

  const handleexistingAccount = () => {
    // Navigate to 'Login' back
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <StatusBar style="dark" />
        <InnerContainer>

          <PageTitle> Tipkolik </PageTitle>
          <SubTitle> Yeni Hesap Oluştur </SubTitle>

          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onChange}
              style={{
                backgroundColor: 'yellow',
              }}
            />
          )}

          <Formik
            initialValues={{ name:'' , dateOfBirth:'' ,  email: '', password: '' , confirmPassword: '' }}
            onSubmit={(values , {setSubmitting}) => {
              // dateOfBirth is not an input field, so it should be saved to values like that
              values = { ...values, dateOfBirth: dob };
              if( values.email == '' || 
                  values.password == '' || 
                  values.name == '' || 
                  values.dateOfBirth == '' || 
                  values.confirmPassword == '' ) {
                handleMessage('Please fill all the fields');
                setSubmitting(false) // isSubmitting is false, still able to Login 
              } else if ( values.password !== values.confirmPassword ) {
                handleMessage('Password does not match with confirmed password.');
                setSubmitting(false)
              } else {
                handleSignup( values , setSubmitting);
              }
            }}
          >

            {({ handleChange, handleBlur, handleSubmit, values, isSubmitting }) => (
              <StyledFormArea>
                <MyTextInput
                  label="İsim - Soyisim"
                  placeholder="mabon"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                  keyboardType="email-address"
                  icon="person"
                />
                <MyTextInput
                  label="Email Adresi"
                  placeholder="mabon@gmail.com"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  keyboardType="email-address"
                  icon="mail"
                />
                <MyTextInput
                  label=" Doğum Tarihi "
                  icon="calendar"
                  placeholder="YYYY - MM - DD"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange('dateOfBirth')}
                  onBlur={handleBlur('dateOfBirth')}
                  value={dob ? dob.toDateString() : ''}
                  isDate={true}
                  editable={false}
                  showDatePicker={showDatePicker}
                />
                <MyTextInput
                  label="Şifre"
                  placeholder="* * * * * * * *"
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
                <MyTextInput
                  label="Şifreni Onayla"
                  placeholder="* * * * * * * *"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  value={values.confirmPassword}
                  secureTextEntry={hidePassword}
                  icon="lock"
                  isPassword={true}
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
                />
                
                <MsgBox type={messageType} >{message} </MsgBox>
                
                { !isSubmitting && 
                (<StyledButton onPress={handleSubmit}>
                  <ButtonText> Hesap Oluştur </ButtonText>
                </StyledButton> )
                }

                { isSubmitting && 
                (<StyledButton disabled={true} >
                  <ActivityIndicator size='large' color={primary} />
                </StyledButton> )
                }
                

                <ExtraView>
                  <ExtraText> Hesabın var mı ? </ExtraText>
                  <TextLink onPress={handleexistingAccount}>
                    <TextLinkContent> Giriş Yap </TextLinkContent>
                  </TextLink>
                </ExtraView>


              </StyledFormArea>

              
            )}
          </Formik>
        </InnerContainer>
      </StyledContainer>
    </KeyboardAvoidingWrapper>
  );
};

const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, 
    isDate, showDatePicker, ...props }) => {
  return (
    <View>
      <LeftIcon>
        <Octicons name={icon} size={30} color={brand} />
      </LeftIcon>
      <StyledInputLabel>{label}</StyledInputLabel>
      
      {!isDate && <StyledTextInput { ...props} />}
      {isDate && (
        <View>
          <StyledTextInput {...props} />
          <TouchableOpacity onPress={showDatePicker} style={styles.overlay}>
            
          </TouchableOpacity>
        </View>
      )}
      
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

// to solve the showDatePicker
const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default SignupScreen;