import { Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import Feather from '@expo/vector-icons/Feather';
import { router, useLocalSearchParams } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';
import { StatusBar } from "expo-status-bar";
import Entypo from '@expo/vector-icons/Entypo';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Footer from "../components/footer";
import LoadingAnimation from "../components/loadingAnimationIcon";
import ErrorAlert from "../components/errorAlert";
import * as ImagePicker from 'expo-image-picker';

SplashScreen.preventAutoHideAsync();

export default function Home() {

    const { contact, userID } = useLocalSearchParams();
    const [contactData, setContactData] = useState(contact ? JSON.parse(decodeURIComponent(contact)) : {});
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [newName, setNewName] = useState();
    const serverDomain = "https://sayhi.loca.lt/SayHi/";
    const [loaded, error] = useFonts({
        Dyna: require("../assets/fonts/DynaPuff.ttf"),
        PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
        PoppinsMedium: require("../assets/fonts/Poppins-Medium.ttf"),
        PoppinsSemiBold: require("../assets/fonts/Poppins-SemiBold.ttf"),
        PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
        Dancing: require("../assets/fonts/Dancing.ttf"),
        DancingBold: require("../assets/fonts/Dancing-Bold.ttf"),
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

    async function saveContact() {
        if (newName && newName.trim() != "") {
            const response = await fetch(`https://sayhi.loca.lt/SayHi/SaveContact?contact=${contactData.user.id}&name=${newName}&user=${userID}`);
            if (response.ok) {
                const json = await response.json();
                if (json.success) {
                    setNewName("");
                    router.push(`./inbox?chatUserID=${encodeURIComponent(contactData.user.id)}&chatUser=${encodeURIComponent(newName)}&user=${encodeURIComponent(userID)}`);
                } else {
                    console.log(response);
                }
            } else {
                console.log(response);
            }
        } else {
            // Trying to save empty name
            console.log("Trying to save empty name");
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Pressable onPress={() => { router.replace("./contact") }}>
                        <Entypo name="chevron-left" size={32} color="#fff" style={styles.backIcon} />
                    </Pressable>
                    <Text style={[styles.textWhite, styles.appName, { fontFamily: loaded ? "Dancing" : "System" }]}>Say Hi</Text>
                </View>
                <View style={styles.headerIcons}>
                    <Feather name="more-vertical" size={24} color="#fff" />
                </View>
            </View>

            <View style={styles.mainContent}>
                <View style={styles.profileImageContainer}>
                    <View style={styles.profileContainerBox}>
                        {contactData.hasImage ?
                            (<Image source={{ uri: `${serverDomain}/profile_pictures/${contactData.user.mobile}.png` }} style={styles.profileImage} />)
                            :
                            (<Text style={styles.profileImage}>{contactData.letterName}</Text>)
                        }
                    </View>
                    <View style={styles.profileNameContainer}>
                        <Text style={[styles.textWhite, styles.profileName, { fontFamily: loaded ? "PoppinsSemiBold" : "System" }]}>{contactData.user.mobile}</Text>
                    </View>
                    <View>
                        <Text style={[styles.textWhite, styles.profileMobile, { fontFamily: loaded ? "PoppinsRegular" : "System" }]}>{contactData.user.name}</Text>
                    </View>
                </View>
                <View style={styles.nameChangeContainer}>
                    <TextInput style={[styles.nameChangeInput, styles.textBlue]}
                        placeholder={'Nickname'}
                        placeholderTextColor='#0054C2'
                        onChangeText={(text) => { setNewName(text) }}
                        spellCheck={false}
                        value={newName}
                    />
                    <Pressable style={styles.nameChangeButton} onPress={saveContact}>
                        {loading && <LoadingAnimation />}
                        {!loading && <Text style={[styles.textWhite, { fontFamily: loaded ? "PoppinsBold" : "System", fontSize: 16 }]}>Add Contact</Text>}
                    </Pressable>
                </View>
            </View>

            <Footer page={'profile'} />
            <StatusBar backgroundColor={'#0A1421'} />
            <ErrorAlert showAlert={showAlert} alertMessage={alertMessage} hideSweetAlert={hideSweetAlert} />
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A1421',
    },
    textWhite: {
        color: '#fff',
    },
    textBlue: {
        color: '#0054C2'
    },
    header: {
        backgroundColor: '#06101E',
        paddingVertical: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    headerIcons: {
        flexDirection: 'row',
        gap: 15,
    },
    appName: {
        fontSize: 24,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        justifyContent: 'space-evenly'
    },
    footerIconContainer: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-evenly'
    },
    footerIcons: {
        alignItems: 'center',
        opacity: 0.8,
    },
    footerIconText: {
        opacity: 0.6,
        fontSize: 14
    },
    footerActive: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 65,
    },
    mainContent: {
        flex: 1,
    },
    profileImageContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    profileContainerBox: {
        marginBottom: 10
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 48,
        fontWeight: 'bold',
        backgroundColor: 'rgba(0, 84, 194, 0.2)',
        color: '#0054C2',
    },
    profileImageButton: {
        position: 'absolute',
        right: 5,
        bottom: 5,
        paddingLeft: 10,
        paddingTop: 10
    },
    profileName: {
        fontSize: 18
    },
    profileNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        opacity: 0.75,
    },
    profileMobile: {
        opacity: 0.5,
    },
    summeryContainer: {
        flexDirection: 'row',
        gap: 50,
        marginTop: 30
    },
    summeryItem: {
        alignItems: 'center'
    },
    summeryAmount: {
        fontSize: 18,
        opacity: 0.75,
    },
    summeryTitle: {
        opacity: 0.5,
    },
    backIcon: {
        opacity: 0.6
    },
    nameChangeContainer: {
        maxWidth: '90%',
        gap: 10,
        alignSelf: 'center',
        marginTop: 20,
        width: '80%'
    },
    nameChangeInput: {
        padding: 10,
        paddingBottom: 2,
        height: 50,
        backgroundColor: 'rgba(0, 84, 194, 0.1)',
        borderRadius: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#0054C2',
        borderLeftColor: '#0A1421',
        borderRightColor: '#0A1421',
        borderTopColor: '#0A1421',
        borderWidth: 1,
    },
    nameChangeButton: {
        height: 50,
        backgroundColor: '#0054C2',
        borderColor: '#0054C2',
        borderWidth: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
    },
});