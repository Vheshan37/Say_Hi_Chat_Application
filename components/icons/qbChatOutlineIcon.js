import * as React from "react"
import Svg, { Path } from 'react-native-svg';

export default function QBChatOutlineIcon({ color, size }) {
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
        >
            <Path
                fill={color}
                d="M6.5 13.5h7v-1h-7zm0-3h11v-1h-11zm0-3h11v-1h-11zM3 20.077V4.616q0-.691.463-1.153T4.615 3h14.77q.69 0 1.152.463T21 4.616v10.769q0 .69-.463 1.153T19.385 17H6.077zM5.65 16h13.735q.23 0 .423-.192t.192-.423V4.615q0-.23-.192-.423T19.385 4H4.615q-.23 0-.423.192T4 4.615v13.03zM4 16V4z"
            />
        </Svg>
    );
}