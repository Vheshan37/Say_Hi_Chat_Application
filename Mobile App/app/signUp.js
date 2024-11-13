import { Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import LoadingAnimation from "../components/loadingAnimationIcon";
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import ErrorAlert from "../components/errorAlert";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

SplashScreen.preventAutoHideAsync();

export default function Registration() {

    const [image, setImage] = useState(null);
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

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
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

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

    async function signUp() {
        showLoading();

        const formData = new FormData();
        formData.append("name", name);
        formData.append("mobile", mobile);
        if (image != null) {
            formData.append("image", {
                name: "profileImage.png",
                type: "image/png",
                uri: image
            });
        }

        const response = await fetch(
            "https://sayhi.loca.lt/SayHi/SignUp",
            {
                method: "POST",
                body: formData
            }
        );

        if (response.ok) {
            const json = await response.json();
            if (json.success) {
                router.replace("signIn");
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
            <View style={{ gap: 4 }}>
                <Pressable style={{ justifyContent: 'center', alignItems: 'center' }} onPress={pickImage}>
                    {image ? (
                        <Image source={{ uri: image }} style={styles.profilePic} />
                    ) : (
                        <FontAwesome6 name="circle-user" size={84} color="#212121" style={[styles.profilePic, { textAlign: 'center', textAlignVertical: 'center' }]} />
                    )}
                    <MaterialIcons name="add-a-photo" size={32} color="#0054C2" style={{ position: 'absolute' }} />
                </Pressable>
                <Text style={[styles.textWhite, { opacity: 0.75, fontFamily: loaded ? "PoppinsRegular" : "System" }]}>Profile Picture</Text>
            </View>
            <View style={styles.mainContent}>
                <Text style={[styles.textBlue, styles.title, { fontFamily: loaded ? "Dyna" : "System" }]}>Create New Account</Text>
                <View style={styles.form}>
                    <View style={[styles.inputContainer]}>
                        <Text style={[styles.textWhite, { fontFamily: loaded ? "PoppinsRegular" : "System" }]}>Name</Text>
                        <TextInput style={[styles.nameInput, styles.boxColor]} onChangeText={(text) => setName(text)} />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={[styles.textWhite, { fontFamily: loaded ? "PoppinsRegular" : "System" }]}>Mobile</Text>
                        <View style={[styles.mobileInputContainer, styles.boxColor]}>
                            <Entypo name="dial-pad" size={24} color="#DDDDDD" style={styles.dialPad} />
                            <TextInput style={styles.mobileInput} inputMode="tel" maxLength={10} onChangeText={(text) => setMobile(text)} />
                        </View>
                    </View>
                    <View style={styles.btnContainer}>
                        <TouchableOpacity activeOpacity={0.75} onPress={signUp}>
                            <View style={[styles.nextBtn, styles.bgBlue]}>
                                {loading && <LoadingAnimation />}
                                {!loading && <Text style={[styles.textWhite, styles.signUp, { fontFamily: loaded ? "PoppinsRegular" : "System" }]}>Sign Up</Text>}
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.75} style={{ alignItems: 'center' }} onPress={() => { router.replace("./signIn") }}>
                            <View style={{ opacity: 0.75, flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                                <Text style={[styles.textWhite, styles.signUp, { fontFamily: loaded ? "PoppinsRegular" : "System" }]}>Already have an account? </Text>
                                <Text style={[styles.textBlue, styles.signUp, { fontFamily: loaded ? "PoppinsRegular" : "System" }]}>Log In</Text>
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
        gap: 100,
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
    nameInput: {
        borderColor: '#153C70',
        color: '#ddd',
        borderWidth: 1,
        width: '100%',
        padding: 10,
        borderRadius: 6
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
    profilePic: {
        backgroundColor: '#ddd',
        width: 100,
        height: 100,
        borderRadius: 50,
        objectFit: 'cover',
    },
    signUp: {
        fontSize: 16
    }
});