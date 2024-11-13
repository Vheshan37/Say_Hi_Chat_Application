import { Image, KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
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
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

SplashScreen.preventAutoHideAsync();

export default function Home() {

    const { user } = useLocalSearchParams();
    const UserObject = user ? JSON.parse(decodeURIComponent(user)) : {};
    const [nameEditor, setNameEditor] = useState(false);
    const [userName, setUserName] = useState(UserObject.name);
    const [newName, setNewName] = useState();
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [image, setImage] = useState(null);
    const serverDomain = "https://sayhi.loca.lt/SayHi/";
    const [userImage, setUserImage] = useState(`${serverDomain}/profile_pictures/${UserObject.mobile}.png?timestamp=${new Date().getTime()}`);
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

    const changeName = async () => {
        showLoading();
        if (newName && newName.trim() != "") {
            const response = await fetch("https://sayhi.loca.lt/SayHi/ChangeName?user=" + UserObject.id + "&name=" + newName);
            if (response.ok) {
                const json = await response.json();
                if (json.success) {
                    UserObject.name = newName;
                    setUserName(newName);
                    setNewName();
                    try {
                        await AsyncStorage.setItem("user", JSON.stringify(UserObject));
                    } catch (error) {
                        setAlert("Name changed without remember option.");
                    }
                } else {
                    setAlert(json.message);
                }
            } else {
                setAlert("Name changing failed.");
            }
        } else { // Trying to change an empty name
            setAlert("Trying to change an empty name");
        }
        hideLoading();
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);

            const formData = new FormData();
            formData.append("mobile", UserObject.mobile);
            formData.append("image", {
                name: "profileImage.png",
                type: "image/png",
                uri: result.assets[0].uri
            });

            const response = await fetch(
                "https://sayhi.loca.lt/SayHi/ChangeImage",
                {
                    method: "POST",
                    body: formData
                }
            );

            if (response.ok) {
                const json = await response.json();
                console.log(json);
                if (json.success) {
                    // Set new image to the profile & Change Async Storage data
                    UserObject.hasImage = true;
                    setUserImage(`${serverDomain}/profile_pictures/${UserObject.mobile}.png?timestamp=${new Date().getTime()}`);
                    try {
                        await AsyncStorage.setItem("user", JSON.stringify(UserObject));
                        console.log("Data synchronized.");
                    } catch (error) {
                        setAlert("Profile changed without remember option.");
                    }
                } else {
                    setAlert(json.message);
                }
            } else {
                setAlert("Something went wrong! Please try again later. Error Code: " + response.status);
            }

        }
    };

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

            <View style={[styles.mainContent, { justifyContent: 'space-between', flexGrow: 1, }]}>
                <KeyboardAvoidingView enabled={false}>
                    <View style={styles.profileImageContainer}>
                        <View style={styles.profileContainerBox}>
                            {image ?
                                (<Image source={{ uri: image }} style={styles.profileImage} />)
                                :
                                UserObject.hasImage ?
                                    (<Image source={{ uri: userImage }} style={styles.profileImage} />)
                                    :
                                    (<Text style={styles.profileImage}>{UserObject.letterName}</Text>)
                            }
                            <AntDesign name="pluscircle" size={24} color="#0054C2" style={[styles.profileImageButton]} onPress={pickImage} />
                        </View>
                        <View style={styles.profileNameContainer}>
                            <Text style={[styles.textWhite, styles.profileName, { fontFamily: loaded ? "PoppinsSemiBold" : "System" }]}>{userName}</Text>
                            <Feather name="edit-2" size={18} color="#fff" onPress={() => {
                                if (nameEditor) {
                                    setNameEditor(false);
                                } else {
                                    setNameEditor(true);
                                }
                            }} style={{ paddingHorizontal: 10 }} />
                        </View>
                        <View>
                            <Text style={[styles.textWhite, styles.profileMobile, { fontFamily: loaded ? "PoppinsRegular" : "System" }]}>{UserObject.mobile}</Text>
                        </View>
                        <View style={[styles.summeryContainer]}>
                            <View style={styles.summeryItem}>
                                <Text style={[styles.summeryAmount, styles.textWhite, { fontFamily: loaded ? "PoppinsBold" : "System" }]}>120</Text>
                                <Text style={[styles.summeryTitle, styles.textWhite, { fontFamily: loaded ? "PoppinsRegular" : "System" }]}>Friends</Text>
                            </View>
                            <View style={styles.summeryItem}>
                                <Text style={[styles.summeryAmount, styles.textWhite, { fontFamily: loaded ? "PoppinsBold" : "System" }]}>1K</Text>
                                <Text style={[styles.summeryTitle, styles.textWhite, { fontFamily: loaded ? "PoppinsRegular" : "System" }]}>Posts</Text>
                            </View>
                            <View style={styles.summeryItem}>
                                <Text style={[styles.summeryAmount, styles.textWhite, { fontFamily: loaded ? "PoppinsBold" : "System" }]}>3K</Text>
                                <Text style={[styles.summeryTitle, styles.textWhite, { fontFamily: loaded ? "PoppinsRegular" : "System" }]}>Likes</Text>
                            </View>
                        </View>
                    </View>
                    {nameEditor ? <View style={styles.nameChangeContainer}>
                        <TextInput style={[styles.nameChangeInput, styles.textBlue]}
                            placeholder={userName}
                            placeholderTextColor='#0054C2'
                            onChangeText={(text) => { setNewName(text) }}
                            spellCheck={false}
                        />
                        <Pressable style={styles.nameChangeButton} onPress={changeName}>
                            {loading && <LoadingAnimation />}
                            {!loading && <Text style={styles.textBlue}>Change</Text>}
                        </Pressable>
                    </View> : null}
                    <Pressable onPress={async () => {
                        await AsyncStorage.removeItem("user");
                        router.replace("./signIn");
                    }} style={[styles.logoutButton, { marginTop: 20, marginHorizontal: 20 }]}>
                        <MaterialCommunityIcons name="logout" size={24} color="#ff0000" />
                        <Text style={styles.logoutText}>Logout</Text>
                    </Pressable>
                </KeyboardAvoidingView>
                <Footer page={'profile'} />
            </View>
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
        flexDirection: 'row',
        maxWidth: '90%',
        gap: 10,
        alignSelf: 'center',
        marginTop: 20
    },
    nameChangeInput: {
        flex: 1,
        padding: 10,
        paddingBottom: 2,
        height: 40,
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
        height: 40,
        backgroundColor: 'rgba(0, 84, 194, 0.1)',
        borderColor: '#0054C2',
        borderWidth: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6
    },
    logoutButton: {
        backgroundColor: 'rgba(255,0,0,0.25)',
        borderColor: '#ff0000',
        borderWidth: 1,
        padding: 12,
        borderRadius: 6,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 4
    },
    logoutText: {
        color: '#ff0000',
        fontSize: 16
    }
});