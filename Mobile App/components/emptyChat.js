import { useFonts } from "expo-font";
import LottieView from "lottie-react-native";
import { Image, StyleSheet, Text, View } from "react-native";

export default function EmptyChat() {

    const [loaded] = useFonts({
        Dyna: require("../assets/fonts/DynaPuff.ttf"),
        PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
        PoppinsMedium: require("../assets/fonts/Poppins-Medium.ttf"),
        PoppinsSemiBold: require("../assets/fonts/Poppins-SemiBold.ttf"),
        PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
    });

    return (
        <View style={styles.emptyContainer}>
            {/* <Image source={require('../assets/Empty Chat.png')} style={styles.emptyImage} /> */}
            <LottieView
                source={require('../assets/animations/messageAnimation-Blue.json')} // Your Lottie file path
                autoPlay
                loop
                style={{
                    // backgroundColor: '#0A1421',
                    width: 200,
                    height: 200,
                    alignSelf: 'center',
                }}
            />
            <Text style={[styles.textBlue, styles.title, { fontFamily: loaded ? "Dyna" : "System" }]}>No chats yet!</Text>
            <Text style={[styles.textBlue, styles.subTitle, { fontFamily: loaded ? "PoppinsMedium" : "System" }]}>Add friends and start chatting!</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textWhite: {
        color: '#fff'
    },
    emptyImage: {
        height: '50%',
        width: '50%',
        opacity: 0.5
    },
    textBlue: {
        color: '#0054C2'
    },
    title: {
        fontSize: 24,
    },
    subTitle: {
        opacity: 0.6,
        fontSize: 16
    }
});