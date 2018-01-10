import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { postImage } from '../store/items/actions';

import LoadingBlock from '../components/LoadingBlock';
import { Button, CardActions, FileUpload, Snackbar, TextField } from 'react-md';

import Fire from '../assets/images/Fire_gif.gif';
import Hotdog from '../assets/images/hotdog.gif';
import '../assets/stylesheets/App.css';

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputVal: '',
      sending: false,
      toasts: [],
      fileName: '',
      progress: null,
      uploadProgress: undefined,
      fileSize: 0,
    };
  }

  snapImage() {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const file = document.getElementById('server-upload-file').files[0];
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      context.drawImage(img, 0, 0, 300, 300);
      this.convertImage(canvas, file.name);
    };
  }

  convertImage(cvs, filename = `upload-${new Date().getTime()}.jpg`) {
    cvs.toBlob(blob => {
      const formData = new FormData();
      formData.append('file', blob, filename);
      this.props.sendImage(formData);
    }, 'image/jpeg');
  }

  componentDidMount() {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    const img = new Image();
    img.src = Hotdog;
    img.onload = () => {
      context.drawImage(img, 0, 0, 300, 300);
    };
  }

  renderResult(model) {
    if (model.what && this.props.loading === false) {
      return <div className="result">{model.what}</div>;
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.snapImage();
  };

  handleServerProgress = async reader => {
    const result = await reader.read();
    const chunk = result.value;

    if (result.done) {
      this.addToast(`"${this.state.fileName}" successfully uploaded!`);
      this.setState({ uploadProgress: 100 });
      this.uploadProgressTimeout = setTimeout(() => {
        this.uploadProgressTimeout = null;
        this.setState({ uploadProgress: undefined });
      }, 500);
      return null;
    }

    const bytes = chunk.byteLength;
    this.setState(({ uploadProgress, fileSize }) => ({
      uploadProgress: uploadProgress + bytes / fileSize * bytes,
    }));

    return this.handleServerProgress(reader);
  };

  handleProgress = (file, progress) => {
    this.setState({ progress });
  };

  handleLoad = ({ name, size }) => {
    this.progressTimeout = setTimeout(() => {
      this.progressTimeout = null;
      this.setState({ progress: null });
    }, 500);
    this.setState({ fileName: name, fileSize: size });
  };

  handleLoadStart = () => {
    this.setState({ progress: 0 });
  };

  addToast = text => {
    const toasts = [{ text, action: 'Ok' }];
    this.setState({ toasts });
  };

  dismiss = () => {
    const [, ...toasts] = this.state;
    this.setState({ toasts });
  };

  handleReset = () => {
    this.setState({ fileName: '' });
  };

  render() {
    const { toasts, fileName, sending } = this.state;

    return (
      <div className="app">
        <h1 className="header">
          <img alt="fire gif" className="fire-gif" src={Fire} />
          WHAT AM I EATING?
          <img alt="fire gif" className="fire-gif" src={Fire} />
        </h1>
        <canvas id="canvas" width="296" height="296" />
        <form
          id="server-upload-form"
          ref={this.setForm}
          onSubmit={this.handleSubmit}
          onReset={this.handleReset}
          name="server-upload-form"
          className="file-inputs__upload-form"
        >
          <FileUpload
            id="server-upload-file"
            label="Choose file"
            required
            accept="image/*,video/*"
            onLoad={this.handleLoad}
            onLoadStart={this.handleLoadStart}
            onProgress={this.handleProgress}
            name="file"
            className="file-inputs__upload-form__file-upload"
            primary
            iconBefore
          />
          <TextField
            id="server-upload-file-field"
            placeholder="No file chosen"
            value={fileName}
            className="file-inputs__upload-form__file-field"
            readOnly
            fullWidth={false}
          />
          <CardActions className="md-full-width">
            <Button type="submit" flat primary disabled={!fileName || sending}>
              Submit
            </Button>
            <Button type="reset" flat className="md-cell--right">
              Reset
            </Button>
          </CardActions>
          <Snackbar
            id="file-upload-errors"
            toasts={toasts}
            onDismiss={this.dismiss}
          />
        </form>
        {this.props.loading && <LoadingBlock />}
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
    loading: state.isHotdog.loading,
  };
}

const mapDispatchToProps = dispatch => ({
  sendImage: image => dispatch(postImage(image)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
