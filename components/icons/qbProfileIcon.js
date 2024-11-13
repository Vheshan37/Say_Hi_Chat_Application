import * as React from "react"
import Svg, { Circle, G, Path } from 'react-native-svg';

export default function QBProfileIcon({ color, size }) {
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
        >
            <G fill="none" stroke={color}>
                <Path
                    strokeLinejoin="round"
                    d="M4 18a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4 2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"
                />
                <Circle cx={12} cy={7} r={3} />
            </G>
        </Svg>
    );
}
