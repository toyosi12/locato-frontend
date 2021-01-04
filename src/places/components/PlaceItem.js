import React, { useContext, useState } from 'react';

import Card from '../../shared/UIElements/Card';
import Button from '../../shared/FormElements/Button';
import Modal from '../../shared/UIElements/Modal';

import './PlaceItem.css';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/UIElements/LoadingSpinner';

const PlaceItem = props => {
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const auth = useContext(AuthContext);
    const [showMap, setShowMap] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const openMapHandler = () => setShowMap(true);

    const closeMapHandler = () => setShowMap(false); 

    const showDeleteWarningHandler = () => {
        setShowConfirmModal(true);
    }

    const cancelDeleteHandler = () => {
        setShowConfirmModal(false);
    }

    const confirmDeleteHandler = async () => {
        setShowConfirmModal(false);
        try{
            await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${props.id}`, 
            'DELETE',
            null,
            {
                Authorization: 'Bearer ' + auth.token
            }
            )
            props.onDelete(props.id);

        }catch(err){}
    }

    return <React.Fragment>
            <ErrorModal error={error} onClear={ clearError } />
            <Modal show={showMap} 
                    onCancel={closeMapHandler}
                    header={props.address}
                    contentClass="place-item__model-content"
                    footerClass="place-item__modal-actions"
                    footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
            >
                <div className="map-container">
                    <h2>THE MAP!!!</h2>
                </div>
            </Modal>

            <Modal 
                show={showConfirmModal}
                onCancel={cancelDeleteHandler}
                header="Are you sure?" 
                footerClass="place-item__modal-actions" 
                footer={
                <React.Fragment>
                    <Button inverse onClick={cancelDeleteHandler}>CANCEL</Button>
                    <Button danger onClick={confirmDeleteHandler}>DELETE</Button>
                </React.Fragment>
            }>
                <p>Do you want to proceed and delete this place?
                    Please note that it can't be undone thereafter</p>
            </Modal>
                <li className="place-item">
                    { isLoading && <LoadingSpinner asOverlay />}
                    <Card className="place-item__content">
                        <div className="place-item__image">
                            <img src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt={props.title} />
                        </div>
                        <div className="place-item__info">
                            <h2>{props.title}</h2>
                            <h3>{props.address}</h3>
                            <p>{props.description}</p>
                        </div>
                        <div className="place-item__actions">
                        {auth.isLoggedIn && (
                            <Button inverse onClick={openMapHandler}>VIEW ON MAP</Button>
                        )}

                        {auth.userId === props.creatorId && (
                            <Button to={`/places/${props.id}`}>EDIT</Button>
                        )}

                        {auth.userId === props.creatorId && (
                            <Button danger onClick={showDeleteWarningHandler}>DELETE</Button>
                        )}
                        </div>

                    </Card>
                </li>
        </React.Fragment>
};

export default PlaceItem;