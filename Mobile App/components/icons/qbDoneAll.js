import * as React from "react"
import Svg, { G, Path } from 'react-native-svg';

export default function QBDoneAll({ color, size }) {
    return (

        <Svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
        >
            <G fill="none">
                <Path
                    stroke={color}
                    strokeLinecap="round"
                    strokeWidth={2}
                    d="m2 14 3.233 2.425a1 1 0 0 0 1.374-.167L15 6"
                />
                <Path
                    fill={color}
                    fillRule="evenodd"
                    d="m9.874 15.78 1.729 1.383a2 2 0 0 0 2.797-.295l8.374-10.235a1 1 0 0 0-1.548-1.266L12.852 15.6l-1.711-1.369z"
                    clipRule="evenodd"
                />
            </G>
        </Svg>
    )
}