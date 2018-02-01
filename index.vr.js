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
const BALL_VEL_X = 4;
const BALL_VEL_Y = 1;

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
    ball: {
      x: 0,
      y: 0,
      velX: BALL_VEL_X,
      velY: BALL_VEL_Y
    },
    score1: 0,
    score2: 0
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
    let { ball, aiBar, rotation } = this.state;
    let playerBarY = rotation[0] * 10;

    if (playerBarY > Y_MAX) playerBarY = Y_MAX;
    else if (playerBarY < -Y_MAX) playerBarY = -Y_MAX;

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
      console.log(ball.y, playerBarY, playerBarY + BAR_HEIGHT);
      console.log(ball.y > playerBarY, ball.y < playerBarY + BAR_HEIGHT);
      if (
        ball.y > playerBarY - BAR_HEIGHT / 2 &&
        ball.y < playerBarY + BAR_HEIGHT / 2
      ) {
        ball.velX = -ball.velX;
        let deltaY = ball.y - playerBarY;
        ball.velY = deltaY * VELOCITY_INCREMENT;
      } else {
        // player 1 scores
        //score1++;
        this.reset(2);
      }
    } else if (ball.x > FIELD_WIDTH / 2 - BALL_SIZE) {
      // Ball on right
      console.log(ball.y, aiBar.y, aiBar.y + BAR_HEIGHT);
      console.log(ball.y > aiBar.y, ball.y < aiBar.y + BAR_HEIGHT);
      if (
        ball.y > aiBar.y - BAR_HEIGHT / 2 &&
        ball.y < aiBar.y + BAR_HEIGHT / 2
      ) {
        ball.velX = -(ball.velX + VELOCITY_INCREMENT);
        let deltaY = ball.y - aiBar.y;
        ball.velY = deltaY * VELOCITY_INCREMENT;
      } else {
        // player 1 scores
        //score1++;
        this.reset(1);
      }
    }

    // AI
    if (aiBar.y < ball.y) {
      aiBar.y += BAR_SPEED;
    } else {
      aiBar.y -= BAR_SPEED;
    }

    this.setState({
      rotation: VrHeadModel.rotation(),
      ball,
      aiBar
    });
  };

  reset = playerInt => {
    let { aiBar, ball, score1, score2 } = this.state;
    ball.x = ball.y = 0;
    ball.velX = BALL_VEL_X;
    ball.velY = BALL_VEL_Y;

    if (playerInt === 1) score1++;
    else if (playerInt === 2) score2++;

    console.log(playerInt, score1, score2);

    this.setState({
      aiBar,
      ball,
      score1,
      score2
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
    const { rotation, ball, aiBar } = this.state;

    let playerBarY = rotation[0] * 10;

    if (playerBarY > Y_MAX) playerBarY = Y_MAX;
    else if (playerBarY < -Y_MAX) playerBarY = -Y_MAX;

    return (
      <View onKeyPress={this.trigger}>
        <Pano source={asset('matrix.png')} />
        <CylindricalPanel
          layer={{
            width: MAX_TEXTURE_WIDTH,
            height: MAX_TEXTURE_HEIGHT,
            density: MAX_TEXTURE_WIDTH
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

            <Animated.View
              name="playerBar"
              style={{
                position: 'absolute',
                borderRadius: 4,
                borderWidth: 1,
                backgroundColor: '#fff',
                width: BAR_WIDTH,
                height: BAR_HEIGHT,
                transform: [
                  { translateY: playerBarY },
                  { translateX: -400 },
                  { translateZ: 0 }
                ]
              }}
            />
            <Animated.View
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
            <Animated.View
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

            <View
              style={{
                position: 'absolute',
                backgroundColor: '#fff',
                transform: [{ translateX: -200 }, { translateY: 200 }]
              }}
            >
              <Text
                style={{
                  fontSize: 40,
                  color: '#000'
                }}
              >
                {this.state.score1}
              </Text>
            </View>
            <View
              style={{
                position: 'absolute',
                backgroundColor: '#fff',
                transform: [{ translateX: 200 }, { translateY: 200 }]
              }}
            >
              <Text
                style={{
                  fontSize: 40,
                  color: '#000'
                }}
              >
                {this.state.score2}
              </Text>
            </View>
          </View>
        </CylindricalPanel>
      </View>
    );
  }
}

AppRegistry.registerComponent('VR', () => VR);
