import { AutoComplete } from 'antd';
import _ from 'lodash';
import React from 'react';
import useUserDetails from '../../hooks/useUserDetails';

const AutoCompleteSearchForUsers = ({onSelect =  () => {}}) => {
    const [userDetails] = useUserDetails();
    const nonVendorUserDetails = _.filter(userDetails, (_user) => {
        return _user.user_type !== 'vendor'
    });
    const userOptions = _.map(_.values(nonVendorUserDetails), (_user) => {
        return (
            {
                label: _user.username,
                value: _user.username

            }
        )
    })


    return <AutoComplete
    placeholder={"Search for users"}
    filterOption
    onSelect={onSelect}
    style={{ width: 200 }}
    options={userOptions}
/>

}

export default AutoCompleteSearchForUsers;
