import React from 'react';
import {
  AppRegistry,
  asset,
  CylindricalPanel,
  Pano,
  Text,
  View
} from 'react-vr';

const MAX_TEXTURE_WIDTH = 4096;
const MAX_TEXTURE_HEIGHT = 720;
const degreesToPixels = degrees => -(degrees / 360) * MAX_TEXTURE_WIDTH;
const PPM = 1 / (2 * Math.PI * 3) * MAX_TEXTURE_WIDTH;

export default class VR extends React.Component {
  render() {
    return (
      <View>
        <Pano source={asset('chess-world.jpg')} />
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
            transform: [{ translate: [1, 1, -6] }]
          }}
        >
          hello
        </Text>
      </View>
    );
  }
}

AppRegistry.registerComponent('VR', () => VR);
