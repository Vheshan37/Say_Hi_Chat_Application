import { Image, ImageBackground, KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useState } from 'react';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { FlashList } from "@shopify/flash-list";
import EmptyChat from "../components/emptyChat";
import QBDoneIcon from "../components/icons/qbDoneIcon";
import QBDoneAll from "../components/icons/qbDoneAll";

SplashScreen.preventAutoHideAsync();

export default function Inbox() {


    const { chatUserID, chatUser, user, hasImage, chatMobile } = useLocalSearchParams();
    const senderID = chatUserID;
    const senderName = chatUser;
    const userID = user;
    const flashListRef = useRef(null);
    const [isMounted, setIsMounted] = useState(false);
    const [message, setMessage] = useState(null);
    const [isSend, setIsSend] = useState(false);
    const [toEnd, setToEnd] = useState(false);
    const serverDomain = "https://sayhi.loca.lt/SayHi/";
    const [DATA, setDATA] = useState([]);
    const [loaded, error] = useFonts({
        Dyna: require("../assets/fonts/DynaPuff.ttf"),
        PoppinsMedium: require("../assets/fonts/Poppins-Medium.ttf"),
        Dyna: require("../assets/fonts/DynaPuff.ttf"),
        PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
        PoppinsMedium: require("../assets/fonts/Poppins-Medium.ttf"),
        PoppinsSemiBold: require("../assets/fonts/Poppins-SemiBold.ttf"),
        PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
        Dancing: require("../assets/fonts/Dancing.ttf"),
        DancingBold: require("../assets/fonts/Dancing-Bold.ttf"),
    });


    const handleContentSizeChange = () => {
        if (toEnd == false) {
            if (flashListRef.current && isMounted) {
                flashListRef.current.scrollToEnd({ animated: false });
                setToEnd(true);
            }
        }
    };

    const sendMessage = async () => {
        if (!isSend) {
            setIsSend(true);
            const msg = message;
            setMessage(null);
            if (msg && msg.trim() != "") {
                const response = await fetch("https://sayhi.loca.lt/SayHi/SaveMessage?user=" + userID + "&sender=" + senderID + "&message=" + msg);
                if (response.ok) {
                    const json = await response.json();
                    setDATA(json.chatList);
                } else {
                    console.log(response);
                }
            } else {
                // Trying to send an empty message
                console.log("Trying to send an empty message");
            }
            setIsSend(false);
        }
    };

    let requestSender;
    useEffect(() => {
        const fetchInbox = async () => {
            const response = await fetch("https://sayhi.loca.lt/SayHi/InboxChatList?user=" + userID + "&sender=" + senderID);

            if (response.ok) {
                const json = await response.json();
                setDATA(json.chatList);
            } else {
                console.log(response);
            }
        }

        fetchInbox();
        if (requestSender == null) {
            requestSender = setInterval(fetchInbox, 1000);
        }
        setIsMounted(true);

        return () => {
            clearInterval(requestSender);
        };
    }, []);

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    function inboxLoader({ item }) {
        return (
            <View style={[styles.chatContainer, item.from.id == userID ? styles.positionRight : styles.positionLeft]}>
                <Text style={[styles.textWhite, styles.message, { fontFamily: loaded ? "PoppinsRegular" : "System" }]}>{item.message}</Text>
                <View style={{ flexDirection: 'row', alignSelf: 'flex-end', alignItems: 'center', gap: 4 }}>
                    {item.from.id == userID ?
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
                    <Text style={[styles.time, styles.textWhite, { fontFamily: loaded ? "PoppinsRegular" : "System" }]}>{item.time}</Text>
                </View>
                <View style={item.from.id == userID ? styles.chatTailRight : styles.chatTailLeft}></View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Pressable onPress={() => {
                        router.replace("./home");
                    }}>
                        <Entypo name="chevron-left" size={32} color="#fff" style={styles.backIcon} />
                    </Pressable>
                    <View style={styles.profileContainer}>
                        {hasImage ? <Image source={{ uri: `${serverDomain}profile_pictures/${chatMobile}.png` }} style={styles.profileImage} /> : ""}
                        <View>
                            <Text style={[styles.textWhite, styles.userName, { fontFamily: loaded ? "PoppinsMedium" : "System" }]}>{senderName}</Text>
                            <Text style={[styles.textWhite, styles.lastSeen]}>Last seen today at 06:30 AM</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.headerIcons}>
                    <Feather name="more-vertical" size={24} color="#fff" />
                </View>
            </View>

            <ImageBackground source={require('../assets/inbox.jpg')} style={styles.chatListContainer} imageStyle={{ opacity: 0.2, }}>
                {DATA.length == 0 ? <EmptyChat /> : <FlashList
                    ref={flashListRef}
                    renderItem={inboxLoader}
                    data={DATA}
                    estimatedItemSize={200}
                    contentContainerStyle={{
                        paddingHorizontal: 10,
                        paddingTop: 10,
                        paddingBottom: 20
                    }}
                    ItemSeparatorComponent={() => <View style={{ marginVertical: 10 }}></View>}
                    onContentSizeChange={handleContentSizeChange}
                />}
            </ImageBackground>
            <View style={styles.footer}>
                <View style={[styles.boxColor, styles.attachment]}>
                    <Ionicons name="attach-outline" size={32} color="#0046A5" />
                </View>
                <KeyboardAvoidingView style={[styles.boxColor, styles.inputContainer]}>
                    <TextInput
                        style={[styles.input, { fontFamily: loaded ? "PoppinsRegular" : "System" }]}
                        placeholder="Message"
                        placeholderTextColor={'#0C3F85'}
                        onChangeText={(text) => setMessage(text)}
                        value={message}
                    />
                    <Pressable style={[styles.sendIcon, isSend ? styles.sendBtn : null]} onPress={() => {
                        sendMessage()
                    }}>
                        <Ionicons name="send" size={28} color={isSend ? "#fff" : "#0046A5"} />
                    </Pressable>
                </KeyboardAvoidingView>
            </View>
            <StatusBar backgroundColor={'#0A1421'} />
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
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        alignItems: 'center'
    },
    headerContent: {
        flexDirection: 'row',
        gap: 4,
        alignItems: 'center'
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },
    userName: {
        fontSize: 18,
    },
    lastSeen: {
        opacity: 0.6,
    },
    headerIcons: {
        flexDirection: 'row',
        gap: 15
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    profileImage: {
        width: 55,
        height: 55,
        borderRadius: 30
    },
    chatListContainer: {
        flex: 1,
    },
    backIcon: {
        opacity: 0.6
    },
    chatContainer: {
        maxWidth: '80%',
        padding: 10,
        paddingBottom: 5,
        borderRadius: 6,
        gap: 2,
        position: 'relative',
    },
    chatTailLeft: {
        position: 'absolute',
        width: 20,
        height: 20,
        backgroundColor: '#003C8B',
        borderRadius: 2,
        transform: [{ rotateZ: '315deg' }],
        alignSelf: 'center',
        left: -6,
        bottom: 10,
        zIndex: -1,
    },
    chatTailRight: {
        position: 'absolute',
        width: 20,
        height: 20,
        backgroundColor: '#0054C2',
        borderRadius: 2,
        transform: [{ rotateZ: '45deg' }],
        alignSelf: 'center',
        right: -6,
        bottom: 10,
        zIndex: -1
    },
    positionLeft: {
        alignSelf: 'flex-start',
        backgroundColor: '#003C8B',
        marginLeft: 10
    },
    positionRight: {
        alignSelf: 'flex-end',
        backgroundColor: '#0054C2',
        marginRight: 10,
    },
    message: {
        opacity: 0.75
    },
    time: {
        opacity: 0.5,
        fontSize: 12
    },
    boxColor: {
        backgroundColor: 'rgba(0,84,194,0.15)'
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        borderRadius: 30,
        flex: 1,
        paddingLeft: 15,
        paddingRight: 5
    },
    attachment: {
        height: 50,
        width: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        flex: 1,
        color: '#DDDDDD',
        fontSize: 16,
    },
    sendIcon: {
        paddingLeft: 20,
        paddingRight: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    sendBtn: {
        borderRadius: 25,
        height: '80%',
        borderColor: 'white',
        borderWidth: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
    }
});