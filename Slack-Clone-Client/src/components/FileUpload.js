import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { Button, Icon } from 'semantic-ui-react';


const FileUpload = ({ children }) => (
  <Dropzone onDrop={files => console.log(files)} className="ignore">
    {({ getRootProps, getInputProps }) => (
      <div className="container">
        <div
          {...getRootProps({
            className: 'ignore',
            onDrop: event => event.stopPropagation(),
          })}
        >
          <input {...getInputProps()} />
          <Button icon>
            <Icon name="plus" />
          </Button>
        </div>
      </div>
    )}
  </Dropzone>
);

export default FileUpload;
