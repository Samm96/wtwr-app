import { useState, useEffect, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import ModalWithForm from '../ModalWithForm/ModalWithForm';
import Dropdown from '../Dropdown/Dropdown';
import CurrentTemperatureUnitContext from '../../contexts/CurrentTemperatureUnitContext';
import { useFormAndValidation } from '../../hooks/useFormAndValidation';
import { checkIfImageExists } from '../../utils/clothingModals';
import {
  clothingItems,
  weatherTypesInFahrenheit,
  weatherTypesInCelsius,
} from '../../utils/formConstants';
import './EditClothingModal.css';

/**
 * The **EditClothingModal** component will let users edit clothes to the database.
 *
 *  @author [Nuriya](https://github.com/NuriyaAkh)
 */
const EditClothingModal = ({
  isOpen,
  onClose,
  onSubmitEditGarment,
  currentGarment,
  errorMessage,
  resetErrorMessage,
}) => {
  // Component states & ref
  const formRef = useRef();
  const [isFormValid, setIsFormValid] = useState(false);
  const [garmentTypeChoice, setGarmentTypeChoice] = useState('');
  const [weatherTypeChoice, setWeatherTypeChoice] = useState('');
  const [showImagePreview, setShowImagePreview] = useState(true);

  //Get the current choice of the temperature unit by the user
  const { currentTemperatureUnit } = useContext(CurrentTemperatureUnitContext);

  const { values, isValid, errors, handleChange, resetForm } = useFormAndValidation([
    'user-garment-name',
    'user-garment-image-url',
  ]);

  useEffect(() => {
    setIsFormValid(false);
  }, [isOpen]);

  // Reset form values every time the popup opens
  useEffect(() => {
    const initialValues = {
      'user-garment-name': currentGarment.name || '',
      garmentType: currentGarment.type || '',
      weatherType: currentGarment.weather || '',
      'user-garment-image-url': currentGarment.imageUrl || '',
    };
    const initialErrorValues = {
      'user-garment-name': '',
      'user-garment-image-url': '',
    };
    resetForm({ ...initialValues }, { ...initialErrorValues }, true);
  }, [isOpen, resetForm, currentGarment]);

  // Event handlers
  const handleCloseImagePreviewButtonClick = () => setShowImagePreview(false);

  const handleInputChange = (event) => {
    resetErrorMessage();
    if (event.target.name === 'user-garment-image-url') {
      checkIfImageExists(event.target.value, (exists) => {
        if (exists) {
          setShowImagePreview(true);
        } else {
          setShowImagePreview(false);
        }
      });
    }
    handleChange(event);
  };

  const handleFormChange = () => {
    setIsFormValid(
      formRef.current.checkValidity() && garmentTypeChoice !== '' && weatherTypeChoice !== ''
    );
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (isValid) {
      onSubmitEditGarment({
        itemId: currentGarment._id,
        name: values['user-garment-name'],
        type: garmentTypeChoice,
        weather: weatherTypeChoice,
        imageUrl: values['user-garment-image-url'],
      });
    }
  };
  const handleCancelClick = () => onClose();

  // Set form elements classnames
  const setInputLabelClassName = (name) =>
    `form__input-label ${!isValid && errors[name] && `form__input-label_error`}`;
  const setInputClassName = (name) =>
    `form__input ${!isValid && errors[name] && `form__input_error`}`;
  const setErrorClassName = (name) =>
    `form__error ${!isValid && errors[name] && `form__error_visible`}`;
  const submitButtonClassName = `form__submit-button ${
    !isFormValid && 'form__submit-button_disabled'
  }`;

  return (
    <ModalWithForm
      formTitle="Edit garment"
      name="update-clothes"
      position="middle"
      width="normal"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleFormSubmit}
      onChange={handleFormChange}
      ref={formRef}
    >
      <div className="form__input-container">
        <div className="form__input-label-container">
          <label
            htmlFor="user-garment-name"
            className={setInputLabelClassName('user-garment-name')}
          >
            Name
          </label>
          <p id="user-garment-name-error" className={setErrorClassName('user-garment-name')}>
            {errors['user-garment-name'] && '(this is not a valid name)'}
          </p>
        </div>
        <input
          type="text"
          id="user-garment-name"
          name="user-garment-name"
          placeholder="Name"
          className={setInputClassName('user-garment-name')}
          value={values['user-garment-name']}
          onChange={handleInputChange}
          minLength="2"
          maxLength="40"
          required
        />
      </div>
      <div className="form__dropdown-container">
        <Dropdown
          dropdownName="garment-types"
          header="Type"
          options={clothingItems}
          onDropdownItemClick={setGarmentTypeChoice}
          userPreferenceValue={currentGarment.type || ''}
          setIsFormValid={setIsFormValid}
        />
      </div>
      <div className="form__dropdown-container">
        <Dropdown
          dropdownName="weather-types"
          header="Weather"
          options={
            currentTemperatureUnit === 'F' ? weatherTypesInFahrenheit : weatherTypesInCelsius
          }
          onDropdownItemClick={setWeatherTypeChoice}
          userPreferenceValue={currentGarment.weather || ''}
          setIsFormValid={setIsFormValid}
        />
      </div>
      <div className="form__input-container">
        <div className="form__input-label-container">
          <label
            htmlFor="user-garment-image-url"
            className={setInputLabelClassName('user-garment-image-url')}
          >
            Image
          </label>
          <p
            id="user-garment-image-url-error"
            className={setErrorClassName('user-garment-image-url')}
          >
            {errors['user-garment-image-url'] && '(this is not a valid url)'}
          </p>
        </div>
        <input
          type="url"
          id="user-garment-image-url"
          name="user-garment-image-url"
          placeholder="Image URL"
          className={setInputClassName('user-garment-image-url')}
          value={values['user-garment-image-url']}
          onChange={handleInputChange}
          required
        />
      </div>
      {/* If Image URL actully exists & there is no validation error, then display preview */}
      {showImagePreview && !errors['user-garment-image-url'] && (
        <div className="form__image-preview-container">
          <img
            src={values['user-garment-image-url']}
            alt="new garment"
            className="form__image-preview"
          />
          <button
            className="form__image-preview-close"
            type="button"
            aria-label="Close image preview"
            onClick={handleCloseImagePreviewButtonClick}
          />
        </div>
      )}
      <div className="form__button-grp">
        <button
          type="submit"
          className={submitButtonClassName}
          disabled={!isFormValid}
          aria-label="Update garment"
        >
          Update garment
        </button>
        <button
          type="button"
          className="form__secondary-button"
          aria-label="Cancel"
          onClick={handleCancelClick}
        >
          Cancel
        </button>
        {errorMessage && <p className="form__invalid-message">{errorMessage}</p>}
      </div>
    </ModalWithForm>
  );
};

EditClothingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmitEditGarment: PropTypes.func.isRequired,
  currentGarment: PropTypes.object.isRequired,
};

export default EditClothingModal;
