import React, { createContext, useState, useContext } from 'react';

const CropContext = createContext();

export const useCrop = () => useContext(CropContext);

export const CropProvider = ({ children }) => {
    const [selectedCrop, setSelectedCrop] = useState('Tomato');

    // Available crops for the hackathon MVP
    const crops = [
        'Tomato',
        'Potato',
        'Banana',
        'Mango',
        'Chilli'
    ];

    return (
        <CropContext.Provider value={{ selectedCrop, setSelectedCrop, crops }}>
            {children}
        </CropContext.Provider>
    );
};
