/**
 * @author Arvind Kalra <kalarvind97@gmail.com>
 * @profile https://github.com/arvindkalra
 * @date 27/12/22
 */
import classnames from "classnames";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Button, PageHeader } from "antd";
import { QrcodeOutlined } from "@ant-design/icons";
import OptInNotificationsButton from "../../OptInNotificationsButton";

const PROJECT_NAME = "EPI Wallet";
const PROJECT_LOGO_LINK = "https://i.imgur.com/ZAE8cku.png"

const MainLayout = (props) => {
  const navigate = useNavigate();

  return (
    <div className={classnames("wallet", props.className)}>
      <div className="wallet-header">
        <PageHeader
          avatar={props.hideLogo ? null : { src: PROJECT_LOGO_LINK }}
          title={props.showAppName ? PROJECT_NAME : props.headerTitle}
          subTitle={props.hideLogo && PROJECT_NAME}
          onBack={props.onBackClick}
          extra={!props.removeExtraIcons && [
            <Button
              key="button"
              type="dashed"
              shape="circle"
              icon={<QrcodeOutlined />}
              size="large"
              onClick={() => navigate("/scan")}
            />,
            <OptInNotificationsButton key="notifications" />,
          ]}
        />
      </div>
      <div className="wallet-content">{props.children}</div>
    </div>
  );
};

MainLayout.propTypes = {
  showAppName: PropTypes.bool,
  hideLogo: PropTypes.bool,
  headerTitle: PropTypes.string,
  className: PropTypes.string,
  onBackClick: PropTypes.func,
  children: PropTypes.node,
  removeExtraIcons: PropTypes.bool
};

MainLayout.defaultProps = {
  showAppName: true,
  hideLogo: false,
  removeExtraIcons: false
};

export default MainLayout;
