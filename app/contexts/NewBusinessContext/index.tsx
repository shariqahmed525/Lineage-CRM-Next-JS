import React, {
  createContext, useContext, useState, useEffect,
} from 'react';

// Define the context shape
interface NewBusinessContextType {
  leads: any[];
  carrierPlans: any[];
  carriers: any[];
  planCoverageTypes: any[];
  planPaymentDays: any[];
  planPaymentMethods: any[];
  planPaymentModes: any[];
  applicationStatuses: any[]; // Added applicationStatuses to the context shape
}

// Create the context with a default empty state
const NewBusinessContext = createContext<NewBusinessContextType | undefined>(undefined);
// Provider component
export const NewBusinessProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [leads, setLeads] = useState<any[]>([]);
  const [carrierPlans, setCarrierPlans] = useState<any[]>([]);
  const [carriers, setCarriers] = useState<any[]>([]);
  const [planCoverageTypes, setPlanCoverageTypes] = useState<any[]>([]);
  const [planPaymentDays, setPlanPaymentDays] = useState([]);
  const [planPaymentMethods, setPlanPaymentMethods] = useState([]);
  const [planPaymentModes, setPlanPaymentModes] = useState([]);
  const [applicationStatuses, setApplicationStatuses] = useState([]); // Added state for applicationStatuses

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch('/api/getLeads');
        if (!response.ok) throw new Error('Failed to fetch leads');
        const data = await response.json();
        setLeads(data);
      } catch (error) {
        console.error('Error fetching leads:', error);
      }
    };
    fetchLeads();
    // Call other fetch functions here
  }, []);

  useEffect(() => {
    const fetchCarrierPlans = async () => {
      try {
        const response = await fetch('/api/getCarrierPlans');
        if (!response.ok) throw new Error('Failed to fetch carrier plans');
        const data = await response.json();
        setCarrierPlans(data);
      } catch (error) {
        console.error('Error fetching carrier plans:', error);
      }
    };

    const fetchCarriers = async () => {
      try {
        const response = await fetch('/api/getCarriers');
        if (!response.ok) throw new Error('Failed to fetch carriers');
        const data = await response.json();
        setCarriers(data);
      } catch (error) {
        console.error('Error fetching carriers:', error);
      }
    };

    const fetchPlanOptions = async () => {
      try {
        const response = await fetch('/api/getPlanOptions');
        if (!response.ok) throw new Error('Failed to fetch plan options');
        const data = await response.json();
        setPlanCoverageTypes(data.plan_coverage_type);
        setPlanPaymentDays(data.plan_payment_day);
        setPlanPaymentMethods(data.plan_payment_method);
        setPlanPaymentModes(data.plan_payment_mode);
      } catch (error) {
        console.error('Error fetching plan options:', error);
      }
    };

    const fetchApplicationStatuses = async () => { // Added fetch function for application statuses
      try {
        const response = await fetch('/api/getApplicationStatuses');
        if (!response.ok) throw new Error('Failed to fetch application statuses');
        const data = await response.json();
        setApplicationStatuses(data);
      } catch (error) {
        console.error('Error fetching application statuses:', error);
      }
    };

    fetchCarrierPlans();
    fetchCarriers();
    fetchPlanOptions();
    fetchApplicationStatuses(); // Added call to fetchApplicationStatuses
  }, []);

  return (
    <NewBusinessContext.Provider value={{
      leads, carrierPlans, carriers, planCoverageTypes, planPaymentDays, planPaymentMethods, planPaymentModes, applicationStatuses,
    }}
    >
      {' '}
      {/* Added applicationStatuses to the context provider */}
      {children}
    </NewBusinessContext.Provider>
  );
};

// Hook to use the context
export const useNewBusinessContext = () => {
  const context = useContext(NewBusinessContext);
  if (context === undefined) {
    throw new Error('useNewBusinessContext must be used within a NewBusinessProvider');
  }
  return context;
};
