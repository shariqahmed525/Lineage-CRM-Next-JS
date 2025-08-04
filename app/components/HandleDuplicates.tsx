import { Button } from '@chakra-ui/react';


// Component to handle duplicates
export default function HandleDuplicates({ data, onResolved }: { data: any, onResolved: () => void }) {
    // Implementation of duplicates handling UI
    return (
        <div>
            {/* UI for resolving duplicates */}
            <Button onClick={onResolved}>Resolve Duplicates</Button>
        </div>
    );
}

