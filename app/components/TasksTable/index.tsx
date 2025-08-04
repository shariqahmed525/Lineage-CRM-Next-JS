'use client';

import {
    SearchIcon, EditIcon, CloseIcon, AddIcon,
} from '@chakra-ui/icons';
import {
    Box,
    Button,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    Flex,
    Text,
    useDisclosure,
    HStack,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';

import { Task } from '../../../types/databaseTypes';
import CreateTaskModal from '../CreateTaskModal'; // Make sure you have a component like CreateLeadModal for tasks
import ErrorBoundary from '../ErrorBoundary';
import TaskStatusBadge from '../TaskStatusBadge'; // If you use a badge component for task statuses


const TasksTable = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [tasks, setTasks] = useState<Task[]>([]);

    // Similar to LeadsTable, you might want to add state for any additional task-related data you need

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch('/api/getTasks');
                const data: Task[] = await response.json();
                setTasks(data);
            } catch (error) {
                console.error('Failed to fetch tasks:', error);
            }
        };

        fetchTasks();
    }, []);

    return (
        <ErrorBoundary>
            <Box width="full" p={5}>
                <Flex justifyContent="space-between" alignItems="center" mb={5}>
                    {/* Similar UI elements from LeadsTable */}
                    <Flex alignItems="center" width="100%">
                        <Text fontSize="lg" fontWeight="bold" mr={8}>
                            {tasks.length}
                            {' '}
Tasks
                        </Text>
                        <InputGroup maxWidth="400px" mr={4}>
                            <InputLeftElement pointerEvents="none">
                                <SearchIcon color="gray.300" />
                            </InputLeftElement>
                            <Input placeholder="Search by Task ID / Description / Status" />
                        </InputGroup>
                        {/* Add any other filter buttons or icons you need here */}
                    </Flex>

                    {/* The CreateTaskModal component should be similar to CreateLeadModal but for tasks */}
                    <CreateTaskModal isOpen={isOpen} onClose={onClose} size="xl" />

                    <Flex>
                        {/* Adjust as necessary for task-specific actions */}
                        <Button leftIcon={<AddIcon />} variant="outline" onClick={onOpen} mr={4}>
              Create Task
                        </Button>
                        {/* If you have an upload functionality for tasks */}
                        <Button rightIcon={<AddIcon />} colorScheme="green">
              Upload
                        </Button>
                    </Flex>
                </Flex>

                <Table size="sm" variant="simple">
                    <Thead>
                        <Tr>
                            {/* Update the headers as per your Task data model */}
                            <Th>Task ID</Th>
                            <Th>Description</Th>
                            <Th>Assigned To</Th>
                            <Th>Due Date</Th>
                            <Th>Status</Th>
                            <Th>Created At</Th>
                            <Th>Updated At</Th>
                            <Th isNumeric>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {tasks?.map(task => (
                            <Tr key={task.task_id}>
                                {/* Update these cells to match your Task data model */}
                                <Td>{task.task_id}</Td>
                                <Td>{task.task_description}</Td>
                                <Td>{task.assigned_to}</Td>
                                <Td>
                                    {task.due_date ? new Date(task.due_date).toLocaleDateString('en-US', {
                                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
                                    }) : 'N/A'}
                                </Td>
                                <Td>
                                    <TaskStatusBadge taskStatusId={task.task_status_id} />
                                    {' '}
                                    {/* Assuming you have a badge component */}
                                </Td>
                                <Td>
                                    {task.created_at ? new Date(task.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
                                    }) : 'N/A'}
                                </Td>
                                <Td>
                                    {task.updated_at ? new Date(task.updated_at).toLocaleDateString('en-US', {
                                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
                                    }) : 'N/A'}
                                </Td>
                                <Td isNumeric>
                                    <HStack justifyContent="center">
                                        <IconButton
                                            aria-label="Edit task"
                                            icon={<EditIcon />}
                                            variant="outline"
                                            size="sm"
                                            mr={2}
                                        />
                                        <IconButton
                                            aria-label="Delete task"
                                            icon={<CloseIcon />}
                                            variant="outline"
                                            size="sm"
                                        />
                                    </HStack>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>
        </ErrorBoundary>
    );
};

export default TasksTable;

