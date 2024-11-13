import { Image, Pressable, StyleSheet, Text, TextInput, TouchableHighlight, View } from "react-native";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import Feather from '@expo/vector-icons/Feather';
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Entypo from '@expo/vector-icons/Entypo';
import Footer from "../components/footer";
import ErrorAlert from "../components/errorAlert";
import { FlashList } from "@shopify/flash-list";
import QBGroupAddIcon from "../components/icons/qbGroupAddIcon";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

export default function Home() {

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [DATA, setDATA] = useState();
    const [userObject, setUserObject] = useState();
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

    let requestSender;
    useEffect(() => {
        const fetchGroup = async () => {
            try {
                const user = await AsyncStorage.getItem("user");
                if (user) {
                    const userJson = JSON.parse(user);
                    setUserObject(userJson);

                    const response = await fetch("https://sayhi.loca.lt/SayHi/GroupChatList?user=" + userJson.id);

                    if (response.ok) {
                        const json = await response.json();
                        console.log(response);
                        setDATA(json);
                    } else {
                        // setAlert("Sync failed. Please reload the app.");
                    }
                }
            } catch (error) {
                setAlert("Error fetching user: " + error.message);
            }
        };

        fetchGroup();
        if (requestSender == null) {
            requestSender = setInterval(fetchGroup, 2000);
        }

        return () => {
            clearInterval(requestSender);
        };
    }, []);

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
        return (
            <TouchableHighlight underlayColor={'#0d1b2e'} style={styles.contactTouchable} onPress={() => {
                // router.push(`./groupInbox?groupID=${encodeURIComponent(item.id)}&&user=${encodeURIComponent(userObject.id)}&hasImage=${item.hasImage}&groupName=${item.group.name}`);
                router.push(`./groupInbox?groupID=${encodeURIComponent(item.group.id)}&userId=${encodeURIComponent(userObject.id)}&hasImage=${item.hasImage}&groupName=${encodeURIComponent(item.group.name)}`);
            }}>
                <View style={styles.contactListItem}>
                    {item.hasImage ?
                        <Image source={{ uri: `${serverDomain}/group_pictures/group(${item.group.id}).png` }} style={styles.contactImage} />
                        :
                        <Text style={[styles.contactImage]}>{item.letterName}</Text>
                    }
                    <View style={styles.contactDetailsContainer}>
                        <View style={styles.contactHeader}>
                            <Text style={[styles.textWhite, { fontSize: 18, fontFamily: loaded ? "PoppinsMedium" : "System", opacity: 0.75 }]} numberOfLines={1}>{item.group.name}</Text>
                            <Text style={[styles.textWhite, { opacity: 0.3 }]}>
                                {item.hasLastMessage ? item.time : null}
                            </Text>
                        </View>
                        <View style={styles.contactFooter}>
                            <Text style={[styles.textWhite, { fontFamily: loaded ? "PoppinsRegular" : "System", opacity: 0.25 }]} numberOfLines={1}>
                                {item.hasLastMessage ? item.message : "No messages"}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
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
                <TouchableHighlight underlayColor={'#0d1b2e'} onPress={() => {
                    router.push(`./createGroup?userID=${userObject.id}`)
                    // router.push(`./addContact?contact=${userString}&userID=${UserObject.id}`)
                }} style={styles.createGroupTouchable}>
                    <View style={styles.createGroup}>
                        <View style={styles.groupIconContainer}>
                            <QBGroupAddIcon color={'rgba(255,255,255,0.8)'} size={32} />
                        </View>
                        <Text style={[styles.textWhite, { fontFamily: loaded ? "PoppinsMedium" : "System" }]}>Create Group</Text>
                    </View>
                </TouchableHighlight>
                <Text style={[styles.textWhite, styles.groupsText, { fontFamily: loaded ? "Dyna" : "System" }]}>Groups</Text>
                <FlashList
                    data={DATA}
                    renderItem={loadContactList}
                    estimatedItemSize={200}
                />
            </View>

            <Footer page={"group"} />
            <StatusBar backgroundColor={'#0A1421'} />
            <ErrorAlert showAlert={showAlert} alertMessage={alertMessage} hideSweetAlert={hideSweetAlert} />
        </View>
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
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    mainContent: {
        flex: 1,
        paddingHorizontal: 15,
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
    contactTouchable: {
        borderRadius: 6
    },
    contactListItem: {
        flexDirection: 'row',
        gap: 10,
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    contactDetailsContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    contactHeader: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        gap: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    contactFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        gap: 10,
    },
    groupIconContainer: {
        backgroundColor: 'rgba(0,84,194,0.2)',
        alignSelf: 'flex-start',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    createGroupTouchable: {
        marginBottom: 10,
    },
    createGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,84,194,0.5)',
        paddingVertical: 10,
    },
    groupsText: {
        paddingHorizontal: 15,
        paddingTop: 10,
        fontSize: 16,
    }
});
