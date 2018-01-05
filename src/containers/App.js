import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, withRouter } from 'react-router';
import { postImage } from '../store/items/actions'

import '../assets/stylesheets/App.scss';

export class App extends Component {

  snapPhoto() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, 300, 300)

    context.drawImage(video, 0, 0, 300, 300);
    this.convertImage(canvas)
  }

  snapMobile() {
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, 300, 300)
    const img_el = document.getElementById('mobile-image')
    const img = new Image()
    const url = URL.createObjectURL(img_el.files[0])
    img.onload = function() {
      context.drawImage(img, 0, 0, 300, 300);
    }
    img.src = url;
    this.convertImage(canvas)
  }

  convertImage(cvs) {
    cvs.toBlob(blob => {
      const formData = new FormData();
      formData.append('file', blob, 'upload.jpg')
      this.props.sendImage(formData);
    }, 'image/jpeg');
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

  renderResults(results) {
    return results.map(model => {
      return <div key={model.probability}>{model.what}, {model.probability}</div>
    })
  }

  render() {

    return (
      <div className="app">
        <div>Hotdog/Not hotdog</div>
        <h2>Desktop</h2>
        <div>
          <video id="video" width="300" height="300" autoPlay></video>
          <button id="snap" onClick={() => this.snapPhoto()}>Desktop Snap</button>
        </div>
        <h2>Mobile</h2>
        <div>
          <input id='mobile-image' type="file" accept="image/*" capture="camera"></input>
          <button id="snap-mobile" onClick={() => this.snapMobile()}>Moile Snap</button>
        </div>
        <canvas id="canvas" width="296" height="296"></canvas>
        <div>{this.renderResults(this.props.models)}</div>
      </div>
    );
  }
}

App.propTypes = {
  dispatch: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    models: state.isHotdog.models,
  };
}


const mapDispatchToProps = dispatch => ({
  sendImage: (image) =>
    dispatch(postImage(image)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
