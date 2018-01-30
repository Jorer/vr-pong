import React from "react";
import {
  AmbientLight,
  PointLight,
  Animated,
  AppRegistry,
  asset,
  CylindricalPanel,
  Image,
  Model,
  Pano,
  Text,
  View,
  VrHeadModel
} from "react-vr";

const MAX_TEXTURE_WIDTH = 4096;
const MAX_TEXTURE_HEIGHT = 720;
const degreesToPixels = degrees => -(degrees / 360) * MAX_TEXTURE_WIDTH;
const PPM = 1 / (2 * Math.PI * 3) * MAX_TEXTURE_WIDTH;
const AnimatedModel = Animated.createAnimatedComponent(Model);

//game
const FIELD_WIDTH = 860;
const FIELD_HEIGHT = 500;
const VELOCITY_INCREMENT = 0.2;
const BAR_SPEED = 6;
const BAR_HEIGHT = 200;
const BAR_WIDTH = 30;
const BALL_SIZE = 30;

const faceNeutral = asset("neutral.svg");
const faceTroll = asset("troll.jpg");
const faceLenny = asset("lenny.jpg");

export default class VR extends React.Component {
  state = {
    planetRotation: new Animated.Value(0),
    rotation: [0, 0, 0],
    aiBar: {},
    ball: {
      x: 0,
      y: 0,
      velX: 1,
      velY: 5
    }
    //playerBar: {}
  };
  componentDidMount() {
    let intervalId = setInterval(this.gameTick, 16);
    this.setState({
      intervalId
    });
    this.rotate();
  }

  handleKeyEvent = e => {
    this.setState({
      keyCode: e.keyCode
    });
  };
  handleKeyEvent = e => {
    this.setState({
      keyCode: null
    });
  };

  trigger = e => {
    console.log("trigger", e);
  };

  gameTick = () => {
    let { ball } = this.state;
    ball.x += ball.velX;
    ball.y += ball.velY;

    if (ball.y - +BALL_SIZE / 2 < -FIELD_HEIGHT / 2 && ball.velY < 0) {
      ball.velY = -ball.velY;
    }
    if (ball.y + BALL_SIZE / 2 > FIELD_HEIGHT / 2 && ball.velY > 0) {
      ball.velY = -ball.velY;
    }

    if (ball.x > FIELD_WIDTH / 2) this.reset();
    else if (ball.x < -FIELD_WIDTH / 2) this.reset();

    console.log(ball);

    this.setState({
      rotation: VrHeadModel.rotation(),
      ball
    });
  };

  reset = () => {
    let { aiBar, ball } = this.state;
    ball.x = ball.y = 0;

    this.setState({
      aiBar,
      ball
    });
  };

  rotate = () => {
    this.state.planetRotation.setValue(0);
    Animated.timing(this.state.planetRotation, {
      toValue: 360,
      duration: 20000
    }).start(this.rotate);
  };

  render() {
    const { rotation, ball } = this.state;
    const rotationYMax = 150;
    const aiBarY = 0;
    let playerBarY = rotation[0] * 10;
    //console.log(rotation[0], playerBarY);
    if (playerBarY > rotationYMax) playerBarY = rotationYMax;
    else if (playerBarY < -rotationYMax) playerBarY = -rotationYMax;

    return (
      <View onKeyPress={this.trigger}>
        <Pano source={asset("matrix.png")} />
        <CylindricalPanel
          layer={{
            width: MAX_TEXTURE_WIDTH,
            height: MAX_TEXTURE_HEIGHT,
            density: MAX_TEXTURE_WIDTH
          }}
          style={{
            position: "absolute"
          }}
        >
          <View
            style={{
              // View covering the cylinder. Center so contents appear in middle of cylinder.
              alignItems: "center",
              justifyContent: "center",
              width: MAX_TEXTURE_WIDTH,
              height: MAX_TEXTURE_HEIGHT
            }}
          >
            <View>
              <AmbientLight intensity={1.6} />
              <AnimatedModel
                source={{
                  obj: asset("earth/earth.obj"),
                  mtl: asset("earth/earth.mtl")
                }}
                style={{
                  transform: [
                    { translate: [1200, 50, 0] },
                    { scale: 0.25 },
                    { rotateY: this.state.planetRotation }
                  ]
                }}
                lit
              />
            </View>

            <View
              name="field"
              style={{
                position: "absolute",
                borderRadius: 4,
                borderWidth: 1,
                backgroundColor: "#fff",
                width: FIELD_WIDTH,
                height: FIELD_HEIGHT,
                transform: [
                  { translateY: 0 },
                  { translateX: 0 },
                  { translateZ: 0 }
                ]
              }}
            />

            <View
              name="playerBar"
              style={{
                position: "absolute",
                borderRadius: 4,
                borderWidth: 1,
                backgroundColor: "#fff",
                width: 30,
                height: 200,
                transform: [
                  { translateY: playerBarY },
                  { translateX: -400 },
                  { translateZ: 0 }
                ]
              }}
            />
            <View
              name="aiBar"
              style={{
                position: "absolute",
                borderRadius: 4,
                borderWidth: 1,
                backgroundColor: "#fff",
                width: 30,
                height: 200,
                transform: [
                  { translateY: aiBarY },
                  { translateX: 400 },
                  { translateZ: 0 }
                ]
              }}
            />
            <View
              name="ball"
              style={{
                position: "absolute",
                borderRadius: 50,
                borderWidth: 1,
                backgroundColor: "#fff",
                width: 30,
                height: 30,
                transform: [
                  { translateY: ball.y },
                  { translateX: ball.x },
                  { translateZ: 0 }
                ]
              }}
            />
          </View>
        </CylindricalPanel>
      </View>
    );
  }
}

AppRegistry.registerComponent("VR", () => VR);
