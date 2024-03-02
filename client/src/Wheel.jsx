import React, { Component } from 'react'
import WheelComponent from 'react-wheel-of-prizes';

export class SpinWheel extends Component {
    constructor(props) {
        super();
        this.props = props;
    }

    render() {
        return (
            <>
                <WheelComponent
                    segments={this.props.segments}
                    segColors={this.props.segColors}
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
} 