import { useFonts } from "expo-font";
import AwesomeAlert from "react-native-awesome-alerts";

export default function ErrorAlert({ showAlert, alertMessage, hideSweetAlert }) {

    const [loaded] = useFonts({
        PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
    });

    return (
        <AwesomeAlert
            show={showAlert}
            showProgress={false}
            title="Warning"
            message={alertMessage}
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showCancelButton={false}
            showConfirmButton={true}
            confirmText="OK"
            confirmButtonColor="#0054C2"
            onConfirmPressed={hideSweetAlert}
            contentContainerStyle={{
                backgroundColor: '#0E2644',
                borderColor: '#0A3875',
                borderWidth: 1,
                width: '80%'
            }}
            overlayStyle={{
                backgroundColor: '#0D1B2E',
                opacity: 0.5,

            }}
            titleStyle={{
                color: '#AF2525',
                fontFamily: loaded ? "PoppinsRegular" : "System"
            }}
            messageStyle={{
                fontFamily: loaded ? "PoppinsRegular" : "System"
            }}
            confirmButtonStyle={{ paddingHorizontal: 40, paddingVertical: 10, }}
        />
    )
}