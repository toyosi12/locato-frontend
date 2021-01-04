import React, { useContext, useEffect, useState } from 'react';

import { useHistory, useParams } from 'react-router-dom';
import Button from '../../shared/FormElements/Button';
import Input from '../../shared/FormElements/Input';
import { useForm } from '../../shared/hooks/form-hook';
import Card from '../../shared/UIElements/Card';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/utils/validators';
import {useHttpClient} from '../../shared/hooks/http-hook';
import './PlaceForm.css';
import LoadingSpinner from '../../shared/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/UIElements/ErrorModal';
import { AuthContext } from '../../shared/context/auth-context';


const UpdatePlace = () => {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedPlace, setLoadedPlace] = useState();

    const placeId = useParams().placeId;
    const history = useHistory();


    const [formState, inputHandler, setFormData] = useForm({
        title: {
            value: '',
            isValid: true
        },
        description: {
            value: '',
            isValid: true
        }
    }, true);

    useEffect(() => {
        const fetchPlace = async () => {
            try{
                const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`)
                setLoadedPlace(responseData.place);
                setFormData({
                    title: {
                        value: responseData.place.title,
                        isValid: true
                    },
                    description: {
                        value: responseData.place.description,
                        isValid: true
                    }
                }, true);
            }catch(err){}

        }
        fetchPlace();
    }, [sendRequest, placeId, setFormData]);


    const placeUpdateSubmitHandler = async event => {
        event.preventDefault();
        try{
            await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
            'PATCH',
            JSON.stringify({
                title: formState.inputs.title.value,
                description: formState.inputs.description.value
            }),
            { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + auth.token
            }
            );
            history.push('/' + auth.userId + '/places');


        }catch(err){}
    };

    if(isLoading){
        return (
            <div className="center">
                <LoadingSpinner />
            </div>
        );
    }

    if(!loadedPlace && !error){
        return <div className="center">
            <Card>
                <h2>Could not find place</h2>
            </Card>
        </div>
    }


    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {!isLoading && loadedPlace && <form className="place-form" onSubmit={ placeUpdateSubmitHandler }>
            <Input  
                id="title" 
                element="input" 
                type="text" 
                label="Title" 
                validators={[ VALIDATOR_REQUIRE() ]}
                errorText="Please enter a valid title"
                onInput={inputHandler}
                value={ loadedPlace.title }
                valid={formState.inputs.title.isValid} />
    
            <Input  
                id="description" 
                element="textarea" 
                type="text" 
                label="Description" 
                validators={[ VALIDATOR_MINLENGTH(5) ]}
                errorText="Please enter a valid title(min. 5 characters)."
                onInput={inputHandler}
                value={ loadedPlace.description }
                valid={formState.inputs.description.isValid} />
    
            <Button type="submit" disabled={!formState.isValid}>UPDATE PLACE</Button>
            </form> }
        </React.Fragment>
        );
        
};

export default UpdatePlace;