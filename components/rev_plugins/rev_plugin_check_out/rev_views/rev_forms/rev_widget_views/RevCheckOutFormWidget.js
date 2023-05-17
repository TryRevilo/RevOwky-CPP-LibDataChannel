import React, {useState} from 'react';
import {View, TextInput, Button, StyleSheet} from 'react-native';

export const RevCheckOutFormWidget = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCVV] = useState('');

  const handlePayment = () => {
    // Perform payment processing logic here
    console.log('Processing payment...');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Card Number"
        value={cardNumber}
        onChangeText={setCardNumber}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Card Holder Name"
        value={cardHolderName}
        onChangeText={setCardHolderName}
      />
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Expiration Date"
          value={expirationDate}
          onChangeText={setExpirationDate}
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, styles.halfInputLast]}
          placeholder="CVV"
          value={cvv}
          onChangeText={setCVV}
          keyboardType="numeric"
          secureTextEntry
        />
      </View>
      <Button title="Pay Now" onPress={handlePayment} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  input: {
    height: 40,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 1,
    marginRight: 5,
  },
  halfInputLast: {
    flex: 1,
  },
});
