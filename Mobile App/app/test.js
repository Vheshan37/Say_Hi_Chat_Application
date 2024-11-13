import AsyncStorage from "@react-native-async-storage/async-storage";

() => {

}

const arrowFunction = () => { };

const user = {
    mobile: "0719892932",
    name: "Vihanga Heshan"
};

const saveUser = async () => {
    await AsyncStorage.setItem("user", user);
}