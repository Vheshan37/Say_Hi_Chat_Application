import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import Feather from '@expo/vector-icons/Feather';
import EmptyChat from "../components/emptyChat";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ErrorAlert from "../components/errorAlert";
import Footer from "../components/footer";
import QBDoneAll from "../components/icons/qbDoneAll";
import QBAddContactIcon from "../components/icons/qbAddContactIcon";
import QBDoneIcon from "../components/icons/qbDoneIcon";

SplashScreen.preventAutoHideAsync();

export default function Home() {

    const [loaded, error] = useFonts({
        Dyna: require("../assets/fonts/DynaPuff.ttf"),
        PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
        PoppinsMedium: require("../assets/fonts/Poppins-Medium.ttf"),
        PoppinsSemiBold: require("../assets/fonts/Poppins-SemiBold.ttf"),
        PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
        Dancing: require("../assets/fonts/Dancing.ttf"),
        DancingBold: require("../assets/fonts/Dancing-Bold.ttf"),
    });
    const [DATA, setDATA] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [userObject, setUserObject] = useState();
    const serverDomain = "https://sayhi.loca.lt/SayHi/";

    let requestSender;
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await AsyncStorage.getItem("user");
                if (user != null) {
                    const userJson = JSON.parse(user);
                    setUserObject(userJson);

                    const response = await fetch("https://sayhi.loca.lt/SayHi/HomeChatList?user=" + userJson.id);

                    if (response.ok) {
                        const json = await response.json();
                        setDATA(json.usersList);
                        hideSweetAlert();
                    } else {
                        // setAlert("Sync failed. Please reload the app.");
                    }
                }
            } catch (error) {
                setAlert("Error fetching user: " + error.message);
            }
        };

        fetchUser();
        if (requestSender == null) {
            requestSender = setInterval(fetchUser, 2000);
        }

        return () => {
            clearInterval(requestSender);
        };
    }, []);


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

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.textWhite, styles.appName, { fontFamily: loaded ? "Dancing" : "System" }]}>Say Hi</Text>
                <View style={styles.headerIcons}>
                    <Feather name="search" size={24} color="#fff" />
                    <Feather name="more-vertical" size={24} color="#fff" />
                </View>
            </View>
            <Text style={[styles.textWhite, { paddingHorizontal: 15, paddingTop: 10, paddingBottom: 5, fontFamily: loaded ? "Dyna" : "System", fontSize: 16 }]}>Story</Text>
            <View style={{ flexDirection: 'row', paddingHorizontal: 15, paddingTop: 10, marginBottom: 10 }}>
                <View style={{ alignItems: 'center', gap: 2, borderRightWidth: 1, paddingRight: 10, borderRightColor: '#4A4A4A' }}>
                    <Image source={require('../assets/Girl Profile.jpg')} style={styles.storyImage} />
                    <Text style={[styles.textWhite, { fontFamily: loaded ? "PoppinsRegular" : "System", opacity: 0.6, fontSize: 14 }]}>Your Story</Text>
                </View>
                <ScrollView horizontal={true} style={{ marginLeft: 15 }} contentContainerStyle={{ alignItems: 'center', gap: 15 }} showsHorizontalScrollIndicator={false}>
                    {Array(7).fill(null).map((_, index) => (
                        <View key={index} style={{ alignItems: 'center', gap: 2 }}>
                            <Image source={require('../assets/Girl Profile.jpg')} style={styles.storyImage} />
                            <Text style={[styles.textWhite, { fontFamily: loaded ? "PoppinsRegular" : "System", opacity: 0.6, fontSize: 14 }]}>Name</Text>
                        </View>
                    ))}
                </ScrollView>
            </View>
            <Text style={[styles.textWhite, { paddingHorizontal: 15, paddingTop: 10, fontFamily: loaded ? "Dyna" : "System", fontSize: 16 }]}>Chat</Text>
            {DATA.length != 0 ? <FlatList style={styles.chatList} data={DATA} renderItem={chatListLoader} showsVerticalScrollIndicator={false} /> : <EmptyChat />}
            <Footer page={'home'} />

            <StatusBar backgroundColor={'#0A1421'} />
            <ErrorAlert showAlert={showAlert} alertMessage={alertMessage} hideSweetAlert={hideSweetAlert} />
        </View >
    );

    function chatListLoader({ item }) {
        const chatUserID = userObject.id == item.from.id ? item.to.id : item.from.id;
        const chatUser = userObject.id == item.from.id ? item.to.name : item.from.name;
        const chatUserMobile = userObject.id == item.from.id ? item.to.mobile : item.from.mobile;
        return (
            <TouchableHighlight style={styles.chat} underlayColor={'#0d1b2e'} onPress={() => {
                router.push(`./inbox?chatUserID=${encodeURIComponent(chatUserID)}&chatUser=${encodeURIComponent(chatUser)}&user=${encodeURIComponent(userObject.id)}&hasImage=${item.hasImage}&chatMobile=${chatUserMobile}`);
            }}
            >
                <View style={styles.chatContainer}>
                    {item.hasImage ?
                        <Image source={{ uri: `${serverDomain}/profile_pictures/${chatUserMobile}.png` }} style={styles.chatProfile} />
                        :
                        <Text style={[styles.chatProfile]}>{item.letterName}</Text>
                    }
                    <View style={styles.chatContent}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={[styles.chatName, styles.textWhite, { fontFamily: loaded ? "PoppinsRegular" : "System" }]}>{item.hasRelationship ? item.relativeName : userObject.id == item.from.id ? item.to.mobile : item.from.mobile}</Text>
                            {
                                item.unseenCount != 0 ?
                                    <View style={[styles.bgBlue, { minWidth: 20, height: 20, borderRadius: 10, alignItems: 'center' }]}><Text style={[styles.textWhite, { paddingHorizontal: 3 }]}>{item.unseenCount}</Text></View>
                                    :
                                    null
                            }

                        </View>
                        <View style={[styles.messageTime]}>
                            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', gap: 6 }}>
                                {item.from.id == userObject.id ?
                                    item.status.status == 'Sent' ?
                                        <QBDoneIcon color={'#fff'} size={16} />
                                        :
                                        item.status.status == 'Deliver' ?
                                            <QBDoneAll color={'#fff'} size={16} />
                                            :
                                            <QBDoneAll color={'#0054C2'} size={16} />
                                    :
                                    null
                                }
                                <Text numberOfLines={1} style={[styles.chatMessage, styles.textWhite, { fontFamily: loaded ? "PoppinsRegular" : "System", opacity: 0.6 }]}>{item.message}</Text>
                            </View>
                            <Text style={[styles.chatTime, styles.textWhite, { fontFamily: loaded ? "PoppinsRegular" : "System", opacity: 0.5 }]}>{item.time}</Text>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A1421',
    },
    textWhite: {
        color: '#fff',
    },
    bgBlue: {
        backgroundColor: '#0054C2',
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
    footerNewChat: {
        color: '#0054C2'
    },
    chatList: {
        flex: 1,
        paddingHorizontal: 10,
    },
    chat: {
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderRadius: 6,
    },
    chatContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    chatProfile: {
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
    chatContent: {
        flex: 1,
        justifyContent: 'center',
    },
    messageTime: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 30,
    },
    chatName: {
        fontSize: 18,
    },
    chatMessage: {
        // flex: 1,
    },
    chatTime: {
        fontSize: 12,
        textAlignVertical: 'bottom'
    },
    storyImage: {
        width: 55,
        height: 55,
        borderRadius: 30,
    },
});

