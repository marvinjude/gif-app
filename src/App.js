/**
 * Jude Agboola © 2019
 * marvinjudehk@gmail.com
 */

import React, { useState, useRef, useEffect, memo } from "react";
import PropTypes from "prop-types";
import imageDataURI from "image-data-uri";
import logo from "./icons/logo.svg";
import downloadIcon from "./icons/download.svg";
import fetchGif from "./services/fetchGif";
import { ReactComponent as Spinner } from "./spinner.svg";
import { ReactComponent as ErrorICon } from "./icons/warning.svg";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [loadingURL, setIsLoadingURL] = useState(false);
  const [error, setError] = useState(false);

  //Uses a default GIF URL
  const [gifData, setGifData] = useState({
    original: "https://media1.giphy.com/media/2dQ3FMaMFccpi/giphy.gif",
    downSized: "https://media1.giphy.com/media/2dQ3FMaMFccpi/giphy.gif",
    title: "some GIF"
  });

  const onChange = ({ target: { value } }) => {
    setInputValue(value);
  };

  async function onSubmit(event) {
    event.preventDefault();
    setIsLoadingURL(true);

    try {
      setError(false);
      const { data } = await fetchGif(inputValue); // URL received
      setIsLoadingURL(false);

      if (data.images)
        setGifData({
          original: data.images.original.url,
          downSized: data.images.downsized.url,
          title: data.title
        });
    } catch (e) {
      setIsLoadingURL(false);
      setError(true);
    }
  }

  return (
    <div className="container">
      <div className="message message--warning">
        <img src={logo} className="message__logo" alt="twitch logo" />
        <form className="message__form" onSubmit={onSubmit}>
          <input
            value={inputValue}
            onChange={onChange}
            placeholder="Enter text here"
            className="message__input"
          />
          {loadingURL && <Spinner />}
          {error && <ErrorICon />}
        </form>
        {/* Show downsized quality GIF if original is loading */}
        <Image
          original={gifData.original}
          downSized={gifData.downSized}
          title={gifData.title}
        />
        <Download url={gifData.original} name={gifData.title} />
      </div>
    </div>
  );
}

/**
 * Modern browsers can download files that aren't from same origin this is a workaround to dwnload a remote file
 * @param `url` Remote URL for the file to be downloaded
 */
function Download({ url, name }) {
  const [creatingURI, setCreatingURI] = useState(false);

  const download = () => {
    setCreatingURI(true);

    imageDataURI
      .encodeFromURL(url)
      .then(uri => {
        setCreatingURI(false);

        const link = document.createElement("a");
        link.href = uri;
        link.download = `${name}.gif`;
        document.body.appendChild(link);
        link.click();
      })
      .catch(() => {
        setCreatingURI(false);
      });
  };

  return (
    <button
      disabled={creatingURI}
      onClick={download}
      aria-label="download gif"
      className="message__button message__button--dark"
    >
      DOWNLOAD
      <img src={downloadIcon} alt="download"></img>
    </button>
  );
}

/**
 * Show low quality image with a blur and swap swap with original once loaded
 * @params `original` URL for the original image
 * @params `downSized` URL for the low quality image
 * @params `title` image title. used as `alt` prop as well
 */
const Image = memo(({ original, downSized, title }) => {
  const imageRef = useRef();
  const [isOriginalLoading, setIsOriginalLoading] = useState(true);

  useEffect(() => {
    setIsOriginalLoading(true);

    imageRef.current.onload = () => {
      setIsOriginalLoading(false);
    };
  }, [original, downSized, title]);

  return (
    <>
      <img
        alt={title}
        className="message__image blur"
        src={downSized}
        style={isOriginalLoading ? { display: "block" } : { display: "none" }}
      />
      <img
        alt={title}
        className="message__image"
        ref={imageRef}
        src={original}
        style={isOriginalLoading ? { display: "none" } : { display: "block" }}
      />
    </>
  );
});

Image.prototype = {
  original: PropTypes.string.isRequired,
  downSized: PropTypes.string.isRequired,
  title: PropTypes.string
};
export default App;
