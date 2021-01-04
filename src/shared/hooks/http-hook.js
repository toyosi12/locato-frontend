import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {
        const [isLoading, setIsLoading] = useState(false);
        const [error, setError] = useState();
        const activeHttpRequests = useRef([]);

        const sendRequest = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
            setIsLoading(true);
            const httpAbortCtrl = new AbortController();
            activeHttpRequests.current.push(httpAbortCtrl);
            try{
            const response = await fetch(url, {
                method,
                body,
                headers,
                signal: httpAbortCtrl.signal
            });
    
            const responseData = await response.json();
            
            //if a request completes, remove from abort controller
            activeHttpRequests.current = activeHttpRequests.current.filter(reqCtrl => reqCtrl !== httpAbortCtrl );

            if(!response.ok){
                throw new Error(responseData.message);
            }
            setIsLoading(false);
            return responseData;
        }catch(err){
            setError(err.message);
            setIsLoading(false);
            throw err;
        }
    }, []);

    const clearError = () => {
        setError(null);
    };

    useEffect(() => {
        /**
         * When return is used in useeffect,
         * it is executed as a cleanup function
         * before the next time useeffect runs again
         * or when the component that uses useeffect
         * unmounts.
         * This particular function aborts an api call,
         * when the component is switched away from.
         * 
         */
        return () =>{
            activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
        }; 
    }, []);

    return { isLoading, error, sendRequest, clearError } 
}