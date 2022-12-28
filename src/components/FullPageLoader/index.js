/**
 * @author Arvind Kalra <kalarvind97@gmail.com>
 * @profile https://github.com/arvindkalra
 * @date 28/12/22
 */
import {Spin} from "antd";
import PropTypes from "prop-types";

const FullPageLoader = (props) => {
  return (
    <div className="fullpage-loader">
      <Spin tip={!props.removeMessage && props.message} size={props.size} />
    </div>
  )
}

FullPageLoader.propTypes = {
  message: PropTypes.string,
  size: PropTypes.oneOf(['small', 'middle', 'large']),
  removeMessage: PropTypes.bool
}

FullPageLoader.defaultProps = {
  message: "Loading...",
  size: 'middle',
  removeMessage: false
}

export default FullPageLoader
