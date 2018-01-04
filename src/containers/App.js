import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, withRouter } from 'react-router';

import '../assets/stylesheets/App.scss';

export class App extends Component {

  snapPhoto() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    context.drawImage(video, 0, 0, 300, 300);
    this.convertImage(canvas)
  }

  convertImage(cvs) {
    const image = new Image();
    image.src = cvs.toDataURL('image/jpg');
    return image;
    // make call to the backend here
  }

  componentDidMount() {
    const video = document.getElementById('video');

    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        video.src = window.URL.createObjectURL(stream);
        video.play();
      });
    }
  }

  render() {

    return (
      <div className="app">
        <div>Hotdog/Not hotdog</div>
        <video id="video" width="300" height="300" autoPlay></video>
        <button id="snap" onClick={() => this.snapPhoto()}>Snap Photo</button>
        <canvas id="canvas" width="296" height="296"></canvas>
      </div>
    );
  }
}

// App.propTypes = {
//   dispatch: PropTypes.func,
//   items: PropTypes.array,
// };

// function mapStateToProps(state) {
//   return {
//     items: state.items.list,
//   };
// }

export default App;
