import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, withRouter } from 'react-router';
import { postImage } from '../store/items/actions';

import Fire from '../assets/images/Fire_gif.gif';
import Hotdog from '../assets/images/hotdog.gif';
import '../assets/stylesheets/App.css';

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
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d');

    const img = new Image()
    img.src = Hotdog
    img.onload = () => {
      context.drawImage(img, 0, 0, 300, 300);
      // this.convertImage(canvas, file.name)
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
        <h1 className="header">
          <img className="fire-gif" src={Fire} />
          WHAT AM I EATING?
          <img className="fire-gif" src={Fire} />
        </h1>
        <canvas id="canvas" width="296" height="296" />
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
