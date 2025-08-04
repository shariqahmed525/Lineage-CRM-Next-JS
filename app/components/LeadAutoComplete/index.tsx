import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from '@choc-ui/chakra-autocomplete';
import FuzzySearch from 'fuzzy-search';
import React, { ChangeEvent, useState, useMemo } from 'react';

import { useLeads } from '@/app/contexts/LeadsContext';


interface LeadAutoCompleteProps {
  onSelect: (selectedLeadId: string) => void;
  selectedLeadId: string;
}

const LeadAutoComplete: React.FC<LeadAutoCompleteProps> = ({ onSelect, selectedLeadId }) => {
  const { filteredLeads } = useLeads();
  const [inputValue, setInputValue] = useState('');

  // Memoize the preprocessed leads
  const preprocessedLeads = useMemo(() => filteredLeads.map(lead => ({
    ...lead,
    firstName: lead.persons?.[0]?.first_name,
    lastName: lead.persons?.[0]?.last_name,
    streetAddress: lead.leads_locations?.[0]?.locations?.street_address,
    city: lead.leads_locations?.[0]?.locations?.city,
    stateCode: lead.leads_locations?.[0]?.locations?.state_code,
  })), [filteredLeads]);

  const searcher = new FuzzySearch(preprocessedLeads, ['firstName', 'lastName', 'streetAddress', 'city', 'stateCode'], {
    caseSensitive: false,
  });

  const customFilter = (inputValue: string, optionValue: string) => {
    const searchResults = searcher.search(inputValue);
    return searchResults.some(result => result.id === optionValue);
  };

  const handleSelect = ({ item }) => {
    onSelect(item?.value);
    const selectedLead = filteredLeads.find(lead => lead.id === item?.value);
    if (selectedLead) {
      setInputValue(`${selectedLead.persons?.[0]?.first_name} ${selectedLead.persons?.[0]?.last_name}`);
    }
  };

  return (
    <AutoComplete openOnFocus onSelectOption={handleSelect} filter={customFilter}>
      <AutoCompleteInput
        name="leadSelect"
        variant="filled"
        placeholder="Select Lead or Leave Blank"
        value={inputValue}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
      />
      <AutoCompleteList>
        {preprocessedLeads.map((lead, index) => (
          <AutoCompleteItem
            key={`option-${index}`}
            value={lead.id}
            textTransform="capitalize"
          >
            {`${lead.persons?.[0]?.first_name} ${lead.persons?.[0]?.last_name} - ${lead.leads_locations?.[0]?.locations?.street_address} ${lead.leads_locations?.[0]?.locations?.city}, ${lead.leads_locations?.[0]?.locations?.state_code}`}
          </AutoCompleteItem>
        ))}
      </AutoCompleteList>
    </AutoComplete>
  );
};

export default LeadAutoComplete;
