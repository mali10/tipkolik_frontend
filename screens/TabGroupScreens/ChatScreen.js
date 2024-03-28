import React, { useState } from 'react';
import { View, Text, SafeAreaView, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

export default function ChatScreen() {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');

    // Temporary function to simulate sending a message
    const sendMessage = () => {
        if (inputText.trim()) {
            // Include a sender name in the message object
            setMessages([...messages, { id: Date.now(), text: inputText, sender: "User Name" }]);
            setInputText('');
        }
    };
    

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {/* ScrollView to display messages */}
            <ScrollView style={styles.messagesContainer}>
    {messages.map((message) => (
        <View key={message.id} style={styles.message}>
            <Text style={styles.sender}>{message.sender}</Text> {/* Display sender's name */}
            <Text style={styles.messageText}>{message.text}</Text> {/* Message text */}
        </View>
        ))}
           </ScrollView>
            {/* Input field and send button */}
            <View style={styles.inputContainer}>
                <TextInput
                    value={inputText}
                    onChangeText={setInputText}
                    style={styles.input}
                    placeholder="Type a message"
                />
                <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                    <Text>Send</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    messagesContainer: {
        padding: 10,
        height: '80%', // Adjust based on your layout
    },
    message: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
    },
    input: {
        flex: 1,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
    },
    sendButton: {
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 10,
    },
    sender: {
        fontWeight: 'bold',
        marginBottom: 5, // Add some space between the sender's name and the message text
    },
    messageText: {
        // Style for the message text if needed
    },
});

