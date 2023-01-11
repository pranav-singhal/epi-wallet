import React, { useState, useRef, useEffect } from "react";
import classnames from "classnames";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Typography } from "antd";
import { RightCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

const TRACK_LENGTH = 250;
const SLIDER_WIDTH = 50;
const ACCEPTABLE_DELTA = 50;
const MOVABLE_TRACK_LENGTH = TRACK_LENGTH - SLIDER_WIDTH;

const SliderTrack = styled.div`
  width: ${TRACK_LENGTH}px;
  height: ${SLIDER_WIDTH}px;
  border: 1px solid #ccc;
  background-color: #f6ffed;
  border-radius: ${SLIDER_WIDTH / 2}px;
  overflow: hidden;
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  h4 {
    margin: unset !important;
  }

  .circle {
    width: ${SLIDER_WIDTH}px;
    height: ${SLIDER_WIDTH}px;
    border-radius: 50%;
    background-color: #52c41a;
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;

    span {
      color: #ffffff;
    }
  }

  .completed {
    transition: border-radius 0.1ms, width 0.3s, height 0.3s, left 0.3s;
    left: 0px !important;
    width: inherit;
    height: inherit;
    border-radius: inherit;

    background-color: #b7eb8f;

    span {
      color: #8c8c8c;
    }
  }
`;

function SwipeButton(props) {
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const trackRef = useRef(null);

  useEffect(() => {
    if (!isCompleted) {
      return;
    }

    props.onComplete();
  }, [isCompleted]);



  useEffect(() => {
    if (props.isError)  {
      // if the transaction throws an error
      // reset the swipe button to initial state
      setCurrentX(0);
      setIsDragging(false);
      setIsCompleted(false);
    }
  }, [props.isError])

  const handleMouseDown = (event) => {
    // in case there is an error, reset it
    props.setIsError('')

    setIsDragging(true);
  };
  const handleTouchStart = (event) => {
    // in case there is an error, reset it
    props.setIsError('')

    setIsDragging(true);
  };

  const handleMouseUp = (event) => {
    setIsDragging(false);
    if (currentX < MOVABLE_TRACK_LENGTH) {
      setCurrentX(0);
    } else {
      setIsCompleted(true);
    }
  };
  const handleTouchEnd = (event) => {
    setIsDragging(false);
    if (currentX < MOVABLE_TRACK_LENGTH) {
      setCurrentX(0);
    } else {
      setIsCompleted(true);
    }
  };

  const handleMouseMove = (event) => {
    if (!isDragging || isCompleted) {
      return;
    }

    let newX;
    if (event.touches) {
      newX = event.touches[0].clientX - trackRef.current.offsetLeft - 50;
    } else {
      newX = event.clientX - trackRef.current.offsetLeft - 50;
    }

    if (newX >= 0 && newX <= MOVABLE_TRACK_LENGTH) {
      if (MOVABLE_TRACK_LENGTH - newX <= ACCEPTABLE_DELTA) {
        setCurrentX(MOVABLE_TRACK_LENGTH);
        return;
      }

      setCurrentX(newX);
    }
  };

  const handleTouchMove = (event) => {
    if (!isDragging || isCompleted) {
      return;
    }

    const newX = event.touches[0].clientX - trackRef.current.offsetLeft - 50;

    if (newX >= 0 && newX <= MOVABLE_TRACK_LENGTH) {
      if (MOVABLE_TRACK_LENGTH - newX <= ACCEPTABLE_DELTA) {
        setCurrentX(MOVABLE_TRACK_LENGTH);
        return;
      }

      setCurrentX(newX);
    }
  };

  return (
    <SliderTrack
      className="track"
      ref={trackRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={classnames("circle", { completed: isCompleted })}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{ position: "absolute", left: currentX }}
      >
        {isCompleted ? (
          <Text>Approving...</Text>
        ) : (
          <span>
            <RightCircleOutlined style={{ fontSize: "16px" }} />
          </span>
        )}
      </div>
      <Text type="success">Approve</Text>
    </SliderTrack>
  );
}

SwipeButton.propTypes = {
  onComplete: PropTypes.func.isRequired,
};

export default SwipeButton;
