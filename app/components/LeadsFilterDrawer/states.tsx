import { FormControl, FormLabel, Select } from '@chakra-ui/react';
import React from 'react';

import { STATES } from '@/utils/constants';


interface StateSelectProps {
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  value: string[];
}

const StateSelect: React.FC<StateSelectProps> = ({ onChange, value }) => {
  const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    onChange(selectedOptions);
  };

  const selectedValue = value.length === 0 ? STATES : value;

  return (
    <FormControl id="state" mt={2}>
      <FormLabel>State</FormLabel>
      <Select onChange={handleStateChange} value={selectedValue} multiple size="lg" style={{ height: '22vh' }}>

        {STATES.map(state => (
          <option key={state.code} value={state.code} className="font-regular">{state.name}</option>
        ))}
      </Select>
    </FormControl>
  );
};

export default StateSelect;
