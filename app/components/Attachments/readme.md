# Design Document: Adding Frontend UX for Deleting Attachments

## Objective

Enhance the existing attachment management system by adding functionality to delete attachments associated with a lead object.

## Current State
The current implementation allows users to upload and view attachments for a lead. The attachments are fetched from Supabase storage and displayed in a grid. Users can click on an attachment to view it.

The current implementation for uploading and viewing attachmentsencapsulated within the `Attachments` component, which manages the state and UI interactions related to attachments for a lead:

1. **Uploading Attachments:**
   - Users select files to upload via an input element.
   - The selected file is handled by the `uploadFile` function.
   - This function uses the Supabase storage API to upload the file to a specific bucket associated with the lead's ID.
   - Upon successful upload, the UI is updated to show the new attachment.

2. **Viewing Attachments:**
   - Attachments are fetched from Supabase storage using the lead's ID.
   - The `fetchAttachments` function is called, which retrieves a list of attachments.
   - For each attachment, a signed URL is generated using another API endpoint (`/api/getSignedUrl`), which allows the attachment to be securely accessed.
   - These URLs are then used to display the attachments in a grid layout where users can click to view them.

3. **Deleting Attachments:**
   - Each attachment in the grid has a delete button.
   - Clicking the delete button prompts the user for confirmation to prevent accidental deletions.
   - Upon confirmation, the `handleDelete` function is called to remove the attachment from Supabase storage and update the UI.

## Component Structure and Functionality

### State Management:
- The component uses the `useState` hook to manage the state of attachments (`attachments`), the selected file (`file`), and the uploading status (`isUploading`).
- `attachments` is an array of objects, each containing the `name` and `url` of an attachment.
- `file` holds the currently selected file to be uploaded.
- `isUploading` is a boolean that indicates whether a file is currently being uploaded.

### Effects and Context:
- The `useEffect` hook is used to fetch attachments whenever the selected lead changes. This is dependent on `selectedLead`, which is provided by the `useLeads` context.
- `useLeads` is a context that provides the currently selected lead among other functionalities related to lead management.

### UI Interactions:
- The component renders a grid of attachments, each with an option to view or delete.
- A modal is used for uploading new attachments, which is controlled by the `useDisclosure` hook from Chakra UI.
- Deletion will be confirmed via a modal or a confirmation dialog to prevent accidental deletions.


## Requirements for New Features
1. **UI Changes**:
   - Add a delete button/icon to each attachment in the grid.
   - Confirm deletion with the user before proceeding.

2. **Backend Changes**:
   - Create an API endpoint to handle the deletion of attachments from Supabase storage.

3. **Frontend Changes**:
   - Implement the logic to call the new API endpoint and update the UI accordingly.

## Design

### Backend Changes:
1. Create an API endpoint /api/deleteAttachment that accepts the file path and deletes the file from Supabase storage.

```javascript
const handleDelete = async (fileName: string) => {
  if (!selectedLead?.id) return;

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
```

### Frontend Changes:
1. Add a delete icon (e.g., FaTimes) to each attachment box.
2. Use a modal or confirmation dialog to confirm the deletion.
1. Add a function to call the delete API endpoint.
2. Update the state to remove the deleted attachment from the list.


```javascript
  return (
    <Box>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {attachments.map((attachment) => (
          <Flex key={attachment.name} align="center" justify="space-between" p={4} borderWidth={1} borderRadius="md">
            <Box as="a" href={attachment.url} target="_blank" rel="noopener noreferrer">
              <FaFileAlt />
              <Text ml={2}>{attachment.name}</Text>
            </Box>
            <IconButton
              aria-label="Delete attachment"
              icon={<FaTimes />}
              onClick={() => handleDelete(attachment.name)}
              variant="ghost"
              colorScheme="red"
            />
          </Flex>
        ))}
      </SimpleGrid>
      <Button onClick={onOpen} mt={4}>Upload Attachment</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Attachment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input type="file" onChange={handleFileChange} />
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} mr={3}>Cancel</Button>
            <Button
              colorScheme="blue"
              onClick={handleUpload}
              isLoading={isUploading}
              disabled={!file}
            >
              Upload
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Attachments;

```
