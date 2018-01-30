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
import KeyHandler, { KEYPRESS } from 'react-key-handler';

const MAX_TEXTURE_WIDTH = 4096;
const MAX_TEXTURE_HEIGHT = 720;
const degreesToPixels = degrees => -(degrees / 360) * MAX_TEXTURE_WIDTH;
const PPM = 1 / (2 * Math.PI * 3) * MAX_TEXTURE_WIDTH;
const AnimatedModel = Animated.createAnimatedComponent(Model);

const faceNeutral = asset('neutral.svg');
const faceTroll = asset('troll.jpg');
const faceLenny = asset('lenny.jpg');

export default class VR extends React.Component {
  state = {
    componentX: 1,
    velocityX: 1,
    speed: 10,
    planetRotation: new Animated.Value(0),
    keyCode: null,
    rotation: [0, 0, 0],
    image: faceNeutral
  };
  componentDidMount() {
    let intervalId = setInterval(this.tick, 16);
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

  tick = () => {
    let componentX = this.state.componentX;
    let velocityX = this.state.velocityX;
    if (componentX > 900) velocityX = -1;
    else if (componentX < 100) velocityX = 1;
    let image;
    if (this.state.rotation[0] > 10) image = faceLenny;
    else if (this.state.rotation[0] < -10) image = faceTroll;
    else image = faceNeutral;
    this.setState({
      componentX: componentX + velocityX * this.state.speed,
      velocityX,
      rotation: VrHeadModel.rotation(),
      image
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
    const rotateY = 0;
    const translateX = 150;
    const translateZ = 150;
    const image = this.state.image;
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
            }}
          >
            <View>
              <KeyHandler
                keyEventName={KEYPRESS}
                keyValue="s"
                onKeyHandle={this.trigger}
              />
              <AmbientLight intensity={1.6} />

              <PointLight
                style={{
                  color: 'white',
                  transform: [{ translate: [0, 0, 0] }]
                }}
              />

              <AnimatedModel
                source={{
                  obj: asset('earth/earth.obj'),
                  mtl: asset('earth/earth.mtl')
                }}
                style={{
                  transform: [
                    { translate: [0, -3, -12] },
                    { scale: 0.25 },
                    { rotateY: this.state.planetRotation }
                  ]
                }}
                lit
              />
              <Image
                style={{
                  borderRadius: 20,
                  backgroundColor: 'red',
                  borderWidth: 10,
                  width: 200,
                  height: 115,
                  transform: [
                    { rotateY: rotateY },
                    { translateX: this.state.componentX },
                    { translateZ: translateZ }
                  ]
                }}
                source={image}
              />
              <Text
                style={{
                  backgroundColor: '#777879',
                  fontSize: 0.8,
                  fontWeight: '400',
                  layoutOrigin: [0.5, 0.5],
                  paddingLeft: 0.2,
                  paddingRight: 0.2,
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  transform: [
                    { rotateY: rotateY },
                    { translateX: degreesToPixels(translateX) },
                    { translateZ: translateZ }
                  ]
                }}
              >
                hello
              </Text>
            </View>
          </View>
        </CylindricalPanel>
      </View>
    );
  }
}

AppRegistry.registerComponent('VR', () => VR);
