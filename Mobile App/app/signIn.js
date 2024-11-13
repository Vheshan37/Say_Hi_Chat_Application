import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import Entypo from '@expo/vector-icons/Entypo';
import LoadingAnimation from "../components/loadingAnimationIcon";
import ErrorAlert from "../components/errorAlert";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

SplashScreen.preventAutoHideAsync();

export default function SignIn() {

    const [mobile, setMobile] = useState("");
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [loaded, error] = useFonts({
        Dyna: require("../assets/fonts/DynaPuff.ttf"),
        PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
        PoppinsMedium: require("../assets/fonts/Poppins-Medium.ttf"),
        PoppinsSemiBold: require("../assets/fonts/Poppins-SemiBold.ttf"),
        PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    const showLoading = () => {
        setLoading(true);
    }

    const hideLoading = () => {
        setLoading(false);
    }

    const showSweetAlert = () => {
        setShowAlert(true);
    };

    const hideSweetAlert = () => {
        setShowAlert(false);
    };

    function setAlert(message) {
        setAlertMessage(message);
        showSweetAlert();
    }

    async function signIn() {
        showLoading();

        const response = await fetch("https://sayhi.loca.lt/SayHi/SignIn?mobile=" + mobile);
        if (response.ok) {
            const json = await response.json();
            if (json.success) {
                try {
                    await AsyncStorage.setItem("user", JSON.stringify(json.user));
                    console.log("Login complete with saving");
                } catch (error) {
                    setAlert("Login complete without saving");
                    console.log("Login complete without saving");

                }
                router.replace("./home");
            } else {
                setAlert(json.message);
            }
        } else {
            setAlert("Something went wrong! Please try again later. Error Code: " + response.status);
        }

        hideLoading();
    }

    return (
        <View style={styles.container}>
            <Image source={require('../assets/Conversation 2.png')} style={styles.image} />
            <View style={styles.mainContent}>
                <Text style={[styles.textBlue, styles.title, { fontFamily: loaded ? "Dyna" : "System" }]}>Sign In</Text>
                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Text style={[styles.textWhite, { fontFamily: loaded ? "PoppinsRegular" : "System" }]}>Mobile</Text>
                        <View style={[styles.mobileInputContainer, styles.boxColor]}>
                            <Entypo name="dial-pad" size={24} color="#DDDDDD" style={styles.dialPad} />
                            <TextInput
                                style={[styles.mobileInput, { fontFamily: loaded ? "PoppinsRegular" : "System" }]}
                                inputMode="tel"
                                maxLength={10}
                                onChangeText={(text) => setMobile(text)} />
                        </View>
                    </View>
                    <View style={styles.btnContainer}>
                        <TouchableOpacity activeOpacity={0.75} onPress={signIn}>
                            <View style={[styles.nextBtn, styles.bgBlue]}>
                                {loading && <LoadingAnimation />}
                                {!loading && <Text style={[styles.textWhite, styles.signUp, { fontFamily: loaded ? "PoppinsRegular" : "System" }]}>Sign In</Text>}
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.75} style={{ alignItems: 'center' }} onPress={() => { router.replace("./signUp") }}>
                            <View style={{ opacity: 0.75, flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                                <Text style={[styles.textWhite, styles.signUp, { fontFamily: loaded ? "PoppinsRegular" : "System" }]}>Don't have an account? </Text>
                                <Text style={[styles.textBlue, styles.signUp, { fontFamily: loaded ? "PoppinsRegular" : "System" }]}>Sign Up</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <ErrorAlert showAlert={showAlert} alertMessage={alertMessage} hideSweetAlert={hideSweetAlert} />
            <StatusBar backgroundColor={'#0A1421'} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#0A1421',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 50
    },
    mainContent: {
        width: '100%',
        alignItems: 'center',
    },
    textWhite: {
        color: '#fff',
    },
    textBlue: {
        color: '#0054C2'
    },
    bgWhite: {
        backgroundColor: '#fff'
    },
    bgBlue: {
        backgroundColor: '#0054C2'
    },
    title: {
        fontSize: 20,
        marginBottom: 25
    },
    form: {
        width: '80%',
        gap: 8
    },
    inputContainer: {
    },
    mobileInputContainer: {
        borderColor: '#153C70',
        borderWidth: 1,
        width: '100%',
        borderRadius: 6,
        flexDirection: 'row',
        paddingVertical: 10,
        alignItems: 'center'
    },
    mobileInput: {
        flex: 1,
        color: '#ddd'
    },
    dialPad: {
        marginHorizontal: 6
    },
    boxColor: {
        backgroundColor: '#0D1B2E',
    },
    btnContainer: {
        marginTop: 10,
    },
    nextBtn: {
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
    },
    image: {
        maxWidth: '80%',
        maxHeight: 250,
        objectFit: 'contain',
    },
    signUp: {
        fontSize: 16
    }
});