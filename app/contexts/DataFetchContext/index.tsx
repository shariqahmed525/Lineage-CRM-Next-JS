'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import React, {
  createContext, useContext, useState, useEffect, useCallback, useMemo,
} from 'react';

import ErrorBoundary from '../../components/ErrorBoundary';
// Adjust the import path as necessary

interface DataContextType {
  leads: any[];
  persons: any[];
  businessItems: any[];
  setLeads: any;
  setBusinessItems: any;
  setBusinessStatuses: any;
  setPersons: any;
  businessStatuses: any[];
  planOptions: any[];
  setPlanOptions: any;
  carriers: any[];
  setCarriers: any;
  carrierPlans: any[];
  setCarrierPlans: any;
  counties: any[];
  setCounties: any;
  leadStatuses: any[];
  setLeadStatuses: any;
  allLeadSources: any[];
  setAllLeadSources: any;
  applicationStatuses: any[];
  setApplicationStatuses: any;
  locations: any[];
  setLocations: any;
  selectedLead: Lead | null;
  setSelectedLead: React.Dispatch<React.SetStateAction<Lead | null>>;
  leadSources: any[];
  setLeadSources: React.Dispatch<React.SetStateAction<any[]>>;
  getCarrierById: (carrierId: string) => any;
  getCarrierPlanById: (carrierPlanId: string) => any;
  getApplicationStatusById: (applicationStatusId: string) => any;
  getPersonById: (personId: string) => any;
  refetchData: (route: string) => Promise<void>;
  isLoading: boolean;
  phoneNumbers: any[];
  setPhoneNumbers: React.Dispatch<React.SetStateAction<any[]>>;
  fetchPhoneNumbers: () => Promise<void>;
  callbackPhoneNumbers: any[];
  setCallbackPhoneNumbers: React.Dispatch<React.SetStateAction<any[]>>; setSelectedFilters: React.Dispatch<React.SetStateAction<any>>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  'use client';

  const [leads, setLeads] = useState<any[]>([]);
  const [persons, setPersons] = useState([]);
  const [businessItems, setBusinessItems] = useState([]);
  const [businessStatuses, setBusinessStatuses] = useState([]);
  const [planOptions, setPlanOptions] = useState([]);
  const [carriers, setCarriers] = useState([]);
  const [carrierPlans, setCarrierPlans] = useState([]);
  const [counties, setCounties] = useState([]);
  const [leadStatuses, setLeadStatuses] = useState([]);
  const [applicationStatuses, setApplicationStatuses] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [leadSources, setLeadSources] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [phoneNumbers, setPhoneNumbers] = useState<any[]>([]);
  const [callbackPhoneNumbers, setCallbackPhoneNumbers] = useState<any[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<any[]>([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [selectedLeadActivities, setSelectedLeadActivities] = useState<any[]>([]);


  useEffect(() => {
    setIsLoading(true); // Set loading to true when the component mounts and fetches begin

    const fetchOtherData = async () => {
      const fetches = [
        fetch('/api/getPersons').then(res => res.json()).then(setPersons),
        fetch('/api/getApplications').then(res => res.json()).then(setBusinessItems),
        fetch('/api/getApplicationStatuses').then(res => res.json()).then(setBusinessStatuses),
        fetch('/api/getPlanOptions').then(res => res.json()).then(setPlanOptions),
        fetch('/api/getCarriers').then(res => res.json()).then(setCarriers),
        fetch('/api/getCarrierPlans').then(res => res.json()).then(setCarrierPlans),
        fetch('/api/getLeadStatuses').then(res => res.json()).then(setLeadStatuses),
        fetch('/api/getAllLeadSources').then(res => res.json()).then(setLeadSources),
        fetch('/api/getApplicationStatuses').then(res => res.json()).then(setApplicationStatuses),
        fetch('/api/getLocations').then(res => res.json()).then(setLocations),
        fetch('/api/twilio/listPhoneNumbers').then(res => res.json()).then(setPhoneNumbers),
        fetch('/api/twilio/getCallbackPhoneNumbers').then(res => res.json()).then(setCallbackPhoneNumbers),
      ];

      Promise.all(fetches?.map(p => p.catch(error => console.error('A fetch operation failed:', error))))
        .finally(() => {
          setIsLoading(false); // Set loading to false when all fetches are complete
        });
    };

    fetchOtherData();
  }, []);

  const refetchData = useCallback(async (route: string) => {
    setIsLoading(true); // Set loading to true when refetching begins
    console.log('Refetching data from DataFetchContext', route);
    const routeMap = {
      getPersons: () => fetch('/api/getPersons')
        .then(res => res.json())
        .then(setPersons),
      getApplications: () => fetch('/api/getApplications').then(res => res.json()).then(setBusinessItems),
      getApplicationStatuses: () => fetch('/api/getApplicationStatuses').then(res => res.json()).then(setBusinessStatuses),
      getPlanOptions: () => fetch('/api/getPlanOptions').then(res => res.json()).then(setPlanOptions),
      getCarriers: () => fetch('/api/getCarriers').then(res => res.json()).then(setCarriers),
      getCarrierPlans: () => fetch('/api/getCarrierPlans').then(res => res.json()).then(setCarrierPlans),
      getLeadStatuses: () => fetch('/api/getLeadStatuses').then(res => res.json()).then(setLeadStatuses),
      getAllLeadSources: () => fetch('/api/getAllLeadSources').then(res => res.json()).then(setLeadSources),
      getLocations: () => fetch('/api/getLocations').then(res => res.json()).then(setLocations),
      listPhoneNumbers: () => fetch('/api/twilio/listPhoneNumbers').then(res => res.json()).then(setPhoneNumbers),
      getCallbackPhoneNumbers: () => fetch('/api/twilio/getCallbackPhoneNumbers').then(res => res.json()).then(setCallbackPhoneNumbers),
    };

    const fetchFunction = routeMap[route];
    if (fetchFunction) {
      try {
        await fetchFunction();
      } catch (error) {
        console.error(`An error occurred while refetching ${route}:`, error);
      }
    } else {
      console.error(`Route ${route} not found for refetching.`);
    }
    setIsLoading(false); // Set loading to false when refetching is complete
  }, [setIsLoading, setLeads, setPersons, setBusinessItems, setBusinessStatuses, setPlanOptions, setCarriers, setCarrierPlans, setCounties, setLeadStatuses, setLeadSources, setApplicationStatuses, setLocations, setPhoneNumbers, setCallbackPhoneNumbers]);

  // Helper functions to get what is needed from the context
  const getLeadById = useCallback((leadId: string) => leads.find(lead => lead.id === leadId), [leads]);
  const getCarrierById = useCallback((carrierId: string) => carriers.find(carrier => carrier.carrier_id === carrierId), [carriers]);
  const getCarrierPlanById = useCallback((carrierPlanId: string) => carrierPlans.find(plan => plan.plan_id === carrierPlanId), [carrierPlans]);
  const getApplicationStatusById = useCallback((applicationStatusId: string) => applicationStatuses.find(status => status.id === applicationStatusId), [applicationStatuses]);
  const getPersonById = useCallback((personId: string) => persons.find(person => person.person_id === personId), [persons]);
  const getLeadStatusById = useCallback((leadStatusId: string) => leadStatuses.find(status => status.status_id === leadStatusId), [leadStatuses]);

  // Context value memoization
  const contextValue = useMemo(() => ({
    leads,
    persons,
    businessItems,
    businessStatuses,
    setLeads,
    setBusinessItems,
    setBusinessStatuses,
    setPersons,
    planOptions,
    setPlanOptions,
    carriers,
    setCarriers,
    carrierPlans,
    setCarrierPlans,
    counties,
    setCounties,
    leadStatuses,
    setLeadStatuses,
    applicationStatuses,
    setApplicationStatuses,
    locations,
    setLocations,
    getLeadById,
    getCarrierById,
    getCarrierPlanById,
    getApplicationStatusById,
    getPersonById,
    refetchData,
    selectedLead,
    setSelectedLead,
    leadSources,
    setLeadSources,
    isLoading,
    phoneNumbers,
    setPhoneNumbers,
    callbackPhoneNumbers,
    setCallbackPhoneNumbers,
    filteredLeads,
    setFilteredLeads,
    selectedFilters,
    setSelectedFilters,
    selectedLeadActivities,
    setSelectedLeadActivities,
    getLeadStatusById,
  }), [
    persons, businessItems, businessStatuses, planOptions, carriers, carrierPlans, counties, leadStatuses, applicationStatuses, locations, leadSources, isLoading, phoneNumbers, callbackPhoneNumbers,
    setBusinessItems, setBusinessStatuses, setPersons, setPlanOptions, setCarriers, setCarrierPlans, setCounties, setLeadStatuses, setApplicationStatuses, setLocations, setSelectedLead, setLeadSources, setPhoneNumbers, setCallbackPhoneNumbers,
    getLeadById, getCarrierById, getCarrierPlanById, getApplicationStatusById, getPersonById, refetchData, getLeadStatusById,
  ]);

  console.log('Chandler: DataFetchContext');

  return (
    <ErrorBoundary>
      <DataContext.Provider value={contextValue}>
        {children}
      </DataContext.Provider>
    </ErrorBoundary>
  );
};

export const useData = () => {
  'use client';

  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export default DataProvider;

