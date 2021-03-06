import React, { useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ToastAndroid } from 'react-native'
import { TurnoffFlash, TurnonFlash, BackbuttonWhite, BackButton } from "../../asset";
import { blue_main } from "../../utils/constant";
import { RNCamera } from 'react-native-camera';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

const ScanQRlogin = (props) => {
    const navigation = useNavigation();

    const [onread, setonread] = useState(true)
    const [iconflash, seticonflash] = useState(false)
    const [backbutton, setbackbutton] = useState(false)
    const [flashlight, setflashlight] = useState()
    const [qrerror, setqrerror] = useState("Scan QR for Login")

    const { clientId } = props.route.params.item
    const BackbuttonIcon = () => {
        if (iconflash == true) {
            return <BackbuttonWhite />
        }
        else { return <BackButton /> }
    }

    const Icon = () => {
        if (iconflash == true) {
            return <TurnonFlash />
        }
        else {
            return <TurnoffFlash />
        }
    }

    const scanqr = (qr) => {
        if (onread) {
            setonread(false);
            checkid(qr.data);

        }
    }

    const checkid = async (id) => {
        const TokenJWT = await SecureStore.getItemAsync("token")
        try {
            fetch('https://qrlogku.herokuapp.com/mobile/login', {
            // fetch('http://192.168.0.11:2030/mobile/login', {
                method: 'POST',
                headers: {
                    Accept: '*/*',
                    Authorization: 'Bearer ' + TokenJWT,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    auth: id,
                    clientId: clientId
                })
            })
                .then((response) => {
                    response.json()
                    const status = response.status
                    if (status == 200) {
                        setonread(true)
                        navigation.navigate("Home")
                    }
                    else {
                        setqrerror("QR code not valid or Make sure QR code is for login")
                        setonread(true)

                    }
                })
        } catch (error) {
            console.warn(error)
        }
    }

    return (
        <View style={styles.page}>
            <View style={styles.container}>
                <RNCamera
                    style={styles.preview}
                    type={RNCamera.Constants.Type.back}
                    flashMode={flashlight}
                    androidCameraPermissionOptions={{
                        title: 'Permission to use camera',
                        message: 'We need your permission to use your camera',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                    androidRecordAudioPermissionOptions={{
                        title: 'Permission to use audio recording',
                        message: 'We need your permission to use your audio',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                    onBarCodeRead={(qr) => { scanqr(qr) }}>

                    <View style={styles.button}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <BackbuttonIcon styles={styles.backbutton} onPress={() => setbackbutton(!backbutton)} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.flash} onPress={() => {
                            seticonflash(!iconflash);
                            if (iconflash == true) {
                                setflashlight(RNCamera.Constants.FlashMode.off)
                            }
                            else {
                                setflashlight(RNCamera.Constants.FlashMode.torch)
                            }
                        }}>
                            <Icon />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.scan}>{qrerror}</Text>
                    </View>
                </RNCamera>
            </View>

        </View >
    )
}


export default ScanQRlogin

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'white'
    },

    flash: {
        marginLeft: windowWidth * 0.7,
    },

    container: {
        width: '100%',
        height: '100%',

    },
    preview: {
        width: '100%',
        height: '100%',
    },
    card: {
        backgroundColor: blue_main,
        alignSelf: 'center',
        width: windowWidth,
        height: 200,
        borderRadius: 10,
        marginTop: windowWidth * 1.3
    },
    scan: {
        alignSelf: 'center',
        color: 'white',
        marginTop: 15,
        fontSize: 24
    },
    backbutton: {
    },
    button: {
        flexDirection: 'row',
        marginTop: windowHeight * 0.03,
        marginLeft: windowHeight * 0.02,
    }
})
