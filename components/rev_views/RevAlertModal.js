import React, {useState} from 'react';
import {View, Text, Modal} from 'react-native';

export const RevAlertModal = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const showModal = () => {
    setModalVisible(true);
    setTimeout(() => setModalVisible(false), 3000);
  };

  return (
    <View>
      <Text onPress={showModal}>Show Pop-up Modal</Text>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <View style={{backgroundColor: 'white', padding: 20}}>
            <Text>This is a pop-up modal</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};
