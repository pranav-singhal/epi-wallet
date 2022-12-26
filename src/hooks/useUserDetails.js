import {useEffect, useState} from 'react';
import {getAllUsers} from "../api";


const useUserDetails = () => {
    const [userDetails, setUserDetails] = useState(null);
    useEffect(() => {
        getAllUsers().then((res) => setUserDetails(res?.users));
    }, []);

    return [userDetails];
};

export default useUserDetails;
