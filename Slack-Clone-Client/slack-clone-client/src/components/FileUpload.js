import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { Button, Icon } from 'semantic-ui-react';


export default class FileUpload extends Component {
  onDrop = (acceptedFiles, rejectedFiles) => {
    // Do something with files
    console.log(acceptedFiles);
  }

  render() {
    return (
      <Dropzone onDrop={this.onDrop}>
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div {...getRootProps()} className="dropzone-btn">
            <input {...getInputProps()} />
            {
              isDragActive
                ? 'dorping items'
                : this.props.children
            }
          </div>
        )}
      </Dropzone>
    );
  }
}
