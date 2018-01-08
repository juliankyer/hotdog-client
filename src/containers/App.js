import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, withRouter } from 'react-router';
import { postImage } from '../store/items/actions'

import '../assets/stylesheets/App.scss';

export class App extends Component {

  snapImage() {
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d');
    const file = document.getElementById('add-image').files[0]
    const img = new Image()
    img.src = URL.createObjectURL(file)
    img.onload = () => {
      context.drawImage(img, 0, 0, 300, 300);
      this.convertImage(canvas, file.name)
    }
  }

  convertImage(cvs, filename = `upload-${new Date().getTime()}.jpg`) {
    cvs.toBlob(blob => {
      const formData = new FormData();
      formData.append('file', blob, filename)
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

  renderResult(model) {
    if(model.what) {
      return <div className="result">{model.what}</div>
    }
  }

  render() {

    return (
      <div className="app">
        <h1 className="header">WHAT AM I EATING?</h1>
        <canvas id="canvas" width="296" height="296"></canvas>
        <div className="btn-wrapper">
          <input id='add-image' type="file" accept="image/*" capture="camera"></input>
          <button id="snap-mobile" onClick={() => this.snapImage()}>WTF is this?</button>
        </div>
        {this.renderResult(this.props.model)}
      </div>
    );
  }
}

App.propTypes = {
  dispatch: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    model: state.isHotdog.model,
  };
}


const mapDispatchToProps = dispatch => ({
  sendImage: (image) =>
    dispatch(postImage(image)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
