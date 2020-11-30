import React from 'react';
import PlaceList from '../components/PlaceList';
import { useParams } from 'react-router-dom';

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
const UserPlaces = () => {
    const userId = useParams().userId;
    const loadedPlaces = DUMMY_PLACES.filter(place => place.creator === userId);
    return <PlaceList items={ loadedPlaces } />
}

export default UserPlaces;