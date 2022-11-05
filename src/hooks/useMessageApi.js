import { useState, useEffect } from "react";
import { BASE_URL } from "../api";

const useMessageApi = (path) => {

    const [loading, setLoading]  = useState(true);
    const [apiResponse, setApiResponse] = useState(null);

    useEffect(() => {
        fetch(`${BASE_URL}/${path}`)
        .then(res => res.json())
        .then((res) => {
            setApiResponse(res)
        })
        .finally(() => {
            setLoading(false)
        })

    }, [path])


    return [loading, apiResponse]
};

export default useMessageApi;