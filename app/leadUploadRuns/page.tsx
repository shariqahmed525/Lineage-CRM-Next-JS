// app/leadUploadRuns/page.tsx

'use client';

import {
    Box, Table, Thead, Tbody, Tr, Th, Td, chakra,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';


const LeadUploadRunsPage = () => {
    'use client';

    const [uploadRuns, setUploadRuns] = useState([]);

    useEffect(() => {
    // Fetch the upload runs data from the API
        fetch('/api/getUploadRuns')
            .then(response => response.json())
            .then(data => setUploadRuns(data));
    }, []);

    return (
        <Box width="full" maxWidth="1200px" margin="0 auto" p={4}>
            <chakra.h1 fontSize="3xl" mb={4}>Lead Upload Runs</chakra.h1>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>ID</Th>
                        <Th>File Path</Th>
                        <Th>Status</Th>
                        <Th>Error Message</Th>
                        <Th>Created At</Th>
                        <Th>Updated At</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {uploadRuns?.map(run => (
                        <Tr key={run.id}>
                            <Td>{run.id}</Td>
                            <Td>{run.file_path}</Td>
                            <Td>{run.status}</Td>
                            <Td>{run.error_message}</Td>
                            <Td>{new Date(run.created_at).toLocaleString()}</Td>
                            <Td>{new Date(run.updated_at).toLocaleString()}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
};

export default LeadUploadRunsPage;
