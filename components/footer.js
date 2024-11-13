import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import QBChatOutlineIcon from "./icons/qbChatOutlineIcon";
import QBGroupIcon from "./icons/qbGroupIcon";
import QBProfileIcon from "./icons/qbProfileIcon";
import QBStoryOutlineIcon from "./icons/qbStoryOutlineIcon";
import { useFonts } from "expo-font";
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from "expo-router";
import { useEffect, useState } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Footer({ page }) {


    const [loaded, error] = useFonts({
        PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
    });

    const [userObject, setUserObject] = useState();

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

    const userString = encodeURIComponent(JSON.stringify(userObject));

    return (
        <View style={styles.footer}>
            <View style={styles.footerIconContainer}>
                <TouchableOpacity style={styles.footerIcons} activeOpacity={0.5} onPress={() => { page != "home" ? router.replace('./home') : null }}>
                    <QBChatOutlineIcon color={page == "home" ? '#0054C2' : "#fff"} size={32} />
                    <Text style={[styles.textWhite, styles.footerIconText, { fontFamily: loaded ? "PoppinsRegular" : "System", color: page == "home" ? '#0054C2' : "#fff" }]}>Chats</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerIcons} activeOpacity={0.5} onPress={() => { alert('Go to the Story') }}>
                    <QBStoryOutlineIcon color={'#fff'} size={32} />
                    <Text style={[styles.textWhite, styles.footerIconText, { fontFamily: loaded ? "PoppinsRegular" : "System" }]}>Story</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={[styles.footerActive]} activeOpacity={0.5} onPress={() => { router.push('./contact') }}>
                <AntDesign name="pluscircle" size={54} color={page == "contact" ? "#0054C2" : "#fff"} />
            </TouchableOpacity>
            <View style={styles.footerIconContainer}>
                <TouchableOpacity style={styles.footerIcons} activeOpacity={0.5} onPress={() => { router.push('./group') }}>
                    <QBGroupIcon color={page == "group" ? '#0054C2' : "#fff"} size={32} />
                    <Text style={[styles.textWhite, styles.footerIconText, { fontFamily: loaded ? "PoppinsRegular" : "System" }]}>Group</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerIcons} activeOpacity={0.5} onPress={() => { page != "profile" ? router.push(`./profile?user=${userString}`) : null }}>
                    <QBProfileIcon color={page == "profile" ? '#0054C2' : "#fff"} size={32} />
                    <Text style={[styles.footerIconText, { fontFamily: loaded ? "PoppinsRegular" : "System", color: page == "profile" ? '#0054C2' : "#fff" }]}>Account</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        justifyContent: 'space-evenly',
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
    textWhite: {
        color: 'white'
    }
});