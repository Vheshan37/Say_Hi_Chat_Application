import { Image, Pressable, StyleSheet, Text, TextInput, TouchableHighlight, View } from "react-native";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import Feather from '@expo/vector-icons/Feather';
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Entypo from '@expo/vector-icons/Entypo';
import Footer from "../components/footer";
import ErrorAlert from "../components/errorAlert";
import { FlashList } from "@shopify/flash-list";
import QBMessageIcon from "../components/icons/qbMessageIcon";
import QBAddContactIcon from "../components/icons/qbAddContactIcon";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

export default function Home() {

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const serverDomain = "https://sayhi.loca.lt/SayHi/";
    const [DATA, setDATA] = useState([]);
    const [UserObject, setUserObject] = useState(null);
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
        const fetchUser = async () => {
            try {
                const user = await AsyncStorage.getItem("user");
                if (user) {
                    const userJson = JSON.parse(user);
                    setUserObject(userJson);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchUser();
    }, []);

    let requestSender;
    useEffect(() => {
        const fetchContact = async () => {
            if (UserObject && UserObject.id) {
                const response = await fetch(`https://sayhi.loca.lt/SayHi/ContactList?user=${UserObject.id}`);

                if (response.ok) {
                    const json = await response.json();
                    setDATA(json.usersList);
                } else {
                    console.log(response);
                }
            } else {
                console.log("UserObject is null or id is not available.");
            }
        };

        fetchContact();
        if (requestSender == null) {
            requestSender = setInterval(fetchContact, 2000);
        }

        return () => {
            clearInterval(requestSender);
        };

    }, [UserObject]);

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

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

    const loadContactList = ({ item }) => {

        const userString = encodeURIComponent(JSON.stringify(item));

        return (
            <TouchableHighlight underlayColor={'#0d1b2e'} onPress={() => {
                console.log("New Contact");
            }}>
                <View style={styles.contactContainer}>
                    <View style={styles.contactContentContainer}>
                        {item.hasImage ?
                            (<Image source={{ uri: `${serverDomain}/profile_pictures/${item.user.mobile}.png` }} style={styles.contactImage} />)
                            :
                            (<Text style={styles.contactImage}>{item.letterName}</Text>)
                        }
                        <View>
                            <Text style={[styles.textWhite, styles.contactNumber, { fontFamily: loaded ? "PoppinsSemiBold" : "System" }]}>{item.hasRelationShip ? item.relativeName : item.user.mobile}</Text>
                            <Text style={[styles.textWhite, styles.contactName, { fontFamily: loaded ? "PoppinsRegular" : "System" }]}>{item.hasRelationShip ? item.user.mobile : item.user.name}</Text>
                        </View>
                    </View>
                    <View style={styles.contactIconContainer}>
                        <Pressable onPress={() => {
                            router.push(`./inbox?chatUserID=${encodeURIComponent(item.user.id)}&chatUser=${encodeURIComponent(item.user.name)}&user=${encodeURIComponent(UserObject.id)}`);
                        }} style={{ padding: 10 }}>
                            <QBMessageIcon color={'rgba(255,255,255,0.75)'} size={26} />
                        </Pressable>
                        {item.hasRelationShip ? null : <Pressable onPress={() => {
                            router.push(`./addContact?contact=${userString}&userID=${UserObject.id}`)
                        }} style={{ padding: 10 }}>
                            <QBAddContactIcon color={'rgba(255,255,255,0.75)'} size={26} />
                        </Pressable>}
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Pressable onPress={() => { router.replace("./home") }}>
                        <Entypo name="chevron-left" size={32} color="#fff" style={styles.backIcon} />
                    </Pressable>
                    <Text style={[styles.textWhite, styles.appName, { fontFamily: loaded ? "Dancing" : "System" }]}>Say Hi</Text>
                </View>
                <View style={styles.headerIcons}>
                    <Feather name="more-vertical" size={24} color="#fff" />
                </View>
            </View>

            <View style={styles.mainContent}>

                <TextInput placeholder={"Search here..."} style={styles.searchInput} placeholderTextColor={'#0054C2'} />
                <Text style={[styles.textWhite, { fontFamily: loaded ? "Dyna" : "System", fontSize: 16, paddingVertical: 10, marginTop: 20, }]}>Contacts</Text>
                <FlashList
                    data={DATA}
                    renderItem={loadContactList}
                    estimatedItemSize={200}
                />

            </View>

            <Footer page={"contact"} />
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
    mainContent: {
        flex: 1,
        paddingHorizontal: 15,
        paddingTop: 20
    },
    backIcon: {
        opacity: 0.6,
    },
    contactImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        objectFit: 'cover',
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: 'rgba(0, 84, 194, 0.2)',
        color: '#0054C2',
    },
    contactContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 6
    },
    contactIconContainer: {
        flexDirection: 'row',
        gap: 10
    },
    contactContentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1
    },
    contactNumber: {
        fontSize: 18,
        opacity: 0.75,
    },
    contactName: {
        fontSize: 14,
        opacity: 0.5,
    },
    searchInput: {
        height: 55,
        borderRadius: 30,
        backgroundColor: 'rgba(0,84,194,0.2)',
        paddingHorizontal: 25,
        color: '#0054C2',
        fontSize: 18
    },
});