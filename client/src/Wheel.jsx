import { useEffect, useState } from "react";
import WheelComponent from 'react-wheel-of-prizes';

export function SpinWheel(props) {
    const [winner, setWinner] = useState("");

    const onFinished = (result) => {
        setWinner(result);
    };

    useEffect(() => {
        console.log(winner);
    }, [winner]);

    return (
        <>
            <WheelComponent
                segments={props.segments}
                segColors={props.segColors}
                onFinished={(winner) => onFinished(winner)}
                primaryColor='black'
                contrastColor='white'
                buttonText='Spin'
                isOnlyOnce={false}
                size={290}
                upDuration={100}
                downDuration={1000}
            />
        </>
      )
} 