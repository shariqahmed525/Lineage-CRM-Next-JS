import {
  Box, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure, Input, Text, SimpleGrid, useBreakpointValue, Flex, IconButton, useToast,
} from '@chakra-ui/react';
import { createBrowserClient } from '@supabase/ssr';
import React, { useEffect, useState } from 'react';
import { FaFileAlt, FaTimes } from 'react-icons/fa';

import { useLeads } from '@/app/contexts/LeadsContext';


const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const Attachments: React.FC = () => {
  const [attachments, setAttachments] = useState<{ name: string; url: string }[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [file, setFile] = useState<File | null>(null);
  const { selectedLead } = useLeads();
  const [isUploading, setIsUploading] = useState(false);
  const toast = useToast();

  const fetchAttachments = async () => {
    if (!selectedLead?.id) return;
    const { data, error } = await supabase.storage.from('attachments').list(selectedLead.id);
    if (error) {
      console.error('Error fetching attachments:', error);
      return;
    }
    console.log('Set attachments', data);
    const attachmentDetails = await Promise.all(data?.map(async (attachment) => {
      // Use the new API endpoint to get the signed URL without the ?download parameter
      const response = await fetch(`/api/getSignedUrl?filePath=${selectedLead.id}/${attachment.name}`);
      if (!response.ok) {
        console.error('Error getting signed URL:', response.statusText);
        return null;
      }
      const urlData = await response.json();
      console.log('Public URL:', urlData);
      return { name: attachment.name, url: urlData.signedUrl };
    }) ?? []);
    console.log('Set attachment details', attachmentDetails);
    setAttachments(attachmentDetails.filter((detail): detail is { name: string; url: string } => detail !== null) as { name: string; url: string }[]);
  };

  useEffect(() => {
    fetchAttachments();
  }, [selectedLead]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;
    setFile(fileList[0]);
  };

  const uploadFile = async () => {
    if (!file || !selectedLead?.id) return;
    setIsUploading(true); // Start uploading
    const filePath = `${selectedLead.id}/${file.name}`;
    const { error } = await supabase.storage.from('attachments').upload(filePath, file);
    setIsUploading(false); // End uploading
    if (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Error uploading attachment',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    onClose();
    await fetchAttachments();
    toast({
      title: 'Attachment uploaded',
      description: 'Your file has been successfully uploaded.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  const handleAttachmentClick = (attachment: { name: string; url: string }) => {
    window.open(attachment.url, '_blank');
  };

  const handleDelete = async (fileName: string) => {
    if (!selectedLead?.id) {
      toast({
        title: 'Deletion Error',
        description: 'No lead selected.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  
    const confirmed = window.confirm('Are you sure you want to delete this attachment?');
    if (!confirmed) return;
  
    const filePath = `${selectedLead.id}/${fileName}`;
    const { error } = await supabase.storage.from('attachments').remove([filePath]);
  
    if (error) {
      toast({
        title: 'Error Deleting Attachment',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } else {
      setAttachments(prev => prev.filter(attachment => attachment.name !== fileName));
      toast({
        title: 'Attachment Deleted',
        description: 'The attachment has been successfully deleted.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Responsive columns count
  const columnsCount = useBreakpointValue({ base: 1, md: 2 });

  return (
    <Box mt="4">
      <Flex justifyContent="space-between" alignItems="center">
        <Text fontWeight="semibold">Attachments:</Text>
        <Button onClick={onOpen} size="sm" colorScheme="green" variant="outline" bg="transparent">Upload</Button>
      </Flex>
      <SimpleGrid columns={columnsCount} spacing={4} mt={4}>
        {attachments?.length > 0 ? (
          attachments.map(attachment => (
            <Box
              key={attachment.url}
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              w="full"
              h="100px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              onClick={() => handleAttachmentClick(attachment)}
              cursor="pointer"
            >
              <FaFileAlt />
              <Text isTruncated maxW="calc(100% - 24px)" ml={2}>
                {attachment.name}
              </Text>
              <IconButton
                aria-label="Delete attachment"
                icon={<FaTimes />}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the click from triggering the attachment click
                  handleDelete(attachment.name);
                }}
                variant="ghost"
                colorScheme="red"
                size="sm"
                ml="auto" // Push the icon to the right
              />
            </Box>
          ))
        ) : (
          <Text>No attachments found. Use the button above to upload.</Text>
        )}
      </SimpleGrid>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Attachment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input type="file" onChange={handleFileChange} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={uploadFile} isLoading={isUploading}>
              Upload
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Attachments;

