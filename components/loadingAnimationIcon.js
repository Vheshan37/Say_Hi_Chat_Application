import LottieView from 'lottie-react-native';

export default function LoadingAnimation() {
    return (
        <LottieView
            source={require('../assets/animations/loadingAnimation.json')}
            autoPlay
            loop
            style={{ width: 60, height: 60 }}
            colorFilters={[
                {
                    keypath: "Shape Layer 1",
                    color: "#FFFFFF"
                },
                {
                    keypath: "Shape Layer 2",
                    color: "#FFFFFF"
                },
                {
                    keypath: "Shape Layer 3",
                    color: "#FFFFFF"
                },
                {
                    keypath: "Shape Layer 4",
                    color: "#FFFFFF"
                },
                {
                    keypath: "Shape Layer 5",
                    color: "#FFFFFF"
                }
            ]}
        />
    );
}