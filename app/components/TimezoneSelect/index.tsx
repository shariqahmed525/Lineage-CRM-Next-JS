import React from 'react';
import { Select } from '@chakra-ui/react';


interface TimezoneSelectProps {
  onChange: (timvalue: string;

}

const TimezoneSelect: React.FC<TimezoneSelectProps> = ({ onChange, value }) => (
    <Select
        placeholder="Select Timezone"
        onChange={e => onChange(e.target.value)}
        value={value}
        sx={{ borderRadius: '8px', border: '1px solid', borderColor: 'var(--grey-2, #EAEAEA)' }}
    >
        <option value="local">Local</option>
        <option value="America/New_York">Eastern Time</option>
        <option value="America/Chicago">Central Time</option>
        <option value="America/Denver">Mountain Time</option>
        <option value="America/Los_Angeles">Pacific Time</option>
    </Select>
);

export default TimezoneSelect;
