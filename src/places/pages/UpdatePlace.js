import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import Button from '../../shared/FormElements/Button';
import Input from '../../shared/FormElements/Input';
import { useForm } from '../../shared/hooks/form-hook';
import Card from '../../shared/UIElements/Card';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/utils/validators';
import './PlaceForm.css';

const DUMMY_PLACES = [
    {
        id: 'p1',
        title: "Empire State Building",
        description: "One of the most famous sky scrappers in the world",
        imageUrl: "https://www.great-towers.com/sites/default/files/2019-07/tower_0.jpg",
        address: '20 W 34th St, New York, NY 10001',
        location: {
            lat: 40.7484405,
            long: -73.9878584
        },
        creator: 'u1'
    },
    {
        id: 'p2',
        title: "Emp... State Building",
        description: "One of the most famous sky scrappers in the world",
        imageUrl: "https://www.great-towers.com/sites/default/files/2019-07/tower_0.jpg",
        address: '20 W 34th St, New York, NY 10001',
        location: {
            lat: 40.7484405,
            long: -73.9878584
        },
        creator: 'u2'
    }
];

const UpdatePlace = () => {
    const [isLoading, setIsLoading] = useState(true);
    const placeId = useParams().placeId;


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

    const IdentifiedPlace = DUMMY_PLACES.find(p => p.id === placeId);

    useEffect(() => {
        if(IdentifiedPlace){
            setFormData({
                title: {
                    value: IdentifiedPlace.title,
                    isValid: true
                },
                description: {
                    value: IdentifiedPlace.description,
                    isValid: true
                }
            }, true);
            setIsLoading(false);

        }

    }, [setFormData, IdentifiedPlace]);

    const placeUpdateSubmitHandler = event => {
        event.preventDefault();
        console.log(formState.inputs);
    };

    if(!IdentifiedPlace){
        return <div className="center">
            <Card>
                <h2>Could not find place</h2>
            </Card>
        </div>
    }

    if(!formState.inputs.title.value){
        return (
            <div className="center">
                <h2>Loading...</h2>
            </div>
        );
    }
    return (
        <form className="place-form" onSubmit={ placeUpdateSubmitHandler }>
            <Input  
                id="title" 
                element="input" 
                type="text" 
                label="Title" 
                validators={[ VALIDATOR_REQUIRE() ]}
                errorText="Please enter a valid title"
                onInput={inputHandler}
                value={formState.inputs.title.value}
                valid={formState.inputs.title.isValid} />
    
            <Input  
                id="description" 
                element="textarea" 
                type="text" 
                label="Description" 
                validators={[ VALIDATOR_MINLENGTH(5) ]}
                errorText="Please enter a valid title(min. 5 characters)."
                onInput={inputHandler}
                value={formState.inputs.description.value }
                valid={formState.inputs.description.isValid} />
    
            <Button type="submit" disabled={!formState.isValid}>UPDATE PLACE</Button>
        </form>);
        
};

export default UpdatePlace;