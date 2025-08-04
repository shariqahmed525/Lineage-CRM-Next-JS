'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Select,
  Flex,
  Text,
  useColorModeValue,
  Button,
  IconButton,
} from '@chakra-ui/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { format, startOfMonth } from 'date-fns';
import React, { useState, useRef, useEffect } from 'react';

import { useAppointments } from '@/app/(pages)/hooks/useAppointments';

import AddAppointmentModal from '../AddAppointmentModal';
import NewAppointmentButton from '../NewAppointmentButton';
import ViewAppointmentModal from '../ViewAppointmentModal';

const CalendarComponent = () => {
  const bg = useColorModeValue('white', 'gray.800');
  const primaryText = useColorModeValue('black', 'white');

  const [initialCalendarView, setInitialCalendarView] =
    useState<string>('dayGridMonth');
  const [timezone, _] = useState('local');
  const [triggerView, setTriggerView] = useState<
    'month' | 'twoWeek' | 'day' | 'agenda'
  >('month');
  const [calendarView, setCalendarView] = useState(initialCalendarView);
  const [isViewAppointmentModalOpen, setIsViewAppointmentModalOpen] =
    useState(false);
  const [selectedAppointmentDetails, setSelectedAppointmentDetails] =
    useState(null);
  const [isAddAppointmentModalOpen, setIsAddAppointmentModalOpen] =
    useState(false);
  const [initialEndDate, setInitialEndDate] = useState<string | undefined>();
  const [initialStartDate, setInitialStartDate] = useState<
    string | undefined
  >();
  const [calendarViewDateRange, setCalendarViewDateRange] = useState('');
  const [currentDate, setCurrentDate] = useState<Date>();
  const calendarRef = useRef<FullCalendar>(null);

  const { data: appointments, refetch: refetchAppointments } = useAppointments(
    currentDate?.toISOString() ?? startOfMonth(new Date()).toISOString()
  );

  useEffect(() => {
    setInitialCalendarView(
      window?.innerWidth < 768 ? 'ThreeDay' : 'dayGridMonth'
    );
  }, []);

  useEffect(() => {
    if (calendarRef.current?.getApi().getDate()) {
      formatCalendarViewDateRange(
        calendarRef.current?.getApi().view.activeStart!,
        calendarRef.current?.getApi().view.activeEnd!
      );

      // uset startOfMonth here for caching purposes
      setCurrentDate(startOfMonth(calendarRef.current?.getApi().getDate()));
      refetchAppointments();
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setCalendarView(window?.innerWidth < 768 ? 'ThreeDay' : 'dayGridMonth');
    };

    window?.addEventListener('resize', handleResize);

    return () => {
      window?.removeEventListener('resize', handleResize);
    };
  }, []);

  const navigateCalendar = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      calendarRef.current?.getApi().prev();
    }

    if (direction === 'next') {
      calendarRef.current?.getApi().next();
    }

    formatCalendarViewDateRange(
      calendarRef.current?.getApi().view.activeStart!,
      calendarRef.current?.getApi().view.activeEnd!
    );

    setCurrentDate(calendarRef.current?.getApi().getDate());
    refetchAppointments();
  };

  // Function to change the current view of the calendar (month, week, day)
  const changeView = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newView = event.target.value as
      | 'dayGridMonth'
      | 'TwoWeek'
      | 'ThreeDay'
      | 'timeGridDay';
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.changeView(newView);
      setCalendarView(newView);
      if (newView === 'dayGridMonth') {
        setTriggerView('month');
      } else if (newView === 'TwoWeek') {
        setTriggerView('twoWeek');
      } else {
        setTriggerView('day'); // Assuming 'day' for other views
      }
    }
  };

  const formatCalendarViewDateRange = (activeStart: Date, activeEnd: Date) => {
    if (calendarView === 'timeGridDay') {
      return setCalendarViewDateRange(format(activeStart, 'MMM d, yyyy'));
    }

    return setCalendarViewDateRange(
      `${format(activeStart, 'MMM d')} – ${format(activeEnd, 'MMM d, yyyy')}`
    );
  };

  const handleDateClick = (arg: any) => {
    const clickedStartDate = new Date(arg.date);
    const clickedEndDate = new Date(
      clickedStartDate.getTime() + 30 * 60 * 1000
    ); // Changed to 30-minute slots for simplicity
    // Check if there's an overlapping appointment
    const overlappingAppointment = appointments?.find((appointment) => {
      const appointmentStartDate = new Date(appointment.start_date);
      const appointmentEndDate = new Date(appointment.end_date);
      return (
        clickedStartDate < appointmentEndDate &&
        clickedEndDate > appointmentStartDate
      );
    });

    if (overlappingAppointment) {
      setSelectedAppointmentDetails(overlappingAppointment);
      setIsViewAppointmentModalOpen(true);
    } else {
      const initialStartDate = clickedStartDate.toISOString();
      const initialEndDate = clickedEndDate.toISOString();
      setIsAddAppointmentModalOpen(true);
      setInitialStartDate(initialStartDate);
      setInitialEndDate(initialEndDate);
      if (calendarView === 'dayGridMonth' || calendarView === 'TwoWeek') {
        setTriggerView('month');
      } else {
        setTriggerView('day'); // Assuming 'day' for other views
      }
    }
  };

  const eventClick = async (info: any) => {
    const appointmentDetails = appointments?.find(
      (appointment) => appointment.appointment_id === info.event.id
    );

    if (appointmentDetails) {
      await setSelectedAppointmentDetails(appointmentDetails);
      await setIsViewAppointmentModalOpen(true);
    }
  };

  const goToToday = async () => {
    calendarRef.current?.getApi().today();
    calendarRef.current?.getApi().changeView(calendarView);

    formatCalendarViewDateRange(
      calendarRef.current?.getApi().view.activeStart!,
      calendarRef.current?.getApi().view.activeEnd!
    );

    setCurrentDate(startOfMonth(calendarRef.current?.getApi().getDate()!));
    refetchAppointments();
  };

  return (
    <Box
      p={5}
      bg={bg}
      color={primaryText}
      maxH="calc(100vh - 12vh)"
      minH="100%"
      overflowY="clip"
      position="relative"
    >
      {/* Calendar navigation and view selection */}
      <Flex
        direction={{ base: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        m={{ base: 2 }}
      >
        {/* Navigation buttons */}
        <Flex
          alignItems="center"
          justifyContent="space-between"
          width={{ base: '100%', sm: '100%', md: '50%' }}
          mb={{ base: 2, md: 0 }}
        >
          <IconButton
            aria-label="Previous"
            icon={<ChevronLeftIcon />}
            onClick={() => navigateCalendar('prev')}
          />
          <Button width="120px" onClick={goToToday}>
            Today
          </Button>
          <IconButton
            aria-label="Next"
            icon={<ChevronRightIcon />}
            onClick={() => navigateCalendar('next')}
          />
        </Flex>

        <Flex
          alignItems="flex-start"
          justifyContent="center"
          width={{ base: '100%', sm: '100%', md: '50%' }}
          mb={{ base: 2, md: 0 }}
        >
          <Text fontSize="l" fontWeight="semibold" mr={4}>
            {calendarViewDateRange}
          </Text>
        </Flex>

        {/* New appointment button and form */}
        <Flex
          justifyContent="flex-end"
          mb={2}
          mr={2}
          width={{ base: '100%', sm: '100%', md: '100px' }}
        >
          <NewAppointmentButton />
        </Flex>

        {/* View selection and current date range display */}
        <Flex
          justifyContent="flex-end"
          mb={2}
          mr={2}
          width={{ base: '100%', sm: '100%', md: 'auto' }}
        >
          <Select
            placeholder="Select view"
            onChange={changeView}
            value={calendarView}
            sx={{
              borderRadius: '8px',
              border: '1px solid',
              borderColor: 'var(--grey-2, #EAEAEA)',
            }}
          >
            <option value="dayGridMonth">Month</option>
            <option value="TwoWeek">2 Week</option>
            <option value="ThreeDay">3 Day</option>
            <option value="timeGridDay">Day</option>
          </Select>
        </Flex>
      </Flex>

      {/* FullCalendar component with configuration */}
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={calendarView}
        headerToolbar={false}
        editable
        selectable
        selectMirror
        dayMaxEvents
        weekends
        nowIndicator
        dateClick={handleDateClick}
        eventClick={eventClick}
        events={appointments?.map((appointment) => ({
          title: appointment.title!,
          start: appointment.start_date!,
          end: appointment.end_date!,
          allDay: !appointment.end_date,
          id: appointment.appointment_id,
        }))}
        contentHeight="73vh"
        themeSystem="standard"
        timeZone={timezone}
        allDaySlot={false} // This prop hides the option for all day events
        views={{
          dayGridMonth: {
            // Configuration for the month view can be customized as needed
          },
          TwoWeek: {
            type: 'dayGrid',
            duration: { weeks: 2 }, // Set the duration to 2 weeks
            buttonText: '2 Week', // Set the button text for the custom view
            dayCount: 14, // Ensure only two rows are displayed
          },
          ThreeDay: {
            type: 'timeGrid',
            duration: { days: 3 }, // Set the duration to 3 days
            buttonText: '3 day', // Set the button text for the custom view
          },
          timeGridDay: {
            // Configuration for the single day view can be customized as needed
          },
        }}
      />
      <ViewAppointmentModal
        isOpen={isViewAppointmentModalOpen}
        onClose={() => setIsViewAppointmentModalOpen(false)}
        appointmentDetails={selectedAppointmentDetails}
      />
      <AddAppointmentModal
        isOpen={isAddAppointmentModalOpen}
        onClose={() => setIsAddAppointmentModalOpen(false)}
        initialEndDate={initialEndDate}
        initialStartDate={initialStartDate}
        timezone={timezone} // Add this line
        triggerView={triggerView} // Pass the triggerView to the modal
      />
    </Box>
  );
};

// Export the CalendarComponent for use in other parts of the application
export default CalendarComponent;
