import {useState, useEffect} from 'react';

export const useCities = () => {

    const [cities, setCities] = useState([]);

    

    return {cities}
}