import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, useToast, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, Stack,
} from '@chakra-ui/react';
import React, {
  ChangeEvent, useState, useRef, useEffect, useMemo, useCallback,
} from 'react';

import { useData } from '@/app/contexts/DataFetchContext';
import { useLeads } from '@/app/contexts/LeadsContext';

import BillingInformation from './BillingInformation';
import GeneralInfo from './GeneralInfo';
import PolicyDetails from './PolicyDetails';
import PolicyholderDetails from './PolicyholderDetails';
import ReplacedBusiness from './ReplacedBusiness';
import { useNewBusinessContext } from '../../contexts/NewBusinessContext';


interface NewBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewBusinessModal: React.FC<NewBusinessModalProps> = ({ isOpen, onClose }) => {
  const {
    applicationStatuses, carrierPlans, carriers, planCoverageTypes, planPaymentDays, planPaymentMethods, planPaymentModes,
  } = useNewBusinessContext();
  const { persons, refetchData, businessItems } = useData();
  const { selectedLead, filteredLeads, getLeadById } = useLeads();
  const toast = useToast();
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [applicationSubmitting, setApplicationSubmitting] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const initialFormState = {
    personSelect: selectedLead?.persons?.[0]?.person_id || '',
    policy_number: '',
    status: '',
    application_date: '',
    dob: '',
    carrier_1: '',
    carrier_plan_1: '',
    face_amount: '',
    monthly_premium: '',
    coverage_type: '',
    payment_day: '',
    effective_first_draft_date: '',
    payment_mode: '',
    payment_method: '',
    replacing_existing_coverage: 'false',
    replaced_policy_number: '',
    replaced_face_amount: '',
    replaced_coverage_type: '',
    replaced_carrier_1: '',
    replaced_premium_amount: '',
    has_bank_draft_been_stopped: false,
    age_on_replacement_date: '',
    age_on_effective_date: '',
    cancel_or_cash_in_date: '',
    first_name: '',
    last_name: '',
    middle_initial: '',
    gender: '',
    tobacco_use: '',
    street_address: '',
    street_address2: '',
    city: '',
    state_code: '',
    zip: '',
    county_id: '',
    phone1: '',
  };

  const [leadSelect, setLeadSelect] = useState(selectedLead?.persons?.[0]?.person_id || '');
  const [formData, setFormData] = useState(initialFormState);
  const [autofillForms, setAutofillForms] = useState(true);
  const [isPopoverOpen, setPopoverOpen] = useState(false);

  const handleAutofillToggle = () => {
    setAutofillForms(!autofillForms);
  };

  useEffect(() => {
    if (leadSelect && autofillForms) {
      const lead = getLeadById(leadSelect);
      if (lead) {
        const person = lead.persons[0];
        const location = lead.leads_locations[0].locations;
        if (person && location) {
          setFormData(prev => ({
            ...prev,
            personSelect: person.person_id,
            first_name: person.first_name || '',
            last_name: person.last_name || '',
            middle_initial: person.middle_initial || '',
            gender: person.gender || '',
            tobacco_use: location.tobacco_use || '',
            street_address: location.street_address || '',
            street_address2: location.street_address2 || '',
            city: location.city || '',
            state_code: location.state_code || '',
            zip: location.zip || '',
            county_id: location.county_id || '',
            phone1: person.phone1 || '',
            dob: person.dob || '',
          }));
        }
      }
    }
  }, [leadSelect, autofillForms, getLeadById]);

  const handleLeadSelect = (selectedLeadId: string) => {
    setLeadSelect(selectedLeadId);
  };

  const filteredPersons = useMemo(() => (leadSelect
    ? persons?.filter(person => filteredLeads
      ?.find(lead => lead.id === leadSelect)
      ?.leads_persons?.some(leadPerson => leadPerson.person_id === person.person_id))
    : persons),
  [persons, leadSelect, filteredLeads]);

  const personOptions = useMemo(() => {
    if (!filteredPersons || !Array.isArray(filteredPersons)) return null;
    return filteredPersons.map((person, index) => (
      <option key={index} value={person.person_id}>
        {person.first_name}
        {' '}
        {person.last_name}
        {' '}
        -
        {' '}
        {person.email_address}
      </option>
    ));
  }, [filteredPersons]);

  const statusOptions = useMemo(() => applicationStatuses?.map(status => (
    <option key={status.id} value={status.id}>
      {status.status_value}
    </option>
  )),
  [applicationStatuses]);

  const calculateAgeOnEffectiveDate = (dob: string, effectiveDate: string) => {
    if (!dob || !effectiveDate) return '';
    const birthDate = new Date(dob);
    const effective = new Date(effectiveDate);
    const ageDiff = effective.getFullYear() - birthDate.getFullYear();
    const m = effective.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && effective.getDate() < birthDate.getDate())) {
      return ageDiff - 1;
    }
    return ageDiff;
  };

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      age_on_effective_date:
          name === 'dob' || name === 'effective_first_draft_date'
            ? calculateAgeOnEffectiveDate(prev.dob,
              prev.effective_first_draft_date)
            : prev.age_on_effective_date,
    }));
  },
  [formData.dob, formData.effective_first_draft_date]);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApplicationSubmitting(true);

    const submissionData = {
      lead_id: leadSelect,
      person_id: formData.personSelect,
      ...formData,
    };
    delete submissionData.personSelect;

    try {
      const response = await fetch('/api/createApplication', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) throw new Error('Failed to create application');

      refetchData('getApplications');
      refetchData('getLeads');

      toast({
        title: 'New Policy Created',
        description: 'View the new business in your Book of Business',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      setApplicationSubmitting(false);
      onClose(); // Close the modal only if the request succeeds
    } catch (error) {
      setApplicationSubmitting(false);
      toast({
        title: 'Error',
        description: 'There was an error creating the new policy',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  },
  [leadSelect, formData, refetchData, toast, onClose]);

  const handleCloseClick = () => {
    setIsAlertDialogOpen(true);
  };

  const handleCancelClose = () => {
    setIsAlertDialogOpen(false);
  };

  const handleConfirmClose = () => {
    setIsAlertDialogOpen(false);
    onClose();
  };

  const handlePersonSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    if (selectedValue === 'add_new_person') {
      setPopoverOpen(true);
    } else {
      handleInputChange(event);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleCloseClick}
        size="4xl"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent overflowY="auto">
          <ModalHeader>New Policy</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody pb={6} overflowY="auto">
              <Stack direction="column" width="100%">
                <GeneralInfo
                  leadSelect={leadSelect}
                  formData={formData}
                  autofillForms={autofillForms}
                  isPopoverOpen={isPopoverOpen}
                  personOptions={personOptions}
                  handleLeadSelect={handleLeadSelect}
                  handlePersonSelectChange={handlePersonSelectChange}
                  handleInputChange={handleInputChange}
                  handleAutofillToggle={handleAutofillToggle}
                  setPopoverOpen={setPopoverOpen}
                />
              </Stack>
              <Stack direction="column" pt={8} width="100%" mb={4}>
                <PolicyholderDetails
                  formData={formData}
                  handleInputChange={handleInputChange}
                />
              </Stack>
              {formData.replacing_existing_coverage === 'true' && (
                <Stack direction="column" pt={8} width="100%" mb={4}>
                  <ReplacedBusiness
                    formData={formData}
                    planCoverageTypes={planCoverageTypes}
                    carriers={carriers}
                    handleInputChange={handleInputChange}
                  />
                </Stack>
              )}
              <Stack direction="column" pt={8} width="100%" mb={4}>
                <PolicyDetails
                  formData={formData}
                  carriers={carriers}
                  carrierPlans={carrierPlans}
                  planCoverageTypes={planCoverageTypes}
                  statusOptions={statusOptions}
                  handleInputChange={handleInputChange}
                />
              </Stack>
              <Stack direction="column" pt={8} width="100%" mb={4}>
                <BillingInformation
                  formData={formData}
                  planPaymentDays={planPaymentDays}
                  planPaymentModes={planPaymentModes}
                  planPaymentMethods={planPaymentMethods}
                  handleInputChange={handleInputChange}
                />
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button onClick={handleCloseClick}>Cancel</Button>
              <Button
                colorScheme="green"
                mr={3}
                type="submit"
                isLoading={applicationSubmitting}
              >
                Submit
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={isAlertDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={handleCancelClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Close Modal
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to close this form? Changes you made may not
              be saved.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={handleCancelClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleConfirmClose} ml={3}>
                Close
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default NewBusinessModal;