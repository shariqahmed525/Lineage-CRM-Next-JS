import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  useToast,
  Flex,
  Box,
  Text,
} from '@chakra-ui/react';
import React, { useState, useEffect, ChangeEvent } from 'react';

import { useCreateAppointment } from '@/app/(pages)/hooks/useCreateAppointment';
import { useLeads } from '@/app/contexts/LeadsContext';

interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStartDate?: string;
  initialStartTime?: string;
  triggerView?: 'month' | 'twoWeek' | 'day' | 'agenda';
}

const AddAppointmentModal: React.FC<AddAppointmentModalProps> = ({
  isOpen,
  onClose,
  initialStartDate,
  initialStartTime = '10:00',
  triggerView,
}) => {
  const toast = useToast();

  const { selectedLead, filteredLeads } = useLeads();
  const {
    mutateAsync: createAppointment,
    isError: isErrorCreatingAppointment,
    error: errorCreatingAppointment,
    isPending: isCreatingAppointment,
  } = useCreateAppointment();

  const formatTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    title: '',
    start_date: formatTodayDate(),
    start_time: '10:00',
    end_date: formatTodayDate(),
    end_time: '11:00',
    note: '',
    lead_id: null,
  });

  useEffect(() => {
    if (initialStartDate) {
      const formatDateTimeParts = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const formattedTime = `${hours}:${minutes}`;
        return [formattedDate, formattedTime];
      };

      const [startDate, startTime] = formatDateTimeParts(initialStartDate);
      setFormData((formData) => ({
        ...formData,
        start_date: startDate,
        start_time: initialStartTime,
        end_date: startDate,
      }));
    }
  }, [initialStartDate, initialStartTime, triggerView]);

  useEffect(() => {
    if (!formData.lead_id) {
      const startTime = formData.start_time
        ? new Date(`2021-01-01T${formData.start_time}:00`).toLocaleTimeString(
            'en-US',
            {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            }
          )
        : 'Meeting';
      setFormData((prevFormData) => ({
        ...prevFormData,
        title: `Meeting at ${startTime}`,
      }));
    }
  }, [formData.start_time, formData.lead_id]);

  useEffect(() => {
    if (selectedLead && selectedLead.leads_persons?.[0]?.persons) {
      const leadPerson = selectedLead.leads_persons[0].persons;
      const phoneNumber = leadPerson.phone1 || 'No Phone Number';
      const formattedPhoneNumber = phoneNumber.replace(
        /(\d{3})(\d{3})(\d{4})/,
        '$1-$2-$3'
      );
      const leadName = `${leadPerson.first_name} ${leadPerson.last_name}`;

      setFormData((prevFormData) => ({
        ...prevFormData,
        title: `${leadName} ${formattedPhoneNumber}`,
        lead_id: selectedLead.id,
      }));
    }
  }, [selectedLead]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    let newFormData = { ...formData, [name]: value };

    if (name === 'start_date') {
      newFormData = { ...newFormData, end_date: value };
    }

    if (name === 'start_time') {
      const [hours, minutes] = value.split(':').map(Number);
      const endTime = new Date();
      endTime.setHours(hours, minutes + 60, 0);

      const formattedEndHour = endTime.getHours().toString().padStart(2, '0');
      const formattedEndMinute = endTime
        .getMinutes()
        .toString()
        .padStart(2, '0');
      const formattedEndTime = `${formattedEndHour}:${formattedEndMinute}`;

      newFormData = { ...newFormData, end_time: formattedEndTime };
    } else if (name === 'lead_id') {
      const foundLead = filteredLeads.find((lead) => lead.id === value);

      if (foundLead) {
        const leadPerson = foundLead.leads_persons?.[0]?.persons;
        const phoneNumber = leadPerson?.phone1 || 'No Phone Number';
        const formattedPhoneNumber = phoneNumber.replace(
          /(\d{3})(\d{3})(\d{4})/,
          '$1-$2-$3'
        );
        const leadName = `${leadPerson?.first_name} ${leadPerson?.last_name}`;

        newFormData = {
          ...newFormData,
          title: `${leadName} | ${formattedPhoneNumber}`,
          lead_id: value,
        };
      } else {
        newFormData = { ...newFormData, lead_id: null };
      }
    }

    setFormData(newFormData);
  };

  const handleSubmit = async () => {
    const formatTimeToISO = (date: string, time: string) => {
      const [hours, minutes] = time.split(':').map(Number);
      const dateObj = new Date(`${date}T${time}:00`);

      const offset = -dateObj.getTimezoneOffset();
      const sign = offset >= 0 ? '+' : '-';
      const pad = (num: number) => num.toString().padStart(2, '0');
      const offsetHours = Math.abs(Math.floor(offset / 60));
      const offsetMinutes = Math.abs(offset % 60);
      const timezoneFormatted = `${sign}${pad(offsetHours)}:${pad(
        offsetMinutes
      )}`;

      const timestampWithTimeZone = `${dateObj.getFullYear()}-${pad(
        dateObj.getMonth() + 1
      )}-${pad(dateObj.getDate())}T${pad(hours)}:${pad(
        minutes
      )}:00.000${timezoneFormatted}`;

      return timestampWithTimeZone;
    };

    const startDateTimeISO =
      formData.start_date && formData.start_time
        ? formatTimeToISO(formData.start_date, formData.start_time)
        : null;
    const endDateTimeISO =
      formData.end_date && formData.end_time
        ? formatTimeToISO(formData.end_date, formData.end_time)
        : null;

    if (!startDateTimeISO || !endDateTimeISO) {
      return toast({
        title: 'Invalid date or time',
        description:
          'Please ensure both start and end dates and times are correctly filled.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }

    const payload = {
      title: formData.title,
      start_date: startDateTimeISO,
      end_date: endDateTimeISO,
      note: formData.note,
      lead_id: formData.lead_id,
    };

    await createAppointment(payload);

    toast({
      title: 'Appointment created successfully',
      description: '',
      status: 'success',
      duration: 9000,
      isClosable: true,
    });
    onClose();
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour += 1) {
      for (let minute = 0; minute < 60; minute += 30) {
        const hour12 = hour % 12 || 12;
        const amPm = hour < 12 ? 'AM' : 'PM';
        const time = `${hour12.toString().padStart(2, '0')}:${minute
          .toString()
          .padStart(2, '0')} ${amPm}`;
        const value = `${hour.toString().padStart(2, '0')}:${minute
          .toString()
          .padStart(2, '0')}`;
        times.push(
          <option key={value} value={value}>
            {time}
          </option>
        );
      }
    }
    return times;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Appointment</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl id="title" mb={5}>
            <FormLabel>Title</FormLabel>
            <Input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl id="lead_id" mb={5}>
            <FormLabel>Lead</FormLabel>
            <Select
              name="lead_id"
              value={formData.lead_id}
              onChange={handleInputChange}
            >
              <option value="">Select Lead</option>
              {filteredLeads?.map((lead) => (
                <React.Fragment key={lead.id}>
                  <option value={lead.id}>
                    {lead.leads_persons?.[0]?.persons?.first_name}{' '}
                    {lead.leads_persons?.[0]?.persons?.last_name} -{' '}
                    {lead.leads_locations?.[0]?.locations?.street_address}
                  </option>
                </React.Fragment>
              ))}
            </Select>
          </FormControl>
          <Flex justifyContent="space-between">
            <FormControl id="start_date" mb={5}>
              <FormLabel>Date</FormLabel>
              <Input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
              />
            </FormControl>
          </Flex>
          <Flex justifyContent="space-between">
            <FormControl id="start_time" mb={5} flexGrow={1}>
              <FormLabel>Start Time</FormLabel>
              <Select
                name="start_time"
                value={formData.start_time}
                onChange={handleInputChange}
              >
                {generateTimeOptions()}
              </Select>
            </FormControl>
            <FormControl id="end_time" mb={5} flexGrow={1}>
              <FormLabel>End Time</FormLabel>
              <Select
                name="end_time"
                value={formData.end_time}
                onChange={handleInputChange}
              >
                {generateTimeOptions()}
              </Select>
            </FormControl>
          </Flex>
          <FormControl id="note" mb={5}>
            <FormLabel>Note</FormLabel>
            <Textarea
              name="note"
              value={formData.note}
              onChange={handleInputChange}
            />
          </FormControl>
          {isErrorCreatingAppointment && (
            <Box>
              <Text color="red.500" fontSize="medium" fontWeight="semibold">
                {errorCreatingAppointment.message}
              </Text>
            </Box>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="green"
            onClick={handleSubmit}
            isLoading={isCreatingAppointment}
            disabled={isCreatingAppointment}
          >
            Add
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddAppointmentModal;
