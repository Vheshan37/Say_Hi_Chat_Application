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

    const { userID } = useLocalSearchParams();

    const [image, setImage] = useState(null);
    const [groupName, setGroupName] = useState();
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
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

    const pickImage = async () => {

        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            setAlert('Permission to access camera roll is required!');
            return;
        }


        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const createGroup = async () => {
        showLoading();
        if (groupName && groupName.trim() != "") {

            const formData = new FormData();
            formData.append("name", groupName);
            formData.append("user", userID);
            if (image != null) {
                formData.append("image", {
                    name: "profileImage.png",
                    type: "image/png",
                    uri: image
                });
            }

            const response = await fetch(
                "https://sayhi.loca.lt/SayHi/CreateGroup",
                {
                    method: "POST",
                    body: formData
                }
            );

            if (response.ok) {
                const json = await response.json();
                if (json.success) {
                    setAlert("Group Registration Complete");
                    console.log("hasImage: " + json.hasImage);
                    router.push(`./groupInbox?groupID=${encodeURIComponent(json.groupID)}&userId=${encodeURIComponent(userID)}&hasImage=${json.hasImage}&groupName=${encodeURIComponent(groupName)}`);
                    setGroupName("");
                } else {
                    console.log(response);
                }
            } else {
                console.log(response);
            }
        } else {
            setAlert("Please fill your group name.");
        }
        hideLoading();
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Pressable onPress={() => { router.replace("./group") }}>
                        <Entypo name="chevron-left" size={32} color="#fff" style={styles.backIcon} />
                    </Pressable>
                    <Text style={[styles.textWhite, styles.appName, { fontFamily: loaded ? "Dancing" : "System" }]}>Say Hi</Text>
                </View>
                <View style={styles.headerIcons}>
                    <Feather name="more-vertical" size={24} color="#fff" />
                </View>
            </View>

            <View style={styles.mainContent}>
                <Text style={[styles.textWhite, styles.pageTitle, { fontFamily: loaded ? "PoppinsSemiBold" : "System" }]}>Create new group</Text>
                <Text style={[styles.textWhite, styles.pageSubTitle, { fontFamily: loaded ? "PoppinsRegular" : "System" }]}>Where Connections Become Conversations.</Text>
                <View style={styles.profileImageContainer}>
                    <View style={styles.profileContainerBox}>
                        <View style={styles.profileContainerBox}>
                            {image ?
                                (<Image source={{ uri: image }} style={styles.profileImage} />)
                                :
                                (<Image source={require('../assets/group concept illustration.png')} style={styles.profileImage} />)
                            }
                            <AntDesign name="pluscircle" size={24} color="#0054C2" style={[styles.profileImageButton]} onPress={() => { pickImage() }} />
                        </View>
                    </View>
                </View>
                <View style={styles.nameChangeContainer}>
                    <TextInput style={[styles.nameChangeInput, styles.textBlue]}
                        placeholder={'Group Name'}
                        placeholderTextColor='#0054C2'
                        onChangeText={(text) => { setGroupName(text) }}
                        spellCheck={false}
                        value={groupName}
                    />
                    <Pressable style={styles.nameChangeButton} onPress={createGroup}>
                        {loading && <LoadingAnimation />}
                        {!loading && <Text style={[styles.textWhite, { fontFamily: loaded ? "PoppinsBold" : "System", fontSize: 16 }]}>Create</Text>}
                    </Pressable>
                </View>
            </View>

            <Footer page={"group"} />
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
        alignItems: 'center',
        paddingTop: 40
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
        backgroundColor: 'rgba(0, 84, 194, 0.4)',
        // backgroundColor: '#fff',
        color: '#0054C2',
    },
    profileImageButton: {
        position: 'absolute',
        right: 5,
        bottom: 5,
        paddingLeft: 10,
        paddingTop: 10,
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
    pageTitle: {
        opacity: 0.75,
        fontSize: 20
    },
    pageSubTitle: {
        opacity: 0.5,
        fontSize: 14
    }
});