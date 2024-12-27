import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from 'expo-status-bar';

SplashScreen.preventAutoHideAsync();

export default function App() {

    const [loadingUser, setLoadingUser] = useState(true);

    const [loaded, error] = useFonts({
        Dyna: require("../assets/fonts/DynaPuff.ttf"),
        PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
        PoppinsMedium: require("../assets/fonts/Poppins-Medium.ttf"),
        PoppinsSemiBold: require("../assets/fonts/Poppins-SemiBold.ttf"),
        PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
    });

    useEffect(() => {
        const checkUser = async () => {
            try {
                const user = await AsyncStorage.getItem("user");
                if (user != null && user !== "") {
                    router.replace("./home");
                    console.log("User found");
                } else {
                    setLoadingUser(false);
                    console.log("User not found");
                }
            } catch (e) {
                console.log(e);
                setLoadingUser(false);
            }
        };

        checkUser();
    }, []);

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (loadingUser) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Image source={require('../assets/appLogo_Hi.png')} style={styles.img} />
            <View style={[styles.mainContent]}>
                <Text style={[styles.textWhite, styles.title, { fontFamily: loaded ? "Dyna" : "System" }]}>Welcome to Say Hi</Text>
                <Text style={[styles.textWhite, styles.subTitle, { fontFamily: loaded ? "PoppinsRegular" : "System", opacity: 0.5 }]}>Conversations that bring us closer</Text>
                <View style={styles.btnContainer}>
                    <TouchableOpacity activeOpacity={0.75} onPress={() => { router.replace("./signIn"); }}>
                        <View style={[styles.signBtn, styles.bgBlue, { gap: 6 }]}>
                            <Text style={[styles.textWhite, { fontFamily: loaded ? "PoppinsMedium" : "System" }]}>Say Hello</Text>
                            <MaterialCommunityIcons name="hand-wave-outline" size={24} color="#fff" />
                        </View>
                    </TouchableOpacity>
                </View>
                
            </View>
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
    },
    mainContent: {
        marginTop: 50,
        alignItems: 'center'
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
    btnContainer: {
        gap: 4,
        marginTop: 20
    },
    signBtn: {
        borderRadius: 25,
        height: 50,
        width: 160,
        fontSize: 18,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    signUp: {
        borderColor: '#0054C2',
        borderWidth: 2
    },
    title: {
        fontSize: 24,
    },
    subTitle: {

    },
    img: {
        maxWidth: '60%',
        objectFit: 'contain'
    }
});