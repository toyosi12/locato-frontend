import React, { useContext, useState } from 'react';
import Input from '../../shared/FormElements/Input';
import { useForm } from '../../shared/hooks/form-hook';
import Card from '../../shared/UIElements/Card';
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/utils/validators';

import Button from '../../shared/FormElements/Button';
import './Auth.css';
import { AuthContext } from '../../shared/context/auth-context';
import ErrorModal from '../../shared/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/UIElements/LoadingSpinner';
import  { useHttpClient } from '../../shared/hooks/http-hook';
import ImageUpload from '../../shared/FormElements/ImageUpload';
const Auth = () => {
    const auth = useContext(AuthContext);
    const [isLoginMode, setIsLoginMode] = useState(true);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [formState, inputHandler, setFormData] = useForm({
        email: {
            value: '',
            isValid: false
        },
        password:{
            value: '',
            isValid: false
        }
    }, false);

    const switchModeHandler = () => {
        if(!isLoginMode){
            setFormData({
                ...formState.inputs,
                name: undefined,
                image: undefined
            }, 
                formState.inputs.email.isValid && formState.inputs.password.isvalid);
        }else{
            setFormData({
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false
                },
                image: {
                    value: null,
                    isvalid: false
                }

            }, false)
        }
        setIsLoginMode(prevMode => !prevMode); 
    }

    const authSubmitHandler = async event => {
        event.preventDefault();
        
        if(isLoginMode){
            try{
                const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users/login`, 
                                        'POST',
                                        JSON.stringify({
                                            email: formState.inputs.email.value,
                                            password: formState.inputs.password.value
                                        }),
                                        {
                                            'Content-Type': 'application/json'
                                        }
                );
                auth.login(responseData.userId, responseData.token);
            }catch(err){
                
            }
        }else{
            try{
                const formData = new FormData();
                formData.append('email', formState.inputs.email.value);
                formData.append('name', formState.inputs.name.value);
                formData.append('password', formState.inputs.password.value);
                formData.append('image', formState.inputs.image.value);
                const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users/signup`, 
                        'POST',
                        formData
                );
                auth.login(responseData.userId, responseData.token);
            }catch(err){
                
            }


        }

    }

    return(
        <React.Fragment>
            <ErrorModal error={error} onClear={ clearError } />
            <Card className="authentication">
            { isLoading && <LoadingSpinner asOverlay /> }
                <h2>Login Required</h2>
                <hr />
                <form onSubmit={authSubmitHandler}>
                    {!isLoginMode && 
                        <Input 
                            element="input"
                            id="name"
                            type="text"
                            label="Your name"
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Please enter a name"
                            onInput={ inputHandler }
                        />
                    }

                    { !isLoginMode && <ImageUpload center id="image" onInput={inputHandler} errorText="Please provide an image" />}
                    <Input
                        id="email"
                        element="input"
                        type="email"
                        label="E-mail"
                        validators={[VALIDATOR_EMAIL()]}
                        errorText="Must be a valid email"
                        onInput={ inputHandler }
                    />

                    <Input
                        id="password"
                        element="input"
                        type="password"
                        label="Password"
                        validators={[VALIDATOR_MINLENGTH(6)]}
                        errorText="Enter at least 6 characters"
                        onInput={ inputHandler }
                    />

                    <Button type="submit" disabled={!formState.isValid}>
                        {isLoginMode ? 'LOGIN' : 'SIGNUP'}
                    </Button>

                </form>

                <Button inverse onClick={switchModeHandler}>SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}</Button>
        </Card>
        </React.Fragment>
    )
    
    
}

export default Auth;