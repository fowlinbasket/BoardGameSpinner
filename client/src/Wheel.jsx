import React, { Component } from 'react'
import WheelComponent from 'react-wheel-of-prizes';

export function SpinWheel() {
    return (
        <>
            <WheelComponent
                segments={segments}
                segColors={segColors}
                onFinished={winner => console.log(winner)}
                primaryColor='black'
                contrastColor='blue'
                buttonText='Spin'
                isOnlyOnce={false}
                size={290}
                upDuration={0}
                downDuration={300}
            />
        </>
    )
} 