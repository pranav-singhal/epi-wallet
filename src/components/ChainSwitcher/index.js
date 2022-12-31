import React, { useContext } from "react";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import _ from 'lodash';
import chainList from "../../helpers/chains.json";
import { ChainContext } from "../..";

const ChainSwitcher = () => {

    const [chainState, dispatch] = useContext(ChainContext);
    return (
        <Dropdown menu={{items: _.map(chainList, (chainItem => {
            return {
              key: chainItem.name,
              label: chainItem.title,
              icon: chainItem.icon
            }
          })),
          onClick: (selectedItem) => {
            const selectedChain = _.filter(chainList, chainItem => (chainItem.name === selectedItem.key))[0];
            dispatch({
                    type: "switch_chain",
                    chain: selectedChain?.name 
            })
          }
        }}
          >
            <div className="chain-switcher">
              <span>
                  {
                      chainState.title || chainState.name
                  }
                </span>
              <DownOutlined />
            </div>
            </Dropdown>
    )
}

export default ChainSwitcher;