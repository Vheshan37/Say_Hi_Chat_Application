import * as React from "react"
import Svg, { Path } from 'react-native-svg';

export default function QBGroupIcon({ color, size }) {
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 36 36"
        >
            <Path
                fill={color}
                d="M17.9 17.3c2.7 0 4.8-2.2 4.8-4.9s-2.2-4.8-4.9-4.8S13 9.8 13 12.4c0 2.7 2.2 4.9 4.9 4.9m-.1-7.7q.15 0 0 0c1.6 0 2.9 1.3 2.9 2.9s-1.3 2.8-2.9 2.8S15 14 15 12.5c0-1.6 1.3-2.9 2.8-2.9"
                className="clr-i-outline clr-i-outline-path-1"
            />
            <Path
                fill={color}
                d="M32.7 16.7c-1.9-1.7-4.4-2.6-7-2.5h-.8q-.3 1.2-.9 2.1c.6-.1 1.1-.1 1.7-.1 1.9-.1 3.8.5 5.3 1.6V25h2v-8z"
                className="clr-i-outline clr-i-outline-path-2"
            />
            <Path
                fill={color}
                d="M23.4 7.8c.5-1.2 1.9-1.8 3.2-1.3 1.2.5 1.8 1.9 1.3 3.2-.4.9-1.3 1.5-2.2 1.5-.2 0-.5 0-.7-.1.1.5.1 1 .1 1.4v.6c.2 0 .4.1.6.1 2.5 0 4.5-2 4.5-4.4 0-2.5-2-4.5-4.4-4.5-1.6 0-3 .8-3.8 2.2.5.3 1 .7 1.4 1.3"
                className="clr-i-outline clr-i-outline-path-3"
            />
            <Path
                fill={color}
                d="M12 16.4q-.6-.9-.9-2.1h-.8c-2.6-.1-5.1.8-7 2.4L3 17v8h2v-7.2c1.6-1.1 3.4-1.7 5.3-1.6.6 0 1.2.1 1.7.2"
                className="clr-i-outline clr-i-outline-path-4"
            />
            <Path
                fill={color}
                d="M10.3 13.1c.2 0 .4 0 .6-.1v-.6c0-.5 0-1 .1-1.4-.2.1-.5.1-.7.1-1.3 0-2.4-1.1-2.4-2.4S9 6.3 10.3 6.3c1 0 1.9.6 2.3 1.5.4-.5 1-1 1.5-1.4-1.3-2.1-4-2.8-6.1-1.5s-2.8 4-1.5 6.1c.8 1.3 2.2 2.1 3.8 2.1"
                className="clr-i-outline clr-i-outline-path-5"
            />
            <Path
                fill={color}
                d="m26.1 22.7-.2-.3c-2-2.2-4.8-3.5-7.8-3.4-3-.1-5.9 1.2-7.9 3.4l-.2.3v7.6c0 .9.7 1.7 1.7 1.7h12.8c.9 0 1.7-.8 1.7-1.7v-7.6zm-2 7.3H12v-6.6c1.6-1.6 3.8-2.4 6.1-2.4 2.2-.1 4.4.8 6 2.4z"
                className="clr-i-outline clr-i-outline-path-6"
            />
            <Path fill="none" d="M0 0h36v36H0z" />
        </Svg>
    );
}
