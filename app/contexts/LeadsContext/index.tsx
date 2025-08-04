import { useSearchParams } from "next/navigation";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface Lead {
  id: string;
  [key: string]: any;
}

interface LeadsContextType {
  leads: Lead[];
  filteredLeads: Lead[];
  selectedLead: Lead | null;
  setSelectedLead: React.Dispatch<React.SetStateAction<Lead | null>>;
  applyFilters: () => void;
  clearFilters: () => void;
  incrementSelectedLead: () => void;
  decrementSelectedLead: () => void;
  refetchLeads: () => Promise<void>;
  refreshLeads: () => Promise<void>; // Added refreshLeads function
  selectedLeadActivities: any[];
  fetchSelectedLeadActivities: () => Promise<void>;
  isLoading: boolean;
  getLeadById: (leadId: string) => Lead | undefined;
  setFilteredLeads: (leads: Lead[]) => void;
  searchLeads: (searchQuery: string) => Promise<void>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filters: {
    leadStatus: string[] | null;
    leadType: string[] | null;
    state: string[] | null;
    county: string[] | null;
    city: string[] | null;
    zip: string[] | null;
    fromDate: string | null;
    toDate: string | null;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      leadStatus: string[] | null;
      leadType: string[] | null;
      state: string[] | null;
      county: string[] | null;
      city: string[] | null;
      zip: string[] | null;
      fromDate: string | null;
      toDate: string | null;
    }>
  >;
  areFiltersApplied: boolean;
  setAreFiltersApplied: React.Dispatch<React.SetStateAction<boolean>>;
  setLoadedFilterName: (name: string | null) => void;
  sortConfig: { key: string | null; direction: "asc" | "desc" };
  setSortConfig: React.Dispatch<
    React.SetStateAction<{ key: string | null; direction: "asc" | "desc" }>
  >;
  savedFilterName: string | null;
  setSavedFilterName: React.Dispatch<React.SetStateAction<string | null>>;
}

const LeadsContext = createContext<LeadsContextType | undefined>(undefined);

export const LeadsProvider: React.FC<{ children: React.ReactNode }> = (
  { children },
) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    leadStatus: [],
    leadType: [],
    state: [],
    county: [],
    city: [],
    zip: [],
    fromDate: null,
    toDate: null,
  });
  const [selectedLeadActivities, setSelectedLeadActivities] = useState<any[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [areFiltersApplied, setAreFiltersApplied] = useState<boolean>(false);
  const [loadedFilterName, setLoadedFilterName] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [savedFilterName, setSavedFilterName] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const selectLeadFromQueryParams = useCallback(() => {
    const leadIdFromQuery = searchParams.get("leadId");
    if (leadIdFromQuery) {
      const leadToSelect = leads.find((lead) => lead.id === leadIdFromQuery);
      if (leadToSelect) {
        setSelectedLead(leadToSelect);
      }
    }
  }, [leads, searchParams]);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/getLeads?filters=${encodeURIComponent(JSON.stringify(filters))}`,
      );
      if (!response.ok) throw new Error("Failed to fetch leads");
      const data = await response.json();
      setLeads(data);
      setFilteredLeads(
        data.filter((lead) => filters.leadStatus.includes(lead.lead_status_id)),
      ); // Apply leadStatus filter
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const refreshLeads = useCallback(async () => {
    await fetchLeads(); // Reuse fetchLeads to refresh data
  }, [fetchLeads]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const clearFilters = useCallback(() => {
    setFilters({
      leadStatus: [],
      leadType: [],
      state: [],
      county: [],
      city: [],
      zip: [],
      fromDate: null,
      toDate: null,
    });
    setFilteredLeads(leads); // Reset to all leads
    setAreFiltersApplied(false);
  }, [leads, setFilters, setFilteredLeads]);

  const incrementSelectedLead = useCallback(() => {
    if (filteredLeads.length === 0) return;
    const currentIndex = filteredLeads.findIndex((lead) =>
      lead.id === selectedLead?.id
    );
    const nextIndex = currentIndex === filteredLeads.length - 1
      ? 0
      : currentIndex + 1;
    setSelectedLead(filteredLeads[nextIndex]);
  }, [filteredLeads, selectedLead]);

  const decrementSelectedLead = useCallback(() => {
    if (filteredLeads.length === 0) return;
    const currentIndex = filteredLeads.findIndex((lead) =>
      lead.id === selectedLead?.id
    );
    const prevIndex = currentIndex === 0
      ? filteredLeads.length - 1
      : currentIndex - 1;
    setSelectedLead(filteredLeads[prevIndex]);
  }, [filteredLeads, selectedLead]);

  const refetchLeads = useCallback(async () => {
    await fetchLeads();
  }, [fetchLeads]);

  const fetchSelectedLeadActivities = useCallback(async () => {
    if (!selectedLead?.id) return;
    try {
      const response = await fetch(
        `/api/getLeadActivity?lead_id=${selectedLead.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) {
        throw new Error("Failed to fetch activities");
      }
      const data = await response.json();
      data.sort((a, b) =>
        new Date(b.action_date).getTime() - new Date(a.action_date).getTime()
      );
      setSelectedLeadActivities(data);

      // Fetch the quick_note using the getQuickNotes route
      const leadResponse = await fetch(
        `/api/getQuickNotes?lead_id=${selectedLead.id}`,
      );
      if (!leadResponse.ok) {
        throw new Error("Failed to fetch lead details");
      }
      const leadData = await leadResponse.json();
      setSelectedLead((prev) =>
        prev ? { ...prev, quick_note: leadData.quick_note } : prev
      );
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  }, [selectedLead?.id]);

  useEffect(() => {
    fetchSelectedLeadActivities();
  }, [selectedLead?.id, fetchSelectedLeadActivities]);

  const getLeadById = useCallback(
    (leadId: string) => leads.find((lead) => lead.id === leadId),
    [leads],
  );

  const searchLeads = useCallback(async (searchQuery: string) => {
    console.log("Searching leads:", searchQuery);
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/getLeads?searchQuery=${encodeURIComponent(searchQuery)}`,
      );
      if (!response.ok) throw new Error("Failed to fetch leads");
      const data = await response.json();
      console.log("Search results:", data);
      setLeads(data);
      setFilteredLeads(data);
    } catch (error) {
      console.error("Error searching leads:", error);
    } finally {
      setIsLoading(false);
    }
  }, [setLeads, setFilteredLeads, setIsLoading]);

  const applyFilters = useCallback(() => {
    setIsLoading(true);
    try {
      const filtered = leads.filter((lead) => {
        const stateMatch = !filters.state.length ||
          filters.state.includes(
            lead.leads_locations?.[0]?.locations?.state_code as string,
          );
        const countyMatch = !filters.county.length ||
          filters.county.includes(
            lead.leads_locations?.[0]?.locations?.county_id as string,
          );
        const cityMatch = !filters.city.length ||
          filters.city.includes(
            lead.leads_locations?.[0]?.locations?.city as string,
          );
        const zipMatch = !filters.zip.length ||
          filters.zip.includes(lead.leads_locations?.[0]?.locations?.zip);
        return stateMatch && countyMatch && cityMatch && zipMatch;
      });

      if (JSON.stringify(filtered) !== JSON.stringify(filteredLeads)) {
        setFilteredLeads(filtered);
        setSortConfig({ key: sortConfig.key, direction: sortConfig.direction }); // Trigger sorting logics
      }
    } catch (error) {
      console.error("Error applying filters:", error);
    } finally {
      setIsLoading(false);
    }
  }, [leads, filters, filteredLeads, setFilteredLeads, sortConfig]);

  useEffect(() => {
    applyFilters();
  }, [filters, applyFilters]);

  const contextValue = useMemo(() => ({
    leads,
    setLeads,
    filteredLeads,
    selectedLead,
    setSelectedLead,
    applyFilters,
    clearFilters,
    incrementSelectedLead,
    decrementSelectedLead,
    refetchLeads: fetchLeads,
    refreshLeads,
    selectedLeadActivities,
    fetchSelectedLeadActivities,
    isLoading,
    getLeadById,
    setFilteredLeads,
    searchLeads,
    filters,
    setFilters,
    areFiltersApplied,
    setAreFiltersApplied,
    searchTerm,
    setSearchTerm,
    setIsLoading,
    sortConfig,
    setSortConfig,
    savedFilterName,
    setSavedFilterName,
  }), [
    leads,
    filteredLeads,
    selectedLead,
    clearFilters,
    incrementSelectedLead,
    decrementSelectedLead,
    refetchLeads,
    selectedLeadActivities,
    fetchSelectedLeadActivities,
    isLoading,
    getLeadById,
    setFilteredLeads,
    searchLeads,
    filters,
    fetchLeads,
    areFiltersApplied,
    searchTerm,
    setSearchTerm,
    setIsLoading,
    setLoadedFilterName,
    sortConfig,
    setSortConfig,
    savedFilterName,
    setSavedFilterName,
  ]);

  return (
    <LeadsContext.Provider value={contextValue}>
      {children}
    </LeadsContext.Provider>
  );
};

export const useLeads = () => {
  const context = useContext(LeadsContext);
  if (context === undefined) {
    throw new Error("useLeads must be used within a LeadsProvider");
  }
  return context;
};

export default LeadsProvider;
