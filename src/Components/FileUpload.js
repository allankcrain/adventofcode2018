import React from 'react';
import PropTypes from 'prop-types';

/**
 * Simple component for reading a file uploaded by the user.
 *
 * Pass a callback and it will give you the file parsed into lines.
 */
class FileUpload extends React.Component {
  static propTypes = {
    onUpload: PropTypes.func.isRequired,
  };

  state = {
    /** The file object we're reading from */
    file: null,
  };

  /** FileReader object, used to read in the uploaded data. */
  fileReader = new FileReader();

  /**
   * Class constructor. Binds this to the chewInput function and sets up the file reader.
   */
  constructor(props) {
    super(props);
    this.chewInput = this.chewInput.bind(this);
    this.fileReader.onloadend = this.chewInput;
  }

  /**
   * Chew up the input and spit it back out.
   *
   * This is called when the file reader finishes reading the file. It
   * separates the data by lines, then passes it to the onUpload handler
   * passed in by the calling component.
   * @param {object} e - FileReader file event
   */
  chewInput(e) {
    this.props.onUpload(e.target.result.split("\n"));
  }

  /**
   * Handler callback for when the submit button is pressed.
   *
   * Starts the FileReader reading the text of the file
   */
  handleSubmit() {
    if (this.state.file) {
      this.fileReader.readAsText(this.state.file);
    }
  }

  /**
   * Render lifecycle function
   */
  render() {
    return (
      <div>
        Upload a file:
        <input
          type="file"
          id="file"
          onChange={ e => this.setState({file: e.target.files[0]}) }
          />
        <input
          type="submit"
          disabled={this.state.file===null}
          onClick={ () => this.handleSubmit() } />
      </div>
    );
  }
}

export default FileUpload;
