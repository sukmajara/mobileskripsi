import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ActiveDeviceButton, ChangeProfileButton, ChangePasswordButton,SignoutButton,CreatePinButton,ChangePinButton } from "../../asset";
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';



const ButtonIconProfile = ({title}) => {

    const navigation = useNavigation();
    const [pin, setpin] = useState(false);

    const Icon = () => {
        if (title === "ChangeProfile") return <ChangeProfileButton style={styles.button} onPress={()=> navigation.navigate('ChangeProfile')} />
        if (title === "ChangePassword") return <ChangePasswordButton style={styles.button} onPress={()=> navigation.navigate('ChangePassword')}/>
        if (title === "ActiveDevice") return <ActiveDeviceButton style={styles.button} onPress={()=> navigation.navigate('ActiveDevice')}/>
        if (title === "Signout") return <SignoutButton style={styles.button} onPress={()=>{
            SecureStore.deleteItemAsync("token");
            navigation.navigate("Login")
        }}/>
        if (pin == false && title === "CreatePinButton" ){
            return <CreatePinButton style={styles.button} onPress={()=> navigation.navigate('Pin')}/>
        }else {
            return <ChangePinButton style={styles.button} onPress={()=> navigation.navigate('PinChange')}/>
        }
        
        return <ChangeProfileButton/>
    }
    
    return (
        <View>
            <TouchableOpacity>
            <Icon style={styles.button}/>
            </TouchableOpacity>
        </View>
    )
}

export default ButtonIconProfile

const styles = StyleSheet.create({
    button :{
        padding:40,
        alignSelf:'center'
    },
})
