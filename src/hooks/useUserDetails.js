import {useEffect, useState} from 'react';
import {getAllUsers} from "../api";


const useUserDetails = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        getAllUsers().then((res) => {
            setUserDetails(res?.users)
            setLoaded(true)
        });
    }, []);

    return [userDetails, loaded];
};

export default useUserDetails;
