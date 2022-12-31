/**
 * @author Arvind Kalra <kalarvind97@gmail.com>
 * @profile https://github.com/arvindkalra
 * @date 31/12/22
 */
import PropTypes from "prop-types";
import classnames from "classnames";

const BottomOverlayLayout = (props) => {
  return (
    <div className={classnames("bottom-overlay", props.className)}>
      <div className="bottom-overlay-background" />
      <div className="bottom-overlay-popup">
        <div className="bottom-overlay-popup-dialog">{props.children}</div>
      </div>
    </div>
  );
};

BottomOverlayLayout.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default BottomOverlayLayout;
