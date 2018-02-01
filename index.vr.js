import React from 'react';
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
} from 'react-vr';

const MAX_TEXTURE_WIDTH = 4096;
const MAX_TEXTURE_HEIGHT = 720;
const degreesToPixels = degrees => -(degrees / 360) * MAX_TEXTURE_WIDTH;
const PPM = 1 / (2 * Math.PI * 3) * MAX_TEXTURE_WIDTH;
const AnimatedModel = Animated.createAnimatedComponent(Model);

//game
const BAR_SPEED = 6;
const BAR_HEIGHT = 200;
const BAR_WIDTH = 10;
const BALL_SIZE = 30;

const FIELD_WIDTH = 800 + 2 * BAR_WIDTH;
const FIELD_HEIGHT = 500;
const VELOCITY_INCREMENT = 0.2;
const Y_MAX = 150;

const faceNeutral = asset('neutral.svg');
const faceTroll = asset('troll.jpg');
const faceLenny = asset('lenny.jpg');

export default class VR extends React.Component {
  state = {
    planetRotation: new Animated.Value(0),
    rotation: [0, 0, 0],
    aiBar: {
      x: 0,
      y: 0
    },
    playerBar: {
      x: 0,
      y: 0
    },
    ball: {
      x: 0,
      y: 0,
      velX: -2,
      velY: 0
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
    console.log('trigger', e);
  };

  gameTick = () => {
    let { ball, aiBar, playerBar, rotation } = this.state;
    playerBar.y = rotation[0] * 10;

    //console.log(rotation[0], playerBarY);
    if (playerBar.y > Y_MAX) playerBar.y = Y_MAX;
    else if (playerBar.y < -Y_MAX) playerBar.y = -Y_MAX;

    ball.x += ball.velX;
    ball.y += ball.velY;

    // Ball on top
    if (ball.y - +BALL_SIZE / 2 < -FIELD_HEIGHT / 2 && ball.velY < 0) {
      ball.velY = -ball.velY;
    }
    // Ball on bottom
    if (ball.y + BALL_SIZE / 2 > FIELD_HEIGHT / 2 && ball.velY > 0) {
      ball.velY = -ball.velY;
    }

    // Ball on left
    if (ball.x < -FIELD_WIDTH / 2 + BALL_SIZE) {
      console.log(ball.y, playerBar.y, playerBar.y + BAR_HEIGHT);
      console.log(ball.y > playerBar.y, ball.y < playerBar.y + BAR_HEIGHT);
      if (
        ball.y > playerBar.y - BAR_HEIGHT / 2 &&
        ball.y < playerBar.y + BAR_HEIGHT / 2
      ) {
        ball.velX = -(ball.velX + VELOCITY_INCREMENT);
        let deltaY = ball.y - playerBar.y;
        ball.velY = deltaY * VELOCITY_INCREMENT;
      } else {
        // player 1 scores
        //score1++;
        this.reset();
      }
    }

    // Ball on right
    if (ball.x > FIELD_WIDTH / 2 - BALL_SIZE) {
      console.log(ball.y, aiBar.y, aiBar.y + BAR_HEIGHT);
      console.log(ball.y > aiBar.y, ball.y < aiBar.y + BAR_HEIGHT);
      if (
        ball.y > aiBar.y - BAR_HEIGHT / 2 &&
        ball.y < aiBar.y + BAR_HEIGHT / 2
      ) {
        ball.velX = -ball.velX;
        let deltaY = ball.y - aiBar.y;
        ball.velY = deltaY * VELOCITY_INCREMENT;
      } else {
        // player 1 scores
        //score1++;
        this.reset();
      }
    }

    // AI
    if (aiBar.y < ball.y) {
      aiBar.y += BAR_SPEED;
    } else {
      aiBar.y -= BAR_SPEED;
    }

    // Reset
    //    if (ball.x > FIELD_WIDTH / 2) this.reset();
    //  else if (ball.x < -FIELD_WIDTH / 2) this.reset();

    //console.log(ball);

    this.setState({
      rotation: VrHeadModel.rotation(),
      ball,
      aiBar,
      playerBar
    });
  };

  reset = () => {
    let { aiBar, ball } = this.state;
    ball.x = ball.y = 0;
    ball.velX = 1;
    ball.velY = 1;

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
    const { rotation, ball, aiBar, playerBar } = this.state;

    return (
      <View onKeyPress={this.trigger}>
        <Pano source={asset('matrix.png')} />
        <CylindricalPanel
          layer={{
            width: MAX_TEXTURE_WIDTH,
            height: MAX_TEXTURE_HEIGHT,
            density: MAX_TEXTURE_WIDTH * 2
          }}
          style={{
            position: 'absolute'
          }}
        >
          <View
            style={{
              // View covering the cylinder. Center so contents appear in middle of cylinder.
              alignItems: 'center',
              justifyContent: 'center',
              width: MAX_TEXTURE_WIDTH,
              height: MAX_TEXTURE_HEIGHT
              //transform: [{ scale: 0.5 }]
            }}
          >
            <View>
              <AmbientLight intensity={0.6} />
              <PointLight
                style={{
                  color: 'white',
                  transform: [{ translate: [700, 200, 20] }]
                }}
              />
              <AnimatedModel
                source={{
                  obj: asset('monkey/monkey.obj'),
                  mtl: asset('monkey/monkey.mtl')
                }}
                style={{
                  color: '#ffab19',
                  transform: [
                    { translate: [1300, 0, 0] },
                    { scale: 1 },
                    { rotateY: this.state.planetRotation }
                  ]
                }}
                lit
              />
              <AnimatedModel
                source={{
                  obj: asset('earth/earth.obj'),
                  mtl: asset('earth/earth.mtl')
                }}
                style={{
                  transform: [
                    { translate: [1000, 50, 0] },
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
                position: 'absolute',
                borderRadius: 4,
                borderWidth: 1,
                backgroundColor: '#fff',
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
                position: 'absolute',
                borderRadius: 4,
                borderWidth: 1,
                backgroundColor: '#fff',
                width: BAR_WIDTH,
                height: BAR_HEIGHT,
                transform: [
                  { translateY: playerBar.y },
                  { translateX: -400 },
                  { translateZ: 0 }
                ]
              }}
            />
            <View
              name="aiBar"
              style={{
                position: 'absolute',
                borderRadius: 4,
                borderWidth: 1,
                backgroundColor: '#fff',
                width: BAR_WIDTH,
                height: BAR_HEIGHT,
                transform: [
                  { translateY: aiBar.y },
                  { translateX: 400 },
                  { translateZ: 0 }
                ]
              }}
            />
            <View
              name="ball"
              style={{
                position: 'absolute',
                borderRadius: 50,
                borderWidth: 1,
                backgroundColor: '#fff',
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

AppRegistry.registerComponent('VR', () => VR);
